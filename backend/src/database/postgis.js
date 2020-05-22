const connection = require("./connection");
const knexPostgis = require("knex-postgis");

const st = knexPostgis(connection);

module.exports = st;
