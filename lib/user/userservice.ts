

export class UserService {
    private dbName:string;
    private dbUrl:string;
    private nano:any;
    private dbInstance:any;

    constructor(dbUrl:string, dbName:string) {
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        // TODO oben includieren?
        this.nano = require('nano')(this.dbUrl);
        this.initDatabase();
    }


    private initDatabase(){
        this.createDatabase();
        this.openDatabase();
    }

    private createDatabase() {
        this.nano.db.create(this.dbName, function(err, body){
            if(!err) {
                console.log('database ' +  + ' created!' )
            }
            // TODO error handling
        });
     }

    private openDatabase() {
        // specify the database we are going to use
        this.dbInstance = this.nano.db.use(this.dbName);
        // TODO error handling
    }

    public insert() {

    }
}
