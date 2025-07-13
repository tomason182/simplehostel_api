import { MySQLConnect } from "./MySQLConnect";

let instance: MySQLConnect | null = null;

export default function getMySQLInstance() {
  if (!instance) {
    instance = new MySQLConnect();
  }

  return instance;
}
