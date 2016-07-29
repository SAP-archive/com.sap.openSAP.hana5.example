"use strict";

var xsjs = require("sap-xsjs");
var xsjstest = require("sap-xsjs-test");
var xsenv = require("sap-xsenv");

var options = xsjs.extend({
    test: {
        format: "json",
        pattern: ".*Test",
        reportdir: "./"
    },
    coverage: {
        reporting: {
            reports: ["json"]
        },
        dir: "./"
    }
});

//configure HANA
try {
    options = xsjs.extend(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
    console.error(err);
}

// configure UAA
try {
    options = xsjs.extend(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
    console.error(err);
}

xsjstest(options).runTests();
