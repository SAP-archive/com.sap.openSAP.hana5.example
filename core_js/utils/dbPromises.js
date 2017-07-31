/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";

module.exports = {

	preparePromisified: function(client, query) {
		return new Promise((resolve, reject) => {
			client.prepare(query, (error, statement) => {
				if (error) {
					reject(error);
				} else {
					resolve(statement);
				}
			});
		});
	},

	statementExecPromisified: function(statement, parameters) {
		return new Promise((resolve, reject) => {
			statement.exec(parameters, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	},

	loadProcedurePromisified: function(hdbext, client, schema, procedure) {
		return new Promise((resolve, reject) => {
			hdbext.loadProcedure(client, schema, procedure, (error, storedProc) => {
				if (error) {
					reject(error);
				} else {
					resolve(storedProc);
				}
			});
		});
	},

	callProcedurePromisified: function(storedProc, inputParams) {
		return new Promise((resolve, reject) => {
			storedProc(inputParams, (error, outputScalar, results) => {
				if (error) {
					reject(error);
				} else {
					resolve({
						outputScalar: outputScalar,
						results: results
					});
				}
			});
		});
	}

};