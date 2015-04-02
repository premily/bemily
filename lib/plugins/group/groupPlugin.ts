export class GroupPlugin {
    register:any;
    databaseInstance:any;

    constructor() {
        this.register.attributes = {
            name: 'groupPlugin',
            version: '1.0.0'
        };
    }

    register(server, options, next) {
        // TODO: refactor -> duplicate code as in user plugin
        if (!options.databaseInstance) {
            throw new Error('options.databaseInstance needs to be defined');
        }
        this.databaseInstance = options.databaseInstance;
        var db = this.databaseInstance.database('app');


        // get information about group from current user
        server.route({
            method: 'GET',
            path: '/myGroups',
            handler: (request, reply) => {
                var userId = request.session.get('loggedInUser');
                // TODO: doc param -> interface User
                db.get(userId, function (err, doc) {
                    reply(doc.subscribed_groups);
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
