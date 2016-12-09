//var mysql = require('mysql');
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'runbogao',
//    database:'Project'
//});
/* GET home page. */

module.exports = function(app){
    app.get('/', function (req, res) {
        res.redirect('./main');
    });
    app.use('/signup', require('./signup'));
    app.use('/login', require('./login'));
    app.use('/main', require('./main'));
    app.use('/search', require('./search'));
    app.use('/detail', require('./detail'));
    app.use('/groups', require('./groups'));
    app.use('/group_detail', require('./group_detail'));
    app.use('/meetings', require('./meetings'));
    app.use('/tags', require('./tags'));
    app.use('/user', require('./user'));
    app.use('/post', require('./post'));
    app.use('/logout', require('./logout'));
};
