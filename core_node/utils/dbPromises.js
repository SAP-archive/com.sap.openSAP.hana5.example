/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";

module.exports = class {

	constructor(client) {
		this.client = client;
		this.util = require("util");
		this.client.promisePrepare = this.util.promisify(this.client.prepare);			
	}

	preparePromisified(query) {
		return this.client.promisePrepare(query);
	}

	statementExecPromisified(statement, parameters) {
		statement.promiseExec = this.util.promisify(statement.exec);
		return statement.promiseExec(parameters);	
	}

	loadProcedurePromisified(hdbext, schema, procedure) {
		hdbext.promiseLoadProcedure = this.util.promisify(hdbext.loadProcedure);
		return 	hdbext.promiseLoadProcedure(this.client, schema, procedure);
	}

	callProcedurePromisified(storedProc, inputParams) {
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
