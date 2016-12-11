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
  elements_query = "SELECT i_name, amount FROM CONTAINING WHERE RID = " +"'" + rid + "';";
  belongs_query = "SELECT rid from POST where rid='"+rid+"';";
  pool.getConnection(function(err, connection) {
    connection.query(recipe_query, function(err, rows) {
      if(err)throw err;
      console.log(rows);
      recipe = rows[0];
      connection.query(tags_query, function(err, rows) {
        if(err)throw err;
        tags = rows;
        connection.query(elements_query, function(err, rows) {
          if(err)throw err;
          elements = rows;
          connection.query(belongs_query, function(err, rows) {
            if(err)throw err;
            console.log(rows);
            if(!req.session.uid) {
              res.render('detail',{Recipe:recipe, Tags:tags, elements:elements, userinfo:false, review:false});
            }
            else if (rows.length>0 && rows[0].user_name === req.session.uid){
              res.render('detail',{Recipe:recipe, Tags:tags, elements:elements, userinfo:true, uid:req.session.uid, nick_name:req.session.nick_name,login_name:req.session.login_name,review:false});
            }
            else {
              res.render('detail',{Recipe:recipe, Tags:tags, elements:elements, userinfo:true, uid:req.session.uid, nick_name:req.session.nick_name,login_name:req.session.login_name,review:true});
            }
          });
        });
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
