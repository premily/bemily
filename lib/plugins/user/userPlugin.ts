export class UserPlugin {
    register:any;
    databaseInstance:any;
    Joi:any;
    Boom:any;
    userSchema:any;

    constructor() {
        this.register.attributes = {
            name: 'userPlugin',
            version: '1.0.0'
        };

    }

    register(server, options, next) {
        if (!options.databaseInstance) {
            throw new Error('options.databaseInstance needs to be defined');
        }
        this.databaseInstance = options.databaseInstance;
        var users = this.databaseInstance.database('app');

        this.Joi = require('joi');
        this.Boom = require('boom');

        this.userSchema = this.Joi.object().keys({
            name: this.Joi.string().required(),
            mail: this.Joi.string().email()
        });

        server.route({
            method: 'POST',
            path: '/login',
            handler: (request, reply) => {
                console.log(request.payload)

                var pl = request.payload;
                users.view('login/login', function (err, docs) {
                    reply(docs);
                    docs.forEach(doc => {
                        if (doc.name === pl.name && doc.password === pl.password) {
                            console.log('hallo', doc);
                            request.session.set('loggedInUser', doc._id);
                        }
                    });
                });
            }
        });

        server.route({
            method: 'GET',
            path: '/me',
            handler: (request, reply) => {
                console.log(request.session)
                var userId = request.session.get('loggedInUser');

                users.get(userId, function (err, doc) {
                    reply(doc);
                });

            }
        });

        server.route({
            method: 'POST',
            path: '/me',
            handler: (request, reply) => {
               // console.log(request.payload)
                var userId = request.session.get('loggedInUser');
                this.Joi.validate(request.payload, this.userSchema, (err, value)=> {
                   //console.log(value);
                    if(err) {
                        var errResponse = this.Boom.wrap(err, 400, err.details.message);
                        reply(errResponse.output);
                    } else {
                        users.merge(userId, value, function(err, value) {
                            if(err) {
                                return reply(this.Boom.wrap(err));
                            }
                            reply({statusCode: 200});
                            console.log(arguments);
                        });
                    }
                });

            }
        });
        next();
    }

    errorInit(err) {
        if (err) {
            console.log('Failed to load plugin:', err);
        }

    }

}
