require('dotenv').config();
const express = require('express'), app = express(), fs = require('fs'), mysql = require('mysql'), configs = require('./configs');







app.listen(configs.port, console.log('started on http://localhost:8080'));