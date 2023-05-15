import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateProductPrice1683558608482
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'productPrice',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'productId',
            type: 'uuid',
          },
          {
            name: 'tableName',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'height',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'heightUnity',
            type: 'varchar',
          },
          {
            name: 'width',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'widthUnity',
            type: 'varchar',
          },
          {
            name: 'depth',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'depthUnity',
            type: 'varchar',
          },
          {
            name: 'depthOpen',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'depthOpenUnity',
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
      'productPrice',
      new TableForeignKey({
        name: 'FKProductProductPrice',
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        columnNames: ['productId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('productPrice');
    await queryRunner.dropForeignKey('productPrice', 'FKProductProductPrice');
  }
}
