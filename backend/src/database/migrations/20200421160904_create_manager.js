exports.up = function (knex) {
  return knex.schema.createTable("manager", function (table) {
    table.string("firebase_uid", 28).primary();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("manager");
};
