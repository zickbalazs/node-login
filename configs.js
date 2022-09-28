require('dotenv').config();

let dbconfig = {
    connectionLimit: process.env.DBL,
    host: process.env.DBH,
    user: process.env.DBU,
    password: process.env.DBP,
    database: process.env.DBD
},
    port = process.env.PORT;

module.exports = {dbconfig, port};