module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  staging: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};
