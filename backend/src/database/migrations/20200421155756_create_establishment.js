exports.up = (knex) => {
  return knex.schema.createTable("establishment", (table) => {
    table.increments("_id").primary();
    table.foreign("firebase_uid").references("manager.firebase_uid");
    table.string("firebase_uid", 28).notNullable();
    table.string("name", 20).notNullable();
    table.string("description", 120).notNullable();
    table.string("photo_url").notNullable();
    table.string("phone_number", 13).notNullable();
    table.boolean("whatsapp_available").notNullable();
    table.string("address").notNullable();
    table.specificType("coordinate", "POINT").notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("establishment");
};
