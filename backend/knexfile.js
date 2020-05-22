// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};
