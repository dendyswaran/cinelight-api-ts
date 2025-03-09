import { DataSourceConfig } from '../infrastructure/database/data-source';
import { User } from '../domain/entities/User';

async function createAdminUser() {
  const dataSource = await DataSourceConfig.initialize();

  try {
    // Initialize connection to database

    console.log('Database connection initialized');

    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });

    if (existingAdmin) {
      console.log('Admin user already exists');
      await dataSource.destroy();
      return;
    }

    // Create new admin user
    const adminUser = userRepository.create({
      username: 'admin',
      password: 'admin', // This will be hashed by the @BeforeInsert hook
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      role: 'admin'
    });

    await userRepository.save(adminUser);
    console.log('Admin user created successfully');

    // Close the database connection
    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
    dataSource.destroy();
    process.exit(1);
  }
}

// Run the function
createAdminUser().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
