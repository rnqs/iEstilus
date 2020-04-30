const knex = require("knex");

const configs = require("../../knexfile").development;

module.exports = knex(configs);
