import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateSalePaymentForm1684007500792
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'salePaymentForm',
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
            name: 'paymentFormId',
            type: 'uuid',
          },
          {
            name: 'descripriont',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'installments',
            type: 'decimal',
            precision: 15,
            scale: 2,
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
      'salePaymentForm',
      new TableForeignKey({
        name: 'FKSaleSalePaymentForm',
        referencedTableName: 'sale',
        referencedColumnNames: ['id'],
        columnNames: ['saleId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('salePaymentForm');
    await queryRunner.dropForeignKey(
      'salePaymentForm',
      'FKSaleSalePaymentForm',
    );
  }
}
