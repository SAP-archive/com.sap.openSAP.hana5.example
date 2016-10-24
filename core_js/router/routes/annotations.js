/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";
var express = require("express");
var et = require('elementtree');
var XML = et.XML;
var ElementTree = et.ElementTree;
var element = et.Element;
var subElement = et.SubElement;

function getLocale(req) {
	var langparser = require("accept-language-parser");
	var lang = req.headers["accept-language"];
	if (!lang) {
		return 'EN';
	}
	var arr = langparser.parse(lang);
	if (!arr || arr.length < 1) {
		return 'EN';
	}
	var locale = arr[0].code;
	return locale.toUpperCase();
}

function getValueByKey(key, value, data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i] && data[i].hasOwnProperty(key)) {
			if (data[i][key] === value) {
				return data[i];
			}
		}
	}
}

function buildXMLHeader() {
	var Edmx = element('edmx:Edmx');
	Edmx.set('xmlns:edmx', 'http://schemas.microsoft.com/ado/2007/06/edmx');
	Edmx.set('xmlns:m', 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata');
	Edmx.set('xmlns:sap', 'http://www.sap.com/Protocols/SAPData');
	Edmx.set('Version', '1.0');

	var DataServices = subElement(Edmx, 'edmx:DataServices');
	DataServices.set('m:DataServiceVersion', '2.0');

	var Schema = subElement(DataServices, 'Schema');
	Schema.set('xmlns:d', 'http://schemas.microsoft.com/ado/2007/08/dataservice');
	Schema.set('xmlns:m', 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata');
	Schema.set('xmlns', 'http://schemas.microsoft.com/ado/2008/09/edm');
	Schema.set('Namespace', 'com.sap.openSAP.hana5.example.services');

	return {
		root: Edmx,
		schema: Schema
	};
}

function buildAnnotationTarget(xml, target) {
	xml.annotationTarget = subElement(xml.schema, 'Annotations');
	xml.annotationTarget.set('xmlns', 'http://docs.oasis-open.org/odata/ns/edm');
	xml.annotationTarget.set('Target', target);
}

function buildLineItem(xml, cdsAnnotationValues) {
	xml.lineItem = subElement(xml.annotationTarget, 'Annotation');
	xml.lineItem.set('Term', 'com.sap.vocabularies.UI.v1.LineItem');
	var collection = subElement(xml.lineItem, 'Collection');
	for (var i = 0; i < cdsAnnotationValues.length; i++) {

		//Line Item
		if (typeof cdsAnnotationValues[i].lineItem !== 'undefined') {
			var record = subElement(collection, 'Record');
			record.set('Type', 'com.sap.vocabularies.UI.v1.DataField');

			var propertyValue = subElement(record, 'PropertyValue');
			propertyValue.set('Property', 'Value');
			propertyValue.set('Path', cdsAnnotationValues[i].ELEMENT_NAME);

			if (typeof cdsAnnotationValues[i].Label !== 'undefined') {
				var label = subElement(record, 'PropertyValue');
				label.set('Property', 'Label');
				label.set('String', cdsAnnotationValues[i].Label);
			}

			if (typeof cdsAnnotationValues[i].quickInfo !== 'undefined') {
				var quick = subElement(record, 'PropertyValue');
				quick.set('Property', 'QuickInfo');
				quick.set('String', cdsAnnotationValues[i].quickInfo);
			}
			if (typeof cdsAnnotationValues[i].lineItem.importance !== 'undefined') {
				var importance = subElement(record, 'Annotation');
				importance.set('Term', 'com.sap.vocabularies.UI.v1.Importance');
				importance.set('EnumMember', 'com.sap.vocabularies.UI.v1.ImportanceType/' + cdsAnnotationValues[i].lineItem.importance);
			}

			if (typeof cdsAnnotationValues[i].lineItem.position !== 'undefined') {
				var position = subElement(record, 'PropertyValue');
				position.set('Property', 'Position');
				position.set('String', cdsAnnotationValues[i].lineItem.position);
			}

		}

	}
}

function buildFieldGroup(xml, cdsAnnotationValues) {
	xml.fieldGroup = subElement(xml.annotationTarget, 'Annotation');
	xml.fieldGroup.set('Term', 'com.sap.vocabularies.UI.v1.FieldGroup');
	xml.fieldGroup.set('Qualifier', 'Primary');
	var record = subElement(xml.fieldGroup, 'Record');

	var filterLabel = subElement(record, 'PropertyValue');
	filterLabel.set('Property', 'Label');
	filterLabel.set('String', 'Primary');

	var filterData = subElement(record, 'PropertyValue');
	filterData.set('Property', 'Data');

	var collection = subElement(filterData, 'Collection');
	for (var i = 0; i < cdsAnnotationValues.length; i++) {
		if (typeof cdsAnnotationValues[i].fieldGroup !== 'undefined') {
			var recordInner = subElement(collection, 'Record');
			recordInner.set('Type', 'com.sap.vocabularies.UI.v1.DataField');

			var propertyValue = subElement(recordInner, 'PropertyValue');
			propertyValue.set('Property', 'Value');
			propertyValue.set('Path', cdsAnnotationValues[i].ELEMENT_NAME);

			if (typeof cdsAnnotationValues[i].Label !== 'undefined') {
				var label = subElement(recordInner, 'PropertyValue');
				label.set('Property', 'Label');
				label.set('String', cdsAnnotationValues[i].Label);
			}

			if (typeof cdsAnnotationValues[i].quickInfo !== 'undefined') {
				var quick = subElement(recordInner, 'PropertyValue');
				quick.set('Property', 'QuickInfo');
				quick.set('String', cdsAnnotationValues[i].quickInfo);
			}
			if (typeof cdsAnnotationValues[i].fieldGroup.importance !== 'undefined') {
				var importance = subElement(recordInner, 'Annotation');
				importance.set('Term', 'com.sap.vocabularies.UI.v1.Importance');
				importance.set('EnumMember', 'com.sap.vocabularies.UI.v1.ImportanceType/' + cdsAnnotationValues[i].lineItem.importance);
			}

			if (typeof cdsAnnotationValues[i].fieldGroup.position !== 'undefined') {
				var position = subElement(recordInner, 'PropertyValue');
				position.set('Property', 'Position');
				position.set('Integer', cdsAnnotationValues[i].fieldGroup.position);
			}

			if (typeof cdsAnnotationValues[i].fieldGroup.exclude !== 'undefined') {
				var exclude = subElement(recordInner, 'PropertyValue');
				exclude.set('Property', 'Exclude');
				exclude.set('Boolean', cdsAnnotationValues[i].fieldGroup.exclude);
			}
		}

	}
}

function flattenCDSAnnotationVaules(results, locale) {
	var cdsAnnotationValues = [];
	var i = 0;
	var value = '';
	var temp = '';

	for (i = 0; i < results.length; i++) {
		if (!getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues)) {
			cdsAnnotationValues.push({
				ELEMENT_NAME: results[i].ELEMENT_NAME
			});
		}
	}

	for (i = 0; i < results.length; i++) {
		if (results[i].ANNOTATION_NAME === "annotations.EndUserText") {
			value = JSON.parse(results[i].VALUE);

			if (typeof value.value.label !== 'undefined') {
				temp = getValueByKey('language', locale, value.value.label);
				if (temp) {
					getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).Label = temp.text;
				} else {
					temp = getValueByKey('language', 'EN', value.value.label);
					if (temp) {
						getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).Label = temp.text;
					}
				}
			}

			if (typeof value.value.quickInfo !== 'undefined') {
				temp = getValueByKey('language', locale, value.value.quickInfo);
				if (temp) {
					getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).quickInfo = temp.text;
				} else {
					temp = getValueByKey('language', 'EN', value.value.quickInfo);
					if (temp) {
						getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).quickInfo = temp.text;
					}
				}
			}
		}

		if (results[i].ANNOTATION_NAME === "annotations.UI") {
			value = JSON.parse(results[i].VALUE);
			if (typeof value.value.fieldGroup !== 'undefined') {
				getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).fieldGroup = value.value.fieldGroup[0];
			}
			if (typeof value.value.lineItem !== 'undefined') {
				getValueByKey('ELEMENT_NAME', results[i].ELEMENT_NAME, cdsAnnotationValues).lineItem = value.value.lineItem[0];
			}

		}

	}
	return cdsAnnotationValues;
}

function buildAnnotationXML(res, results, target, req) {
	var locale = getLocale(req);
	var xmlOut = "";
	var xml = buildXMLHeader();
	buildAnnotationTarget(xml, target);
	var cdsAnnotationValues = flattenCDSAnnotationVaules(results, locale);
	buildLineItem(xml, cdsAnnotationValues);
	buildFieldGroup(xml, cdsAnnotationValues);

	var etree = new ElementTree(xml.root);
	xmlOut = etree.write({
		'xml_declaration': true
	});
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
							buildAnnotationXML(res, results, target, req);
							return;
						}
					});
			});

	});

	return app;
};