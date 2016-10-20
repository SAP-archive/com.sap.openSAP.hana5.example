/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");
var async = require("async");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", function(req, res) {
		res.type("text/html").status(200).send("");
	});

	app.get("/actions/getcsrftoken/", function(req, res) {
		res.type("text/html").status(200).send("");
	});

	app.post("/variants/", function(req, res) {
		res.type("text/html").status(200).send("");
	});

	app.post("/changes/", function(req, res) {
		res.type("text/html").status(200).send("");
	});

	app.get("/flex/data/:app?", function(req, res) {

		var body =
			{"fileName":"id_1477001516898_26_page","fileType":"variant","changeType":"page","reference":"sap.openSAP.smarttable.Component","packageName":"","content":{"SmartFilter_BusinessPartner":{"version":"V2","filterbar":[],"filterBarVariant":"{\"PARTNERID\":{\"value\":null,\"ranges\":[],\"items\":[]},\"PARTNERROLE\":{\"value\":null,\"ranges\":[{\"exclude\":false,\"operation\":\"EQ\",\"keyField\":\"PARTNERROLE\",\"value1\":\"1\",\"value2\":\"\",\"tokenText\":\"=1\"}],\"items\":[]},\"EMAILADDRESS\":{\"value\":null,\"ranges\":[],\"items\":[]},\"COMPANYNAME\":{\"value\":null,\"ranges\":[],\"items\":[]},\"LEGALFORM\":{\"value\":null,\"ranges\":[],\"items\":[]},\"CITY\":{\"value\":null,\"ranges\":[],\"items\":[]},\"POSTALCODE\":{\"value\":null,\"ranges\":[],\"items\":[]},\"BUILDING\":{\"value\":null,\"ranges\":[],\"items\":[]},\"STREET\":{\"value\":null,\"ranges\":[],\"items\":[]},\"COUNTRY\":{\"value\":null,\"ranges\":[],\"items\":[]},\"REGION\":{\"value\":null,\"ranges\":[],\"items\":[]}}"},"SmartTableAnalytical_BusinessPartner":{}},"selector":{"persistencyKey":"PageVariantPKey"},"layer":"USER","texts":{"variantName":{"value":"test","type":"XFLD"}},"namespace":"apps/undefined/changes/sap.openSAP.smarttable/","creation":"","originalLanguage":"EN","conditions":{},"context":"","support":{"generator":"Change.createInitialFileContent","service":"","user":""}};
		var outer = {
			"changes": [],
			"settings": {
				"isKeyUser": true,
				"isAtoAvailable": false,
				"isProductiveSystem": false
			}
		};
		outer.changes.push(body);
		res.type("application/json").status(200).send(outer);
	});

	return app;
};