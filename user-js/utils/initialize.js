/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
module.exports = {
	initExpress: function() {
		var xsenv = require("sap-xsenv");
		var passport = require("passport");
		var xssec = require("sap-xssec");
		var xsHDBConn = require("sap-hdbext");
		var express = require("express");

		//logging
		var logging = require("sap-logging");
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
		app.use(
			passport.authenticate("JWT", {
				session: false
			}),
			xsHDBConn.middleware(hanaOptions.hana)
		);
		return app;
	},

	initXSJS: function(app) {
		var xsjs = require("sap-xsjs");
		var xsenv = require("sap-xsenv");		
		var options = xsjs.extend({
			//	anonymous : true, // remove to authenticate calls
			redirectUrl: "/index.xsjs"
		});

		//configure HANA
		try {
			options = xsjs.extend(options, xsenv.getServices({
				hana: {
					tag: "hana"
				}
			}));
		} catch (err) {
			console.error(err);
		}

		try {
			options = xsjs.extend(options, xsenv.getServices({
				secureStore: {
					tag: "hana"
				}
			}));
		} catch (err) {
			console.error(err);
		}

		// configure UAA
		try {
			options = xsjs.extend(options, xsenv.getServices({
				uaa: {
					tag: "xsuaa"
				}
			}));
		} catch (err) {
			console.error(err);
		}

		// start server
		var xsjsApp = xsjs(options);
		app.use(xsjsApp);
	}
};