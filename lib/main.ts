/// <reference path="../typings/hapi/hapi.d.ts" />
var Hapi = require('hapi');

// example to call plugin
var DatabasePlugin = require('./plugins/database/databasePlugin').DatabasePlugin;
var database = new DatabasePlugin("http://localhost:5984", "mydatabase");

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, emily!');
    }
});

server.register({
    register: database,
    options: {
        sampleOption: "sample"
    }
}, database.errorInit);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
