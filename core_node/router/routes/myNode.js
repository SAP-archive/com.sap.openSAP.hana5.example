/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var async = require("async");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>HDBEXT Examples</H1></br> 
			<a href="${req.baseUrl}/example1">/example1</a> - Simple Database Select - Promises and Await</br> 
			<a href="${req.baseUrl}/example2">/example2</a> - Simple Database Select - Async Waterfall</br> 
			<a href="${req.baseUrl}/example3">/example3</a> - Call Stored Procedure</br> 
			<a href="${req.baseUrl}/example4/1">/example4</a> - Call Stored Procedure with Input = Partner Role 1 </br> 
			<a href="${req.baseUrl}/example4/2">/example4</a> - Call Stored Procedure with Input = Partner Role 2 </br> 
			<a href="${req.baseUrl}/example5">/example5</a> - Call Two Stored Procedures in Parallel Because We Can!</br> 
			<a href="${req.baseUrl}/whoAmI">/whoAmI</a> - Look at the session information</br> 
			<a href="${req.baseUrl}/hdb">/hdb</a> - Small DB example - port of hdb.xsjs</br> 
			<a href="${req.baseUrl}/os">/os</a> - Operating System Information - port of os.xsjs</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - Promises and Await
	app.get("/example1", async(req, res) => {

		try {
			let client = req.db;
			client.promisePrepare = await require("util").promisify(client.prepare);
			const statement = await client.promisePrepare("select SESSION_USER from \"DUMMY\" ");
			statement.promiseExec = await require("util").promisify(statement.exec);
			const results = await statement.promiseExec([]);
			var result = JSON.stringify({
				Objects: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});

	//Simple Database Select - Async Waterfall
	app.get("/example2", (req, res) => {
		var client = req.db;
		async.waterfall([

			function prepare(callback) {
				client.prepare("select SESSION_USER from \"DUMMY\" ",
					(err, statement) => {
						callback(null, err, statement);
					});
			},

			function execute(err, statement, callback) {
				statement.exec([], function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					return;
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});

	//Simple Database Call Stored Procedure
	app.get("/example3", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		//(client, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "get_po_header_data", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp({}, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				var result = JSON.stringify({
					EX_TOP_3_EMP_PO_COMBINED_CNT: results
				});
				res.type("application/json").status(200).send(result);
			});
		});
	});

	//Database Call Stored Procedure With Inputs
	app.get("/example4/:partnerRole?", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var partnerRole = req.params.partnerRole;
		var inputParams = "";
		if (typeof partnerRole === "undefined" || partnerRole === null) {
			inputParams = {};
		} else {
			inputParams = {
				IM_PARTNERROLE: partnerRole
			};
		}
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				var result = JSON.stringify({
					EX_BP_ADDRESSES: results
				});
				res.type("application/json").status(200).send(result);
			});
		});
	});

	//Call 2 Database Stored Procedures in Parallel
	app.get("/example5/", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var inputParams = {
			IM_PARTNERROLE: "1"
		};
		var result = {};
		async.parallel([

			function(cb) {
				hdbext.loadProcedure(client, null, "get_po_header_data", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_TOP_3_EMP_PO_COMBINED_CNT = results;
						cb();
					});
				});

			},
			function(cb) {
				//(client, Schema, Procedure, callback)            		
				hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_BP_ADDRESSES = results;
						cb();
					});
				});
			}
		], (err) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				res.type("application/json").status(200).send(JSON.stringify(result));
			}

		});

	});

	app.get("/whoAmI", (req, res) => {
		var userContext = req.authInfo;
		var result = JSON.stringify({
			userContext: userContext
		});
		res.type("application/json").status(200).send(result);
	});

	//Call Stored Procedure and return as Excel
	app.get("/products", async(req, res) => {
		try {
			let dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			var hdbext = require("@sap/hdbext");
			const sp = await dbConn.loadProcedurePromisified(hdbext, null, "build_products");
			const output = await dbConn.callProcedurePromisified(sp, {});
			var out = [];
			for (let result of output.results) {
				out.push([result.PRODUCTID, result.CATEGORY, result.PRICE]);
			}
			var excel = require("node-xlsx");
			var excelOut = excel.build([{
				name: "Products",
				data: out
			}]);
			res.header("Content-Disposition", "attachment; filename=Excel.xlsx");
			return res.type("application/vnd.ms-excel").status(200).send(excelOut);
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});

	app.get("/hdb", async(req, res) => {
		try {
			let dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			const statement = await dbConn.preparePromisified(
				`SELECT FROM PurchaseOrder.Item { 
			                 POHeader.PURCHASEORDERID as "PurchaseOrderId", 
			                 PRODUCT as "ProductID", 
			                 GROSSAMOUNT as "Amount" } `
			);
			const results = await dbConn.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				PurchaseOrders: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});

	app.get("/user1", (req, res) => {
		var userContext = req.authInfo;
		var result = JSON.stringify({
			userContext: userContext
		});
		res.type("application/json").status(200).send(result);
	});

	return app;
};