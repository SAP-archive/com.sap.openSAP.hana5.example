/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";
var express = require("express");

function buildAnnotationXML(res, results, target) {
	var xmlOut = "";

	var xmlHeader =
		'<?xml version="1.0" encoding="utf-8"?><edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData" Version="1.0">' +
		'<edmx:DataServices m:DataServiceVersion="2.0">' +
		'<Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="com.sap.openSAP.hana5.example.services">';
	var xmlFooter =
		'</Schema></edmx:DataServices></edmx:Edmx>';
	var xmlAnnotationTarget =
		'<Annotations xmlns="http://docs.oasis-open.org/odata/ns/edm" Target="' + target + '">';

	var xmlLineItem = '<Annotation Term="com.sap.vocabularies.UI.v1.LineItem"><Collection>';
	var value;
	var elementName = '';
	for (var i = 0; i < results.length; i++) {
		if (results[i].ANNOTATION_NAME === "annotations.UI") {
			value = JSON.parse(results[i].VALUE);
			if (typeof value.value.lineItem !== 'undefined') {
				elementName = results[i].ELEMENT_NAME;
				xmlLineItem += '<Record Type="com.sap.vocabularies.UI.v1.DataField">' +
					'<PropertyValue Property="Value" Path="' + results[i].ELEMENT_NAME + '"/>';
				if (typeof value.value.lineItem.importance !== 'undefined') {
					xmlLineItem += '<Annotation Term="com.sap.vocabularies.UI.v1.Importance" EnumMember="com.sap.vocabularies.UI.v1.ImportanceType/' +
						value.value.lineItem.importance + '"/>';
				}
				for (var inner = 0; inner < results.length; inner++) {
					if (results[inner].ELEMENT_NAME === elementName) {
						if (results[inner].ANNOTATION_NAME === "annotations.EndUserText") {
							value = JSON.parse(results[inner].VALUE);
							if (typeof value.value.label !== 'undefined') {
								xmlLineItem += '<PropertyValue Property="Label" String="' + value.value.label[0].text + '" />';
							}
							if (typeof value.value.quickInfo !== 'undefined') {
								xmlLineItem += '<PropertyValue Property="QuickInfo" String="' + value.value.label[0].text + '" />';
							}
						}

					}
				}
				xmlLineItem += '</Record>';
			}
		}
	}

	var endAnnotation = '</Collection></Annotation></Annotations>';
	xmlOut = xmlHeader + xmlAnnotationTarget + xmlLineItem + endAnnotation + xmlFooter;
	res.type("application/xml").status(200).send(xmlOut);
	return;

}

module.exports = function() {
	var app = express.Router();
	var bodyParser = require("body-parser");
	app.use(bodyParser.json());

	app.get("/:target/:artifact", function(req, res) {
		var target = req.params.target;
		var artifact = req.params.artifact;

		var client = req.db;
		var insertString = "SELECT * from CDS_ANNOTATION_VALUES " +
			" WHERE SCHEMA_NAME = CURRENT_SCHEMA AND ARTIFACT_NAME = ? ORDER BY ELEMENT_NAME ";
		client.prepare(
			insertString,
			function(err, statement) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				}
				statement.exec([artifact],
					function(err, results) {
						if (err) {
							res.type("text/plain").status(500).send("ERROR: " + err.toString());
							return;
						} else {
							buildAnnotationXML(res, results, target);
							return;
						}
					});
			});

	});

	return app;
};