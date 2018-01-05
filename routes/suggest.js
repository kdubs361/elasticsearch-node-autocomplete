var express = require('express');
var logger = require('../logdna');
var router = express.Router();

var elasticsearch = require('../elasticsearch');

//Get result from elasticsearch
router.get('/suggest/:text/:size', function(req, res, next) {
    elasticsearch.getSuggestions(req.params.text, req.params.size).then(
        function(result){
            console.log("Suggest products with name: "+req.params.text);
            res.json(result)
        }
    );
});

module.exports = router;
