var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log(req.query);
  //res.render('search_result');
  search_query = 'SELECT * from USER WHERE LOGIN_NAME = "Tom"';
  pool.getConnection(function(err, connection) {
    connection.query(search_query, function(err, rows) {
      if (err)throw err;
      res.render('user',{results:rows});
      // And done with the connection.
    connection.release();
    });
  });
});

module.exports = router;
