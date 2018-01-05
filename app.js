var express = require('express');
var path = require('path');
//var logger = require('./logdna');
var elasticsearch = require('./elasticsearch');

const APP_PORT = 3000;

var index = require('./routes/index');
var suggest = require('./routes/suggest');
var search = require('./routes/stat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static folder setup
app.use(express.static(path.join(__dirname, 'public')));

elasticsearch.indexExists().then(

    //delete index if it exist
    function(status){
        if(status){
            return elasticsearch.deleteIndex();
        }
    }
).then(
    function(){

        console.log('Index deleted');

        //create our index
        return elasticsearch.createIndex().then(
            function(){

                console.log('Index created');

                //Update our index with mappings
                elasticsearch.indexMapping().then(
                    function(){
                        console.log('Index mapping has been updated');

                        //bulk add our dummy data in ./data/players.json
                        elasticsearch.bulkAddDocument().then(
                            function () {
                                console.log('Dummy documents have been bulk imported');
                            },
                            function (err) {
                                console.error('Could not import dummy documents', err);
                            }
                        )
                    },
                    function(err){
                        console.error('Could not create index', err);
                    }

                )
            },
            function (err){

                console.error('Could not create index', err);
            }
        );
    }
);

// create our app endpoints
app.get('/', index);
app.get('/suggest/:text/:size', suggest);
app.get('/stat/:id/', search);

app.listen(APP_PORT, function(){
    console.log('App is running');
});
