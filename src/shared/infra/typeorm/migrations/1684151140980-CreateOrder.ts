import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrder1684151140980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
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
            name: 'orderNumber',
            type: 'varchar',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'orderDate',
            type: 'Timestamp',
          },
          {
            name: 'description',
            type: 'varchar',
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
            name: 'canceled',
            type: 'boolean',
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
    await queryRunner.dropTable('order');
  }
}
