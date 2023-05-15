import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClient1683403893212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'client',
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
            name: 'companyName',
            type: 'varchar',
          },
          {
            name: 'comercialName',
            type: 'varchar',
          },
          {
            name: 'streetName',
            type: 'varchar',
          },
          {
            name: 'streetNumber',
            type: 'varchar',
          },
          {
            name: 'neighborhood',
            type: 'varchar',
          },
          {
            name: 'complement',
            type: 'varchar',
          },
          {
            name: 'cnpj',
            type: 'varchar',
          },
          {
            name: 'ie',
            type: 'varchar',
          },
          {
            name: 'cityCode',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'stateCode',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'financialPendency',
            type: 'boolean',
          },
          {
            name: 'isNew',
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
    await queryRunner.dropTable('client');
  }
}
