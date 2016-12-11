var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Now in ./meeting_detail',req.query);
  var mname = req.query.meeting;
  var query = 'SELECT * FROM REPORT NATURAL JOIN (SELECT * FROM MEETING WHERE MNAME = "' + mname + '") AS M';

  pool.getConnection(function(err, connection) {
    connection.query(query, function(err, rows) {
      if (err)throw err;
      var reports = rows;
      var number_of_reports = rows.length;
      res.render('meeting_detail',{mname:mname, reports:reports, number_of_reports:number_of_reports, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
    });
    connection.release();
  });
});

module.exports = router;
