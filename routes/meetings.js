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
      res.render('meetings',{meetings:rows});
      // And done with the connection.
    connection.release();
    });
  });
});

module.exports = router;
