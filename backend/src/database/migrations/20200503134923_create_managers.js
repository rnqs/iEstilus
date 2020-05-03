exports.up = (knex) =>
  knex.schema.createTable("managers", function (table) {
    table.string("firebase_uid", 28).primary();
  });

exports.down = (knex) => knex.schema.dropTable("managers");
