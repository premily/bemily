export interface User {
    _id: string;
    name: string;
    surname: string;
    mail: string;
    password: string;
    username: string;
    major: string;
    semester: number;
    subscribed_groups: string[];
}

export class UserPlugin {
    register:any;
    databaseInstance:any;
    userSchema:any;
    Joi:any;
    Boom:any;

    constructor() {
        this.register.attributes = {
            name: 'userPlugin',
            version: '1.0.0'
        };
        this.Joi = require('joi');
        this.Boom = require('boom');
        this.initSchema();
    }

    initSchema() {
        this.userSchema = this.Joi.object().keys({
            name: this.Joi.string().required(),
            mail: this.Joi.string().email().required()
        });

    }

    register(server, options, next) {
        if (!options.databaseInstance) {
            throw new Error('options.databaseInstance needs to be defined');
        }
        this.databaseInstance = options.databaseInstance;
        var db = this.databaseInstance.database('app');

        // login and create a session
        server.route({
            method: 'POST',
            path: '/login',
            handler: (request, reply) => {
                console.log(request.payload)
                var pl = request.payload;
                db.view('login/login', function (err, docs:User[]) {
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

        // get information about current user from session
        server.route({
            method: 'GET',
            path: '/me',
            handler: (request, reply) => {
                console.log(request.session)
                var userId = request.session.get('loggedInUser');
                db.get(userId, function (err, doc:User) {
                    reply(doc);
                });
            }
        });

        // update only a few fields of the current user
        // TODO: speichert auch neue revision, wenn sich nichts geändert hat
        // TODO: deshalb sollte zuerst geprüft werden ob sich was geändert hat
        server.route({
            method: 'POST',
            path: '/me',
            handler: (request, reply) => {
                var userId = request.session.get('loggedInUser');
                this.Joi.validate(request.payload, this.userSchema, (err, value:User)=> {
                    if (err) {
                        var errResponse = this.Boom.wrap(err, 400, err.details.message);
                        reply(errResponse.output);
                    } else {
                        db.merge(userId, value, function (err, value) {
                            if (err) {
                                return reply(this.Boom.wrap(err));
                            }
                            reply({statusCode: 200});
                            console.log(arguments);
                        });
                    }
                });
            }
        });

        // create new user
        // TODO: aktuell werden user auch doppelt erstellt
        server.route({
            method: 'POST',
            path: '/createUser',
            handler: (request, reply) => {
                this.Joi.validate(request.payload, this.userSchema, (err, value:User)=> {
                    if (err) {
                        var errResponse = this.Boom.wrap(err, 400, err.details.message);
                        reply(errResponse.output);
                    } else {
                        console.log(value);
                        // TODO: check if all information for new user is committed.
                        db.save(value, (err, res)=> {
                            if (err) {
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
