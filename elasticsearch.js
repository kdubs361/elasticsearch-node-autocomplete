'use strict';

var env = require('node-env-file');
var fs = require('fs');
var elasticsearch = require('elasticsearch');

env('.env');

const es = elasticsearch.Client({
    //host: '192.168.33.30:9200'
    //host: 'https://elastic:<SOME_PASSWORD>T@f3243ca16623c6c4c64b885f69cb938b.us-central1.gcp.cloud.es.io:9243/'
    host: '104.198.210.90:9200'

});

const INDEX_NAME = 'products';
const INDEX_TYPE = 'product';

/*
 * Since our dummy data is not a valid json file, we can't simply require() it.
 * This function tricks require() to read and export the content of the file, instead of parsing it
 */

function readDataFile(){
    require.extensions['.json'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
    };

    return require("./data/products-es.json")
}

function indexExists() {
    return es.indices.exists({
        index: INDEX_NAME
    });
}

function createIndex(){
    return es.indices.create({
        index: INDEX_NAME
    });
}

function deleteIndex(){
    return es.indices.delete({
        index: INDEX_NAME
    });
}


function indexMapping(){
    return es.indices.putMapping({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
            properties: {
                name: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple"
                },
                description: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple"
                }
                // type: {
                //     type: "text",
                // },
                // price: {
                //     type: "long"
                // },
                // upc: {
                //     type: "text",
                // },
                // category: {
                //     type: "text",
                // },
                // shipping: {
                //     type: "long",
                // },
                // sku: {
                //     type: "long",
                // },
                // manufacturer: {
                //     type: "text"
                // },
                // model: {
                //     type: "text",
                // },
                // url: {
                //     type: "text"
                // },  
                // image: {
                //     type: "text"
                // }                                      
            }
        }
    });
}

function addDocument(document){
    return es.index({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
            sku: document.sku,
            name: document.name,
            type: document.type,
            price: document.price,
            upc: document.upc,
            category: document.category,
            shipping: document.shipping,
            description: document.description,
            manufacturer: document.manufacturer,
            model: document.model,
            url: document.url,
            image: document.image,
        },
        refresh: "true"
    });
}

function bulkAddDocument(){
    return  es.bulk({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: [
            readDataFile()
        ],
        refresh: "true"
    });
}

function getSuggestions(text, size){
    return es.search({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
            suggest: {
                firstNameSuggester: {
                    prefix: text,
                    completion: {
                        field: "name",
                        size: size,
                        fuzzy: {
                            fuzziness: "auto"
                        }
                    }
                // }
                },
                lastNameSuggester: {
                    prefix: text,
                    completion: {
                        field: "description",
                        size: size,
                        fuzzy: {
                            fuzziness: "auto"
                        }
                    }
                }
            }

        }
    });
}

function getStat(id){
    return es.search({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
            query: {
                term: {
                    "_id": id
                }
            }
        }
    });
}

exports.deleteIndex = deleteIndex;
exports.createIndex = createIndex;
exports.indexExists = indexExists;
exports.indexMapping = indexMapping;
exports.addDocument = addDocument;
exports.bulkAddDocument = bulkAddDocument;
exports.getSuggestions = getSuggestions;
exports.getStat = getStat;
