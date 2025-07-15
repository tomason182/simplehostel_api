import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import path from "path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import mjml2html from "mjml";
import Handlebars from "handlebars";
import { convert } from "html-to-text";

export class EmailServiceSMTP {
  private transporter: Transporter;

  constructor(config: nodemailer.TransportOptions) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
    language = "es",
  ): Promise<void> {
    try {
      // 1. Selectionar el idioma

      // 2. Cargar la plantilla de mjml
      const mjmlTemplatePath = path.join(
        __dirname,
        "./templates/",
        `${templateName}.mjml`,
      );
      const mjmlTemplate = await fs.readFile(mjmlTemplatePath, "utf-8");

      // 3. Compilar datos con handlebars
      const compiledTemplate = Handlebars.compile(mjmlTemplate);
      const mjmlWithData = compiledTemplate(data);

      const { html } = mjml2html(mjmlWithData, { minify: false }); // No minificamos html aqui. Vulneravilidad html-minifier.

      // 4. Minificar HTML

      // 5. confifurar opciones de correo.
      const mailOptions: SendMailOptions = {
        from: `"SimpleHostel" <${process.env.EMAIL_ACCOUNT}>`,
        to: to,
        subject: subject,
        html: html,
        text: convert(html),
        replyTo: "support@simplehostel.net",
        headers: {
          "List-Unsubscribe": `<mailto:soporte@simplehostel.net?subject=Unsubscribe>, <https://simplehostel.net/unsubscribe-info>`,
          "X-Mailer": "SimpleHostel Mailer",
        },
        messageId: `<${crypto.randomUUID()}@simplehostel.net>`,
      };

      // 6. Enviar correo
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Fail to send email: ${err.message}`);
      } else {
        throw new Error("Fail to send email. Unkown error");
      }
    }
  }
}
