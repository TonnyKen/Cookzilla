var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Now ./tags get',req.query);
  //res.render('search_result');
  search_query = 'SELECT RID, TITLE, DESCRIPTION, PHOTOS FROM RECIPE WHERE RID IN (SELECT RID FROM ABOUT NATURAL JOIN (SELECT * FROM TAG WHERE TNAME = ' + '"' + req.query.tag + '"' + ') AS T );';
  pool.getConnection(function(err, connection) {
    connection.query(search_query, function(err, rows) {
      if (err)throw err;
      if(!req.session.uid) {
        res.render('search_result',{results:rows, keyword:'Tag', value:req.query.tag, userinfo:false});
      }
      else {
        res.render('search_result',{results:rows, keyword:'Tag', value:req.query.tag, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      }
      // And done with the connection.
    connection.release();
    });
  });
});

router.post('/', function (req, res) {
	console.log('Fuck tags post');
});

module.exports = router;
