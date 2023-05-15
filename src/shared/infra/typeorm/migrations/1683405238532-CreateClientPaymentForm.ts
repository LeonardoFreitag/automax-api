import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateClientPaymentForm1683405238532
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clientPaymentForm',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'clientId',
            type: 'uuid',
          },
          {
            name: 'paymentFormId',
            type: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'installmentsLimit',
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
      'clientPaymentForm',
      new TableForeignKey({
        name: 'FKClientClientPaymentForm',
        referencedTableName: 'client',
        referencedColumnNames: ['id'],
        columnNames: ['clientId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clientPaymentForm');
    await queryRunner.dropForeignKey(
      'clientPaymentForm',
      'FKClientClientPaymentForm',
    );
  }
}
