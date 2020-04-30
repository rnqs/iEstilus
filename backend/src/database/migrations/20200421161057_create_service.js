exports.up = (knex) => {
  return knex.schema.createTable("service", (table) => {
    table.increments("_id").primary();
    table.foreign("establishment_id").references("establishment._id");
    table.integer("establishment_id").unsigned();
    table.string("name", 20).notNullable();
    table.string("photo_url");
    table.float("price", 5, 2).notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("service");
};
