  var settings = require('../settings'),
  Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;
  var MongoClient = require('mongodb').MongoClient;
  module.exports = MongoClient.connect(settings.uri);
