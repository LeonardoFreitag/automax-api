import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProduct1683558433527 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
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
            name: 'code',
            type: 'varchar',
          },
          {
            name: 'reference',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'unity',
            type: 'varchar',
          },
          {
            name: 'groupId',
            type: 'varchar',
          },
          {
            name: 'group',
            type: 'varchar',
          },
          {
            name: 'photoFileName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'photoUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'photoSize',
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
    await queryRunner.dropTable('product');
  }
}
