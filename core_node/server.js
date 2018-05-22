/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */

"use strict";
var https = require("https");
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
var server = require("http").createServer();
https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";

//Initialize Express App for XSA UAA and HDBEXT Middleware
var xsenv = require("@sap/xsenv");
var passport = require("passport");
var xssec = require("@sap/xssec");
var xsHDBConn = require("@sap/hdbext");
var express = require("express");

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();
var logger = appContext.getLogger("/Application");
var tracer = appContext.getTracer(__filename);

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(logging.expressMiddleware(appContext));
app.use(passport.initialize());
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
//hanaOptions.hana.rowsWithMetadata = true;
app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	xsHDBConn.middleware(hanaOptions.hana)
);

//Setup Routes
var router = require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function() {
	console.info(`Logger Level: ${logger.getLevel().toString()}`);
	console.info(`Logger Error Enabled: ${logger.isEnabled("error")}`);
	console.info(`Tracer Level: ${tracer.getLevel().toString()}`);
	console.info(`Tracer Error Enabled: ${tracer.isEnabled("error")}`);	
	logger.error(`HTTP Server: ${server.address().port}`);
	tracer.info(`HTTP Server: ${server.address().port}`);	
	console.info(`HTTP Server: ${server.address().port}`);
});