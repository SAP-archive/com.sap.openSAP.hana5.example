/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"shine/democontent/epm/poworklist/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("shine.democontent.epm.poworklist.controller.Shell", {

		onInit: function() {
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.registerMessageProcessor(oMessageProcessor);

			oMessageManager.addMessages(
				new sap.ui.core.message.Message({
					message: sap.global.oBundle.getText("Welcome"),
					type: sap.ui.core.MessageType.Information,
					processor: oMessageProcessor
				})
			);
		},

		onMessagesButtonPress: function(oEvent) {

			var oMessagesButton = oEvent.getSource();
			if (!this._messagePopover) {
				this._messagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				oMessagesButton.addDependent(this._messagePopover);
			}
			this._messagePopover.toggle(oMessagesButton);
		},

		onAddNew: function(oEvent) {
			var aViewName = this.getView().getViewName().split(".");
			aViewName.pop();
			var sViewPath = aViewName.join(".") + ".";
			if (!this.newDialog) {
				this.newDialog = sap.ui.xmlfragment("createNewPurchaseOrderDialog", sViewPath + "createNewPurchaseOrder", this);
				this.getView().addDependent(this.newDialog);
			}
			this.newDialog.open();
			return;
		},

		onExcelPress: function(oEvent) {
			window.open("/node/excel/downloadPO");
			return;
		},

		onZipPress: function(oEvent) {
			window.open("/node/zip/zipPO");
			return;
		},

		close: function(oEvent) {
			var oDialog = (oEvent.getSource()).getEventingParent();
			this.clearUIFields();
			oDialog.close();
		},

		clearUIFields: function() {
			var uiFieldsArray = sap.global.oBundle.getText("uiFields");
			var uiFields = uiFieldsArray.split(",");
			for (var i = 0; i < uiFields.length; i++) {
				var uiId = uiFields[i];
				var element = sap.ui.getCore().byId(uiId);
				if (element.getValue() !== "") {
					element.setValue("");
				}
				element.setValueState(sap.ui.core.ValueState.none);
			}
		}
		
	});
});