import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateClientContact1683405021500
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clientContact',
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'fone',
            type: 'varchar',
          },
          {
            name: 'foneType',
            type: 'varchar',
          },
          {
            name: 'isWhatsApp',
            type: 'boolean',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'job',
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
      'clientContact',
      new TableForeignKey({
        name: 'FKClientClientContact',
        referencedTableName: 'client',
        referencedColumnNames: ['id'],
        columnNames: ['clientId'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clientContact');
    await queryRunner.dropForeignKey('clientContact', 'FKClientClientContact');
  }
}
