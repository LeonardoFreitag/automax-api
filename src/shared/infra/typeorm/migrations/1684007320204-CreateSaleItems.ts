import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSaleItems1684007320204
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'saleItems',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'saleId',
            type: 'uuid',
          },
          {
            name: 'productId',
            type: 'varchar',
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
            name: 'tableId',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'notes',
            type: 'varchar',
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
    await queryRunner.createForeignKey(
      'saleItems',
      new TableForeignKey({
        name: 'FKSaleSaleItems',
        referencedTableName: 'sale',
        referencedColumnNames: ['id'],
        columnNames: ['saleId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('saleItems');
    await queryRunner.dropForeignKey('saleItems', 'FKSaleSaleItems');
  }
}
