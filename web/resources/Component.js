/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
jQuery.sap.declare("opensap.odataTest.Component");

sap.ui.core.UIComponent.extend("opensap.odataTest.Component", {
	init: function() {
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");

		var model = new sap.ui.model.json.JSONModel({});
		sap.ui.getCore().setModel(model);
		var oConfig = new sap.ui.model.json.JSONModel({});
		sap.ui.getCore().setModel(oConfig, "config");
		this.getSessionInfo();

		sap.ui.core.UIComponent.prototype.init.apply(
			this, arguments);
	},

	createContent: function() {

		var settings = {
			ID: "App",
			title: "Workshop OData Test",
			description: "Workshop OData Test"
		};

		var oView = sap.ui.view({
			id: "App",
			viewName: "odataView.App",
			type: "XML",
			viewData: settings
		});

		var page = new sap.m.Page("pageID", {
			title: "Workshop CDS and OData Test",
			showHeader: false,
			content: oView
		});
		page.setBusyIndicatorDelay(10);
		oView.setModel(sap.ui.getCore().getModel(
			"config"), "config");
		oView.setModel(sap.ui.getCore().getModel());
		return page;
	},

	getSessionInfo: function() {
		var aUrl = "/xsjs/exercisesMaster.xsjs?cmd=getSessionInfo";
		this.onLoadSession(
			JSON.parse(jQuery.ajax({
				url: aUrl,
				method: "GET",
				dataType: "json",
				async: false
			}).responseText));
	},

	onLoadSession: function(myJSON) {
		for (var i = 0; i < myJSON.session.length; i++) {
			var config = sap.ui.getCore().getModel("config");
			config.setProperty("/UserName", myJSON.session[i].UserName);
		}
	}
});