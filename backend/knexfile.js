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
    client: "pg",
    connection: "postgres://renanarques:@localhost/iestilus",
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  production: {
    client: "pg",
    connection: "postgres://renanarques:@localhost/iestilus",
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};
