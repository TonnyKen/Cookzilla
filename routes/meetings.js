var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Get query',req.query);
  //res.render('search_result');
  var name = req.query.gname;
  search_query = "SELECT MID, MNAME, MLOCATION, MTIME, LASTTIME FROM MEETING NATURAL JOIN (ORGANIZE NATURAL JOIN (SELECT * FROM GROUPS WHERE GNAME = "+ "'" + name + "'" +") AS G);";
  pool.getConnection(function(err, connection) {
    connection.query(search_query, function(err, rows) {
      console.log(rows);
      if (err)throw err;
      if(!req.session.uid) {
        res.render('meetings',{meetings:rows, userinfo:false});
      }
      else {
        res.render('meetings',{meetings:rows, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
      }      
      // And done with the connection.
    connection.release();
    });
  });
});

module.exports = router;
