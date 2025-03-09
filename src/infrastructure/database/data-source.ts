import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } from '../config/constants';
export class DataSourceConfig {
  private static instance: DataSource;

  public static async initialize(): Promise<DataSource> {
    if (!DataSourceConfig.instance) {
      try {
        const options: DataSourceOptions = {
          type: 'postgres',
          host: DB_HOST,
          port: DB_PORT,
          username: DB_USERNAME,
          password: DB_PASSWORD,
          database: DB_DATABASE,
          entities: ['src/domain/entities/**/*.ts'],
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV !== 'production',
          extra: {
            // Pool configuration
            pool: {
              max: 10,
              min: 0,
              idleTimeoutMillis: 30000
            }
          }
        };

        const dataSource = new DataSource(options);
        DataSourceConfig.instance = await dataSource.initialize();

        console.log('Database connection initialized successfully');

        // Verify connection by running a test query
        await DataSourceConfig.instance.query('SELECT 1');
        console.log('Database connection verified');
      } catch (error) {
        console.error('Failed to initialize database connection:', error);
        throw error;
      }
    }

    return DataSourceConfig.instance;
  }

  public static getInstance(): DataSource {
    if (!DataSourceConfig.instance) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    return DataSourceConfig.instance;
  }
}
