/*eslint no-console: 0, no-unused-vars: 0, new-cap:0 */
"use strict";
var express = require("express");
var WebSocketServer = require("ws").Server;

module.exports = function(server) {
	var app = express.Router();
	var asyncLib = require(global.__base + "async/async.js");
	var dbAsync = require(global.__base + "async/databaseAsync.js");
	var dbAsync2 = require(global.__base + "async/databaseAsync2.js");
	var fileSync = require(global.__base + "async/fileSync.js");
	var fileAsync = require(global.__base + "async/fileAsync.js");
	var httpClient = require(global.__base + "async/httpClient.js");

	app.use(function(req, res) {
		var output = "<H1>Asynchronous Examples</H1></br>" +
			"<a href=\"/exerciseAsync\">/exerciseAsync</a> - Test Framework for Async Examples</br>" +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});
	var wss = new WebSocketServer({
		server: server,
		path: "/node/excAsync"
	});

	wss.broadcast = function(data) {
		var message = JSON.stringify({
			text: data
		});
		wss.clients.forEach(function each(client) {
			try {
				client.send(message);
			} catch (e) {
				console.log("Broadcast Error: %s", e.toString());
			}
		});
		console.log("sent: %s", message);

	};

	wss.on("connection", function(ws) {
		console.log("Connected");

		ws.on("message", function(message) {
			console.log("received: %s", message);
			var data = JSON.parse(message);
			switch (data.action) {
				case "async":
					asyncLib.asyncDemo(wss);
					break;
				case "fileSync":
					fileSync.fileDemo(wss);
					break;
				case "fileAsync":
					fileAsync.fileDemo(wss);
					break;
				case "httpClient":
					httpClient.callService(wss);
					break;
				case "dbAsync":
					dbAsync.dbCall(wss);
					break;
				case "dbAsync2":
					dbAsync2.dbCall(wss);
					break;
				default:
					wss.broadcast("Error: Undefined Action: " + data.action);
					break;
			}
		});
		ws.send(JSON.stringify({
			text: "Connected to Exercise 3"
		}));
	});

	return app;
};