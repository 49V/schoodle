require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME,
      port     : process.env.DB_PORT,
      ssl      : process.env.DB_SSL
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : postgres://usxaqtryqkuaph:6d4e6d5c4f9310e40f62f0e63a859a2f5c9bdd421094c1f92b8e3f31cb55593f@ec2-54-83-50-174.compute-1.amazonaws.com:5432/d1idqmj4hvroth
        ,
        port     : process.env.DB_PORT,
        ssl      : process.env.DB_SSL
      },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
