/*eslint no-console: 0*/
/*eslint-env node, es6 */
"use strict";

var xsjs = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;
global.__base = __dirname + "/";

var options = {
	//	anonymous : true, // remove to authenticate calls
	redirectUrl: "/index.xsjs",
	context: {
		base: global.__base,
		env: process.env,
		answer: 42
	}
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({
		hana: {
			tag: "hana"
		}
	}));
	options = Object.assign(options, xsenv.getServices({
		secureStore: {
			tag: "hana"
		}
	}));
} catch (err) {
	console.log("[WARN]", err.message);
}

//Add SQLCC
try {
	options.hana.sqlcc = xsenv.getServices({
		"xsjs.sqlcc_config": "CROSS_SCHEMA_SFLIGHT"
	});
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	}));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);