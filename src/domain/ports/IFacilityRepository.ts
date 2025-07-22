export interface IFacilityRepository {
  getFacilitiesIdForProperty(propertyId: number): Promise<Array<number>>;

  doAllExist(facilitiesId: Array<number>): Array<number>;

  addFacilitiesToProperty(
    propertyId: number,
    idsToAdd: Array<number>,
  ): Promise<void>;

  removeFacilitiesFromProperty(
    propertyId: number,
    idsToRemove: Array<number>,
  ): Promise<void>;
}
