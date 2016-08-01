/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
"use strict";
module.exports = function() {
	var express = require("express");
	var async = require('async');
	var cds = require('sap-cds');
	var winston = require('winston');
	var util = require(global.__base + "utils/datagen");

	var app = express.Router();
	winston.level = process.env.winston_level || 'error';
	app.get('/soheader', function(req, res) {
		console.log('reset so header triggered');
		util.resetTable(
			req,
			res,
			"SO.Header",
			"SOShadow.Header",
			util.callback
		);
	});

	app.get('/soitem', function(req, res) {
		console.log('reset so item triggered');
		util.resetTable(
			req,
			res,
			"SO.Item",
			"SOShadow.Item",
			util.callback
		);
	});

	app.get('/poheader', function(req, res) {
		console.log('reset po header triggered');
		util.resetTable(
			req,
			res,
			"PO.Header",
			"POShadow.Header",
			util.callback
		);
	});

	app.get('/poitem', function(req, res) {
		console.log('reset po item triggered');
		util.resetTable(
			req,
			res,
			"PO.Item",
			"POShadow.Item",
			util.callback
		);
	});

	app.get('/addresses', function(req, res) {
		console.log('reset addresses triggered');
		util.resetTable(
			req,
			res,
			"MD.Addresses",
			"MDShadow.Addresses",
			util.callback
		);
	});

	app.get('/partners', function(req, res) {
		console.log('reset business partners triggered');
		util.resetTable(
			req,
			res,
			"MD.BusinessPartner",
			"MDShadow.BusinessPartner",
			util.callback
		);
	});

	app.get('/employees', function(req, res) {
		console.log('reset employees triggered');
		util.resetTable(
			req,
			res,
			"MD.Employees",
			"MDShadow.Employees",
			util.callback
		);
	});

	app.get('/products', function(req, res) {
		console.log('reset products triggered');
		util.resetTable(
			req,
			res,
			"MD.Products",
			"MDShadow.Products",
			util.callback
		);
	});

	app.get('/constants', function(req, res) {
		console.log('reset constants triggered');
		util.resetTable(
			req,
			res,
			"Util.Constants",
			"UtilShadow.Constants",
			util.callback
		);
	});

	app.get('/texts', function(req, res) {
		console.log('reset texts triggered');
		util.resetTable(
			req,
			res,
			"Util.Texts",
			"UtilShadow.Texts",
			util.callback
		);
	});

	app.get('/notes', function(req, res) {
		console.log('reset notes triggered');
		util.resetTable(
			req,
			res,
			"Util.Notes",
			"UtilShadow.Notes",
			util.callback
		);
	});

	app.get('/attachments', function(req, res) {
		console.log('reset attachments triggered');
		util.resetTable(
			req,
			res,
			"Util.Attachments",
			"UtilShadow.Attachments",
			util.callback
		);
	});

	return app;
};