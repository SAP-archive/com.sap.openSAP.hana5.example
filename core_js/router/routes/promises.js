/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */

"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	function readFilePromisified(filename) {
		return new Promise(
			function(resolve, reject) {
				require("fs").readFile(filename, "utf8", (error, data) => {
					if (error) {
						reject(error);
					} else {
						resolve(data);
					}
				});
			}
		);
	}

	function preparePromisified(client, query) {
		return new Promise((resolve, reject) => {
			client.prepare(query, (error, statement) => {
				if (error) {
					reject(error);
				} else {
					resolve(statement);
				}
			});
		});
	}

	function statementExecPromisified(statement, parameters) {
		return new Promise((resolve, reject) => {
			statement.exec(parameters, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	}

	function loadProcedurePromisified(hdbext, client, schema, procedure) {
		return new Promise((resolve, reject) => {
			hdbext.loadProcedure(client, schema, procedure, (error, storedProc) => {
				if (error) {
					reject(error);
				} else {
					resolve(storedProc);
				}
			});
		});
	}

	function callProcedurePromisified(storedProc, inputParams) {
		return new Promise((resolve, reject) => {
			storedProc(inputParams, (error, outputScalar, results) => {
				if (error) {
					reject(error);
				} else {
					resolve({outputScalar: outputScalar, results: results});
				}
			});
		});
	}

	//Hello Router
	app.get("/", function(req, res) {
		var output = "<H1>ES6 Promises</H1></br>" +
			"<a href=\"" + req.baseUrl + "/promises\">/promises</a> - Manual Promisefy readFile</br>" +
			"<a href=\"" + req.baseUrl + "/promisesError\">/promisesError</a> - Manual Promisefy readFile and catch error</br>" +
			"<a href=\"" + req.baseUrl + "/promisesDB1\">/promisesDB1</a> - Simple HANA DB Select via Promises</br>" +
			"<a href=\"" + req.baseUrl + "/promisesDB2\">/promisesDB2</a> - Simple Database Call Stored Procedure via Promises</br>" +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//Manual Promisefy readFile
	app.get("/promises", function(req, res) {
		var body = "";

		readFilePromisified(global.__base + "async/file.txt")
			.then(text => {
				return res.type("text/html").status(200).send(text);
			})
			.catch(error => {
				console.log(error);
			});
	});

	//Manual Promisefy readFile and catch error
	app.get("/promisesError", function(req, res) {
		var body = "";

		readFilePromisified(global.__base + "async/missing.txt")
			.then(text => {
				return res.type("text/html").status(200).send(text);
			})
			.catch(error => {
				return res.type("text/html").status(200).send(error.toString());
			});
	});

	//Simple Database Select Promises
	app.get("/promisesDB1", function(req, res) {
		var client = req.db;
		preparePromisified(client, "select SESSION_USER from \"DUMMY\" ")
			.then(statement => {
				statementExecPromisified(statement, [])
					.then(results => {
						var result = JSON.stringify({
							Objects: results
						});
						res.type("application/json").status(200).send(result);
					})
					.catch(err => {
						res.type("text/plain").status(500).send("ERROR: " + err.toString());
						return;
					});
			})
			.catch(err => {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			});
	});

	//Simple Database Call Stored Procedure via Promises
	app.get("/promisesDB2", function(req, res) {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		//(client, Schema, Procedure)
		loadProcedurePromisified(hdbext, client, null, "get_po_header_data")
			.then(sp => {
				//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
				callProcedurePromisified(sp, {})
					.then(({parameters, results}) => {
						var result = JSON.stringify({
							EX_TOP_3_EMP_PO_COMBINED_CNT: results
						});
						res.type("application/json").status(200).send(result);
					})
					.catch(err => {
						res.type("text/plain").status(500).send("ERROR: " + err.toString());
					});
			})
			.catch(err => {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			});
	});

	return app;
};