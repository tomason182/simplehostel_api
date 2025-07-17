import { AccessControl } from "../entities/AccessControl";

export interface IAccessControlRepository {
  save(accessControl: AccessControl): Promise<void>;
}
