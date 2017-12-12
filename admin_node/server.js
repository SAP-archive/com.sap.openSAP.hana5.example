/*eslint no-console: 0*/
/*eslint-env node, es6 */
"use strict";

var port = process.env.PORT || 3000;
var server = require("http").createServer();
var xsenv = require("@sap/xsenv");
var passport = require("passport");
var xssec = require("@sap/xssec");
var xsHDBConn = require("@sap/hdbext");
var express = require("express");
global.__base = __dirname + "/";

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

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
require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function() {
	console.info("HTTP Server: " + server.address().port);
});