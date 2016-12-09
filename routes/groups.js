var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Get query',req.query);
  //res.render('search_result');
  search_query = 'SELECT GID,GNAME FROM GROUPS';
  pool.getConnection(function(err, connection) {
    connection.query(search_query, function(err, rows) {
      console.log(rows);
      if (err)throw err;
      res.render('groups',{groups:rows});
      // And done with the connection.
    connection.release();
    });
  });
});


router.get('/meetings', function (req, res) {
  console.log('Get query',req.query);
  var gname = req.query.group;
  var meeting = req.query.meeting;
  search_query = "SELECT * FROM MEETING WHERE MNAME ="+ "'" + meeting + "';";
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

// router.post('/', function (req, res) {
//   var obj = {};
// 	console.log('body: ' + JSON.stringify(req.body));
// 	//res.send(req.body);
//   res.redirect('/signup');
// });

module.exports = router;
