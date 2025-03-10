import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEquipmentBundleTables1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create equipment_bundles table
    await queryRunner.query(`
      CREATE TABLE "equipment_bundles" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "dailyRentalPrice" decimal(12,2) NOT NULL,
        "discount" decimal(5,2) NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_bundles" PRIMARY KEY ("id")
      )
    `);

    // Create equipment_bundle_items table
    await queryRunner.query(`
      CREATE TABLE "equipment_bundle_items" (
        "id" SERIAL NOT NULL,
        "bundleId" integer NOT NULL,
        "equipmentId" integer NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_bundle_items" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "equipment_bundle_items" 
      ADD CONSTRAINT "FK_equipment_bundle_items_bundle" 
      FOREIGN KEY ("bundleId") REFERENCES "equipment_bundles"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "equipment_bundle_items" 
      ADD CONSTRAINT "FK_equipment_bundle_items_equipment" 
      FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") 
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "equipment_bundle_items" DROP CONSTRAINT "FK_equipment_bundle_items_equipment"`
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_bundle_items" DROP CONSTRAINT "FK_equipment_bundle_items_bundle"`
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "equipment_bundle_items"`);
    await queryRunner.query(`DROP TABLE "equipment_bundles"`);
  }
}
