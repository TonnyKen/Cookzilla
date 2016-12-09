var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;

router.get('/', function (req, res) {
  console.log('Currently get /main... ');
  // get from database top 10 tags... recipes...
  var tag_query = "SELECT T_ID, TNAME FROM TAG NATURAL JOIN (SELECT * FROM ABOUT WHERE RID = 1) AS A;";
  var recipe_query = "SELECT RID, TITLE, DESCRIPTION, PHOTOS, RV.AR FROM RECIPE NATURAL JOIN (SELECT RID, AVG(RATING) AS AR FROM REVIEW GROUP BY RID ORDER BY AVG(RATING) DESC ) AS RV;";
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(tag_query, function(err, rows) {
      if(err)throw err;
      var tags = rows;
      connection.query(recipe_query, function(err, rows) {
        if(err)throw err;
        var recipes = rows;
        if(req.session.uid === 'undefined' ||!req.session.uid) {
          var userinfo = null;
          console.log('Not login in now');
          res.render('main',{all_tags:tags, all_recipes:recipes, userinfo:userinfo});
        }
        else {
          console.log(req.session.uid);
          user_query = "SELECT PROFILE,LOGIN_NAME,NICK_NAME FROM USER WHERE USER_NAME='"+req.session.uid +"';";
          connection.query(user_query, function(err, rows) {
            if(err)throw err;
            console.log('Already logined',rows);
            var userinfo = rows;
            res.render('main',{all_tags:tags, all_recipes:recipes, userinfo:userinfo});
          });
        }
      });
      connection.release();
    });
  });
  //console.log(tags);
});

module.exports = router;
