export class GroupPlugin {
    register:any;

    constructor() {
        this.register.attributes = {
            name: 'groupPlugin',
            version: '1.0.0'
        };
    }

    register(server, options, next) {

        next();
    }

    errorInit(err) {
        if (err) {
            console.log('Failed to load plugin:', err);
        }
    }

}
