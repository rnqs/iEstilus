// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://renanarques:@localhost/iestilus",
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  staging: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "iestilus_db",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "iestilus_db",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};
