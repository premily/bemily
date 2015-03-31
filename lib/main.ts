/// <reference path="../typings/hapi/hapi.d.ts" />
var Hapi = require('hapi');

// TEST
import User = require('./user/userservice');
var db = new User.UserService("http://localhost:5984", "test");

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, emily!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
