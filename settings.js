var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'runbogao',
    database:'Project'
});

module.exports = connection;