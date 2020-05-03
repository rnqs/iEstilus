exports.up = (knex) =>
  knex.schema.createTable("establishments", (table) => {
    table.increments("_id").primary();
    table
      .string("firebase_uid", 28)
      .references("managers.firebase_uid")
      .notNullable()
      .onDelete("CASCADE");
    table.string("name", 20).notNullable();
    table.string("description", 120).notNullable();
    table.string("photo_url").notNullable();
    table.string("phone_number", 13).notNullable();
    table.boolean("whatsapp_available").notNullable();
    table.string("address").notNullable();
    table.specificType("coordinate", "POINT").notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("establishments");
