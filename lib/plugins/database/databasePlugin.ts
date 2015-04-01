export class DatabasePlugin {
    register:any;
    dbName:string;
    dbUrl:string;
    nano:any;
    dbInstance:any;

    constructor(dbUrl:string, dbName:string) {
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.nano = require('nano')(this.dbUrl);
        this.register.attributes = {
            name: 'database',
            version: '1.0.0'
        };

        this.createDatabase();
        this.openDatabase();
    }

    createDatabase() {
        this.nano.db.create(this.dbName, function(err, body){
            if(!err) {
                console.log('database ' +  + ' created!' )
            }
            // TODO error handling
        });
     }

    openDatabase() {
        // specify the database we are going to use
        this.dbInstance = this.nano.db.use(this.dbName);
        // TODO error handling
    }


    /* plugin registration */
    register(server, options, next) {
        server.route({
            method: 'GET',
            path: '/get/{any}',
            handler:  (request, reply) => {
                reply(options.sampleOption + ': get '+ request.params.any);
            }
        });

        next();
    }

    errorInit(err) {
        if(err) {
            console.log('Failed to load plugin:', err);
        }
    }
}
