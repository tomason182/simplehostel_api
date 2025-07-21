import { PropertyImage } from "../domain/entities/PropertyImage";
import sharp from "sharp";
import fs from "node:fs/promises";
import { IPropertyImageRepository } from "../domain/ports/IPropertyImageRepository";
import { IFileStorage } from "../domain/ports/IFileStorage";
import { PropertyImageDTO } from "../dto/PropertyImageDTO";

export class PropertyImageService {
  constructor(
    private propertyImageRepository: IPropertyImageRepository,
    private fileStorage: IFileStorage,
  ) {
    this.propertyImageRepository = propertyImageRepository;
    this.fileStorage = fileStorage;
  }

  async getImages(propertyId: number): Promise<Array<PropertyImage>> {
    const images =
      await this.propertyImageRepository.findAllPropertyImages(propertyId);

    return images;
  }

  async uploadImages(
    propertyId: number,
    files: Array<Express.Multer.File>,
  ): Promise<{ status: string; msg: string; rejectedImages: Array<string> }> {
    const tempFinalPath = [];
    try {
      // 1. Chequear no exceder el numero maximo de imagenes permitido (10)
      const propertyImageStored =
        await this.propertyImageRepository.findAllPropertyImages(propertyId);

      if (propertyImageStored.length + files.length > 10) {
        return {
          status: "error",
          msg: "MAXIMUM_IMAGES_REACH",
          rejectedImages: [],
        };
      }

      const filesRejected = [];
      const imagesToSave = [];

      for (const file of files) {
        // 2. Comprobamos el tamaño de la imagen
        const metadata = await sharp(file.path).metadata();

        if (metadata.height < 1000) {
          filesRejected.push(file.originalname);
          continue;
        }

        // 3. Procesar la imagen con sharp
        const processedImageBuffer = await sharp(file.path)
          .resize({ height: 960 })
          .webp({ quality: 80 })
          .toBuffer();

        const filename = file.filename.split(".")[0] + ".webp";
        const destinationSubfolder = `properties/${propertyId}`;

        // 4. Guardar la imagen procesada.
        const finalPath = await this.fileStorage.save(
          processedImageBuffer,
          filename,
          destinationSubfolder,
        );

        tempFinalPath.push(finalPath.relativeUrl);

        // 5. Crear la entidad Imagen y adjuntarla a la lista para subir
        const isPrimary = false; // No se como pasar isPrimary en req.file. Seteamos todas flase por ahora.
        const imageDTO: PropertyImageDTO = {
          id: null,
          propertyId: propertyId,
          filename: filename,
          mimetype: "image/webp",
          altText: null,
          sizeBytes: processedImageBuffer.length,
          path: finalPath.publicUrl,
          isPrimary: isPrimary,
          createdAt: null,
        };

        const image = PropertyImage.fromDTO(imageDTO);
        imagesToSave.push(image);
      }

      // 6. Guardar las url de las imágenes en la base de datos.
      if (imagesToSave.length > 0) {
        await this.propertyImageRepository.save(imagesToSave);
      }

      return {
        status: "ok",
        msg: "IMAGES_UPLOAD",
        rejectedImages: filesRejected,
      };
    } catch (err) {
      // 7. Si ocurre un error borrar la imagen guardada
      console.error("Error al guardar las imagenes: ", err);

      await Promise.allSettled(
        tempFinalPath.map((path) => {
          fs.unlink(path).catch((err) => {
            console.error(
              `No se pudo eliminar el archivo ${path}: ${err.message}`,
            );
          });
        }),
      );

      return {
        status: "error",
        msg: "UPLOAD_FAILED",
        rejectedImages: [],
      };
    }
  }

  async deleteImage(
    propertyId: number,
    imageId: number,
  ): Promise<{ status: string; msg: string }> {
    // 1. Buscar la imagen por Id. Sirve para obtener el path
    const image = await this.propertyImageRepository.findById(
      propertyId,
      imageId,
    );

    if (!image) {
      return {
        status: "error",
        msg: "IMAGE_NOT_FOUND",
      };
    }

    const path = image.getPath();

    if (!path) {
      return {
        status: "error",
        msg: "PATH_NOT_FOUND",
      };
    }

    // 2. Primero borramos de la bd porque es reversible.
    await this.propertyImageRepository.delete(imageId);
    // 3. Segundo borrarmos del disco.
    await this.fileStorage.delete(path);

    return {
      status: "ok",
      msg: "IMAGE_DELETED",
    };
  }
}

(PropertyImageService.prototype.uploadImages as any).useTransaction = true;
(PropertyImageService.prototype.deleteImage as any).useTransaction = true;
