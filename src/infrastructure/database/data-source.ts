import { DataSource } from "typeorm";
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} from "../config/constants";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false, // Set to false in production
  logging: ["error", "warn"],
  entities: ["src/domain/entities/**/*.ts"],
  migrations: ["src/infrastructure/database/migrations/**/*.ts"],
  subscribers: ["src/infrastructure/database/subscribers/**/*.ts"],
});
