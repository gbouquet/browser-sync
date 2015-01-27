"use strict";

var browserSync = require("../../../index");

var assert  = require("chai").assert;
var request = require("supertest");
var http = require("http");
var connect = require("connect");
var serveStatic = require("serve-static");

describe("Plugins: Should be able to add Middlewares with paths on the fly", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;

    before(function (done) {

        browserSync.reset();

        var config = {
            logLevel: "silent",
            open: false,
            server: "test/fixtures"
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware("/shane", function (req, res) {
                    res.end("shane is dev");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
    });
    it("should serve the file", function (done) {
        request(instance.server)
            .get("/shane")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane is dev");
                done();
            });
    });
});

describe("Plugins: Should be able to add Middlewares with no paths on the fly", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;

    before(function (done) {

        browserSync.reset();

        var config = {
            logLevel: "silent",
            open: false,
            server: "test/fixtures"
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware(function (req, res) {
                    res.end("shane is dev");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
    });
    it("should serve the file", function (done) {
        request(instance.server)
            .get("/shane")// this matches no static files, so will call through to middleware
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane is dev");
                done();
            });
    });
});

describe("Plugins: Should be able to add Middlewares with paths on the fly in snippet mode", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;

    before(function (done) {

        browserSync.reset();

        var config = {
            logLevel: "silent",
            open: false
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware("/shane", function (req, res) {
                    res.end("shane is dev");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
    });
    it("should serve the file", function (done) {
        request(instance.server)
            .get("/shane")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane is dev");
                done();
            });
    });
});

describe("Plugins: Should be able to add Middlewares with no path on the fly in snippet mode", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;

    before(function (done) {

        browserSync.reset();

        var config = {
            logLevel: "silent",
            open: false
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware(function (req, res) {
                    res.end("shane is dev");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
    });
    it("should serve the file", function (done) {
        request(instance.server)
            .get("/shane")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane is dev");
                done();
            });
    });
});

describe("Plugins: Should be able to add middleware with paths on the fly in proxy mode", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;
    var stubServer;

    before(function (done) {

        browserSync.reset();

        var testApp = connect()
            .use(serveStatic(__dirname + "/../../fixtures"));

        // server to proxy
        stubServer = http.createServer(testApp).listen();
        var port = stubServer.address().port;

        var config = {
            logLevel: "silent",
            open: false,
            proxy: "http://localhost:" + port
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware("/shane", function (req, res) {
                    res.end("shane");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
        stubServer.close();
    });
    it("should serve the file + browserSync file", function (done) {

        request(instance.server)
            .get("/shane")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane");
                done();
            });
    });
});

describe("Plugins: Should be able to add middleware with no paths on the fly in proxy mode", function () {

    var PLUGIN_NAME = "KITTENZ";
    var instance;
    var stubServer;

    before(function (done) {

        browserSync.reset();

        var testApp = connect()
            .use(serveStatic(__dirname + "/../../fixtures"));

        // server to proxy
        stubServer = http.createServer(testApp).listen();
        var port = stubServer.address().port;

        var config = {
            logLevel: "silent",
            open: false,
            proxy: "http://localhost:" + port
        };

        browserSync.use({
            plugin: function (opts, bs) {
                bs.addMiddleware(function (req, res) {
                    res.end("shane");
                });
                done();
            },
            "plugin:name": PLUGIN_NAME
        });

        instance = browserSync(config).instance;
    });
    after(function () {
        instance.cleanup();
        stubServer.close();
    });
    it("should serve the file + browserSync file", function (done) {

        request(instance.server)
            .get("/shane")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "shane");
                done();
            });
    });
});