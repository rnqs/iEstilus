exports.up = (knex) =>
  knex.schema.createTable("services", (table) => {
    table.increments("_id").primary();
    table
      .integer("establishment_id")
      .unsigned()
      .references("establishments._id")
      .notNullable()
      .onDelete("CASCADE");
    table.string("name", 20).notNullable();
    table.string("photo_url");
    table.decimal("price", 5, 2).notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("services");
