import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOrderItemsPhases1684151473133
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orderItemsPhases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'orderItemId',
            type: 'uuid',
          },
          {
            name: 'employeeId',
            type: 'uuid',
          },
          {
            name: 'phaseDate',
            type: 'Timestamp',
          },
          {
            name: 'phaseId',
            type: 'varchar',
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
      'orderItemsPhases',
      new TableForeignKey({
        name: 'FKOrderItemsOrderItemsPhases',
        referencedTableName: 'orderItems',
        referencedColumnNames: ['id'],
        columnNames: ['orderItemId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orderItemsPhases');
    await queryRunner.dropForeignKey(
      'orderItemsPhases',
      'FKOrderItemsOrderItemsPhases',
    );
  }
}
