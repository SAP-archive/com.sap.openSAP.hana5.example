/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	"shine/democontent/epm/poworklist/model/models",
	"shine/democontent/epm/poworklist/controller/ErrorHandler"
], function(UIComponent, ResourceModel, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("shine.democontent.epm.poworklist.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			/*			jQuery.sap.require("sap.m.MessageBox");
						jQuery.sap.require("sap.m.MessageToast");
						jQuery.sap.require("shine.democontent.epm.poworklist.js.global");	*/

			this._oErrorHandler = new ErrorHandler(this);
			sap.ui.core.UIComponent.prototype.init.apply(
				this, arguments);
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			this.getSessionInfo();

		},

		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
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
				var config = this.getModel("config");
				config.setProperty("/UserName", myJSON.session[i].UserName);
			}
		},

		getErrorHandler: function() {
			return this._oErrorHandler;
		}

	});

});