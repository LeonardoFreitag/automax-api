import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSale1684006926442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sale',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customerId',
            type: 'uuid',
          },
          {
            name: 'selerId',
            type: 'uuid',
          },
          {
            name: 'saleNumber',
            type: 'varchar',
          },
          {
            name: 'saleDate',
            type: 'Timestamp',
          },
          {
            name: 'clientId',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'notes',
            type: 'varchar',
          },
          {
            name: 'finished',
            type: 'boolean',
          },
          {
            name: 'sent',
            type: 'boolean',
          },
          {
            name: 'refused',
            type: 'boolean',
          },
          {
            name: 'refusedNotes',
            type: 'varchar',
          },
          {
            name: 'returned',
            type: 'boolean',
          },
          {
            name: 'returnedNotes',
            type: 'varchar',
          },
          {
            name: 'signatureFileName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'signatureUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'signatureBase64',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sale');
  }
}
