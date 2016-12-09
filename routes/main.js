var express = require('express');
var router = express.Router();
var pool = require('../config/default').pool;
var session = require('client-sessions');

router.get('/', function (req, res) {
  var sess = req.session.uid;
  console.log(sess);
  // get from database top 10 tags... recipes...
  var tag_query = "SELECT T_ID, TNAME FROM TAG NATURAL JOIN (SELECT * FROM ABOUT WHERE RID = 1) AS A;";
  var recipe_query = "SELECT DISTINCT * FROM ((SELECT RID, TITLE, DESCRIPTION, PHOTOS, RV.AR FROM RECIPE NATURAL JOIN (SELECT RID, AVG(RATING) AS AR FROM REVIEW GROUP BY RID ORDER BY AVG(RATING) DESC ) AS RV) UNION ALL (SELECT DISTINCT RID, TITLE, DESCRIPTION, PHOTOS, RV.AR FROM (SELECT RID, AVG(RATING) AS AR FROM REVIEW GROUP BY RID ORDER BY AVG(RATING) DESC ) AS RV NATURAL JOIN RECIPE NATURAL JOIN ABOUT NATURAL JOIN TAG WHERE TITLE LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%') OR DESCRIPTION LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%') OR TNAME LIKE CONCAT('%',(SELECT KEYWORD FROM `HISTORY_USER_SEARCH_KEYWORD` WHERE USER_NAME = 1 limit 1),'%'))) AS A";
  var tags = [];
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(tag_query, function(err, rows) {
      if(err)throw err;
      tags = rows;
      connection.query(recipe_query, function(err, rows) {
        if(err)throw err;
        recipes = rows;
        console.log(tags);
        // console.log(recipes);
        res.render('main',{all_tags:tags, all_recipes:recipes});
      });
      // And done with the connection.
      connection.release();
        // Don't use the connection here, it has been returned to the pool.
    });
  });
  //console.log(tags);

});

module.exports = router;
