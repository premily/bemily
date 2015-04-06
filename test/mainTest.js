var Lab = require('lab');
var Hapi = require('hapi');
var lab = exports.lab = Lab.script();

lab.experiment('Test for Plugin', function () {
    var server = new Hapi.Server();

    console.log('HuHu');
    lab.test('Plugin successfully loads', function (done) {
        server.pack.require('userPlugin', function (err) {
            lab.expect(err).to.equal(null);
            done();
        });
    });
    Lab.test('Plugin registers routes', function (done) {
        var table = server.table();
        Lab.expect(table).to.have.lenght(2);
        done();
    });
});
