export class DatabasePlugin {
    register:any;
    dbName:string;
    dbUrl:string;
    nano:any;
    dbInstance:any;

    constructor(dbUrl:string, dbName:string) {
        this.register.attributes = {
            name: 'database',
            version: '1.0.0'
        };
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.nano = require('nano')(this.dbUrl);
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



    register(server, options, next) {
        server.route({
            method: 'GET',
            path: '/timi',
            handler:  (request, reply) => {
                reply('hello '+ options.sampleOption);
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
