var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.post('/', function (req, res) {
    console.log('Now in ./search post page, keyword',req.body.search_value);
    if (typeof req.body.search_value !== 'undefined') {
        keyword = req.body.search_value;
        search_query = 'SELECT DISTINCT RID, TITLE FROM RECIPE NATURAL JOIN ABOUT NATURAL JOIN TAG WHERE TITLE LIKE "%' + keyword + '%" OR DESCRIPTION LIKE "%' + keyword + '%" OR TNAME LIKE "%'+ keyword + '%";';
        pool.getConnection(function(err, connection) {
          connection.query(search_query, function(err, rows) {
            if(err)throw err;
            if(!req.session.uid) {
              res.render('search_result',{results:rows, keyword:'Search results', value:keyword, userinfo:false});
            }
            else {
              res.render('search_result',{results:rows, keyword:'Search results', value:keyword, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
            }
          connection.release();
          });
        });
    }
});

module.exports = router;
