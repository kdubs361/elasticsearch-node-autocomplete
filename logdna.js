var logdna = require('logdna');
var env = require('node-env-file');

env('.env');

const logArgs = {
    app: 'Player Search'
};
logArgs.index_meta = true;

const logger = logdna.setupDefaultLogger(process.env.LOGDNA_KEY, logArgs);

exports.logger = logger;