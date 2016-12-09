var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
//var url = require('url');

router.get('/', function (req, res) {
  console.log('Detail Get');
  console.log(req.query);
  var rid = req.query.rid;
  recipe_query = "SELECT RID,TITLE,DESCRIPTION, PHOTOS FROM RECIPE WHERE RID = " + "'" + rid + "'";
  tags_query = "SELECT T_ID, TNAME FROM TAG NATURAL JOIN (SELECT * FROM ABOUT WHERE RID = " +"'" + rid + "'" + ") AS A";
  pool.getConnection(function(err, connection) {
    connection.query(recipe_query, function(err, rows) {
      if(err)throw err;
      console.log(rows);
      recipe = rows[0];
      connection.query(tags_query, function(err, rows) {
        if(err)throw err;
        tags = rows;
        if(!req.session.uid) {
          res.render('detail',{Recipe:recipe, Tags:tags, userinfo:false});
        }
        else {
          res.render('detail',{Recipe:recipe, Tags:tags, userinfo:true, uid:req.session.user_name,nick_name:req.session.nick_name,login_name:req.session.login_name});
        }
      });
    });
    connection.release();
  });
});

router.post('/', function (req, res) {
  // var obj = {};
	// console.log('body: ' + JSON.stringify(req.body));
  // rid = req.body.rid;
  // recipe_query = "SELECT TITLE,DESCRIPTION, PHOTOS FROM RECIPE WHERE RID = " +"'" + rid + "'";
  // relate_query = "SELECT TNAME FROM TAG NATURAL JOIN (SELECT * FROM ABOUT WHERE RID = " +"'" + rid + "'" + ") AS A";
  // pool.getConnection(function(err, connection) {
  //   // Use the connection
  //   connection.query(recipe_query, function(err, rows) {
  //     if(err)throw err;
  //     console.log(rows);
  //     res.render('detail');
  //     //res.send({redirect: '/detail'});
  //     });
  //     // And done with the connection.
  //     connection.release();
  //       // Don't use the connection here, it has been returned to the pool.
  // });
  console.log('Fuck POST');
});

module.exports = router;
