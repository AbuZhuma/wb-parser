import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.jsonb('data').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.unique(['date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tariffs');
}