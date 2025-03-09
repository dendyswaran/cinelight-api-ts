import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEquipmentAndQuotationTables1709980000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create equipment_categories table
    await queryRunner.query(`
      CREATE TABLE "equipment_categories" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment_categories" PRIMARY KEY ("id")
      )
    `);

    // Create equipment table
    await queryRunner.query(`
      CREATE TABLE "equipment" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "dailyRentalPrice" decimal(12,2) NOT NULL,
        "quantity" integer NOT NULL,
        "categoryId" integer NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_equipment" PRIMARY KEY ("id"),
        CONSTRAINT "FK_equipment_category" FOREIGN KEY ("categoryId") REFERENCES "equipment_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create quotation status enum
    await queryRunner.query(`
      CREATE TYPE "quotation_status_enum" AS ENUM (
        'draft',
        'sent',
        'approved',
        'rejected',
        'converted_to_do',
        'converted_to_invoice'
      )
    `);

    // Create quotations table
    await queryRunner.query(`
      CREATE TABLE "quotations" (
        "id" SERIAL NOT NULL,
        "quotationNumber" character varying NOT NULL,
        "clientName" character varying NOT NULL,
        "clientEmail" character varying,
        "clientPhone" character varying,
        "clientAddress" text,
        "projectName" character varying,
        "projectDescription" text,
        "issueDate" date NOT NULL,
        "validUntil" date,
        "subtotal" decimal(12,2) NOT NULL DEFAULT '0',
        "tax" decimal(12,2) NOT NULL DEFAULT '0',
        "discount" decimal(12,2) NOT NULL DEFAULT '0',
        "total" decimal(12,2) NOT NULL DEFAULT '0',
        "status" "quotation_status_enum" NOT NULL DEFAULT 'draft',
        "notes" text,
        "terms" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quotations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_quotation_number" UNIQUE ("quotationNumber")
      )
    `);

    // Create quotation_sections table
    await queryRunner.query(`
      CREATE TABLE "quotation_sections" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "date" date NOT NULL,
        "quotationId" integer NOT NULL,
        "description" text,
        "subtotal" decimal(12,2) NOT NULL DEFAULT '0',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quotation_sections" PRIMARY KEY ("id"),
        CONSTRAINT "FK_quotation_sections_quotation" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create item_type enum
    await queryRunner.query(`
      CREATE TYPE "item_type_enum" AS ENUM (
        'rental',
        'service',
        'sale'
      )
    `);

    // Create quotation_items table
    await queryRunner.query(`
      CREATE TABLE "quotation_items" (
        "id" SERIAL NOT NULL,
        "quotationId" integer NOT NULL,
        "sectionId" integer,
        "equipmentId" integer,
        "itemName" character varying NOT NULL,
        "description" text,
        "quantity" integer NOT NULL,
        "unit" character varying DEFAULT 'Set',
        "pricePerDay" decimal(12,2) NOT NULL,
        "days" integer NOT NULL DEFAULT 1,
        "total" decimal(12,2) NOT NULL,
        "remarks" character varying,
        "type" "item_type_enum" NOT NULL DEFAULT 'rental',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quotation_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_quotation_items_quotation" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_quotation_items_section" FOREIGN KEY ("sectionId") REFERENCES "quotation_sections"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT "FK_quotation_items_equipment" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "quotation_items"`);
    await queryRunner.query(`DROP TYPE "item_type_enum"`);
    await queryRunner.query(`DROP TABLE "quotation_sections"`);
    await queryRunner.query(`DROP TABLE "quotations"`);
    await queryRunner.query(`DROP TYPE "quotation_status_enum"`);
    await queryRunner.query(`DROP TABLE "equipment"`);
    await queryRunner.query(`DROP TABLE "equipment_categories"`);
  }
}
