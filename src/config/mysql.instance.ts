import { MySQLConnect } from "./MySQLConnect";

const mysql = new MySQLConnect();

export async function initMysql(): Promise<void> {
  await mysql.createConnectionPool();
}

export function getMySQL(): MySQLConnect {
  return mysql;
}
