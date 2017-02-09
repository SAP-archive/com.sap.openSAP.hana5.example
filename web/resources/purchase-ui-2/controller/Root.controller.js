/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"shine/democontent/epm/poworklist/controller/BaseController",
	"shine/democontent/epm/poworklist/model/utilities",
	"sap/ui/model/json/JSONModel"
], function(BaseController, utilities, JSONModel) {
	"use strict";

	return BaseController.extend("shine.democontent.epm.poworklist.controller.Root", {

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0
			});
			this.setModel(oViewModel, "appview");

			this.getView().addStyleClass(utilities.getContentDensityClass());
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/delay", iOriginalBusyDelay);
	
		}


		
	});
});