var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

// router.get('/', function (req, res) {
//   res.render('signup');
// });

router.post('/', function (req, res) {
    if (typeof req.body.search_value !== 'undefined') {
        search_query = 'select password from User where login_name = ' + '"' + req.body.search_value + '"';
        pool.getConnection(function(err, connection) {
          // Use the connection
          console.log(search_query);
          connection.query(search_query, function(err, rows) {
            console.log(JSON.stringify(rows));
            res.send({redirect:'/main'});
            // And done with the connection.
          connection.release();
          });
        });
    }
    // else if (typeof req.body.rid !== 'undefined'){
    //     search_query = "SELECT TITLE,DESCRIPTION, PHOTOS FROM RECIPE WHERE RID = " +"'" + req.body.rid + "'";
    //     pool.getConnection(function(err, connection) {
    //       // Use the connection
    //       console.log(search_query);
    //       connection.query(search_query, function(err, rows) {
    //         console.log(JSON.stringify(rows));
    //         // And done with the connection.
    //       connection.release();
    //       });
    //     });
    // }

});

module.exports = router;
