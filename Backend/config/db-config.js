// const sql = require("mysql2");
//
// const db = sql.createPool({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     port: process.env.DATABASE_PORT,
//     database: process.env.DATABASE_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });
//
// module.exports = db;

const Pool = require('pg').Pool;

const pool = new Pool({
    user: "UGWebapplication",
    password: "Powerseekers",
    database: "MainDatabase",
    host: "ugwebapplication.ct4zszzqkuph.ap-northeast-1.rds.amazonaws.com",
    port: 5432,
});

module.exports = pool;