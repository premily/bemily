/// <reference path="../typings/hapi/hapi.d.ts" />
var Hapi = require('hapi');
var DatabaseService = require('./database/databaseService');

var dbInstance = new DatabaseService.DatabaseService();

var UserPlugin = require('./plugins/user/userPlugin').UserPlugin;
var GroupPlugin = require('./plugins/group/groupPlugin').GroupPlugin;

var userPlugin = new UserPlugin();
var groupPlugin = new GroupPlugin();

var server = new Hapi.Server();

var sessionOptions = {
    cookieOptions: {
        password: 'password',
        isSecure: false
    }
};

server.connection({ port: 3001 });


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, Bemily!');
    }
});

// register user plugin
server.register({
    register: userPlugin,
    options: {
        databaseInstance: dbInstance.db
    }
}, userPlugin.errorInit);

// register group plugin
server.register({
    register: groupPlugin,
    options: {
        databaseInstance: dbInstance.db
    }
}, groupPlugin.errorInit);


server.register({
    // needed for cookies for Hapi
    register: require('yar'),
    options: sessionOptions
}, function (err) { });

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
