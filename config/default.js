//module.exports = {
//  port: 3000,
//  session: {
//    secret: 'myblog',
//    key: 'myblog',
//    maxAge: 2592000000
//  },
//  mongodb: 'mongodb://localhost:27017/myblog'
//};

// module.exports = {
// 	mysql: {
//     host: 'localhost',
//     user: 'root',
//     password: 'runbogao',
//     database:'Project'
// 	}
// };
var mysql = require('mysql');

var pool  = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: 'runbogao',
	database:'Project2'
});

exports.pool = pool;
