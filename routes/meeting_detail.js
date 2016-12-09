var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('group_detail',req.query);
  var mname = req.query.mname;
  //res.render('search_result');
  var query = 'SELECT * FROM REPORT NATURAL JOIN (SELECT * FROM MEETING WHERE MNAME = "First Time") AS M';

  pool.getConnection(function(err, connection) {
    connection.query(query, function(err, rows) {
      if (err)throw err;
      var reports = rows;
      var number_of_reports = members.length;
      res.render('groups_detail',{reports:reports, number_of_reports:number_of_reports});
      // And done with the connection.
    connection.release();
    });
  });
});

module.exports = router;
