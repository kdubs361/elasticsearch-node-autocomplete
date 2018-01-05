var express = require('express');
// var logger = require('../logdna');
var router = express.Router();

var elasticsearch = require('../elasticsearch');

//Get result from elasticsearch
router.get('/stat/:id', function(req, res, next) {
    elasticsearch.getStat(req.params.id).then(
        function(result){
            console.log("Search for product with ID: "+req.params.id);
            res.json(result)
        }
    );
});

module.exports = router;
