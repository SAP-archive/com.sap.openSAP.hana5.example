/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"shine/democontent/epm/poworklist/controller/BaseController",
	"shine/democontent/epm/poworklist/model/utilities",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem"
], function(BaseController, utilities, JSONModel, MessagePopover, MessagePopoverItem) {
	"use strict";

	return BaseController.extend("shine.democontent.epm.poworklist.controller.Shell", {

		onInit: function() {

			var oViewModel = new JSONModel({
				isPOPage: false,
				busy: false
			});

			this.setModel(oViewModel, "mainview");
			this.oModel = new JSONModel({ messagesLength: 0});
			this.getView().setModel(this.oModel);
			
			this._initRouting();

			this._oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageManager.registerMessageProcessor(this._oMessageProcessor);

			// Initializing popover
			this.initializePopover();
		},
		initializePopover: function (oControl) {
			this._messagePopover = new MessagePopover({
				models: {message: this._oMessageManager.getMessageModel()},
				items: {
					path: "message>/",
					template: new MessagePopoverItem({
						type: "{message>type}",
						title: "{message>message}",
						description: "{message>description}"
					})
				}
			});
		},
		onMessagesButtonPress: function(oEvent) {
			var oMessagesButton = oEvent.getSource();
			// Either open the created popover if it isn't opened, or close it
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
			sap.ui.getCore().getMessageManager().addMessages(
				new sap.ui.core.message.Message({
					message: "Excel Export",
					description: "Excel Export has begun",
					type: sap.ui.core.MessageType.Information,
					processor: this._oMessageProcessor
				})
			);
			this.oModel.setProperty("/messagesLength", this._oMessageManager.getMessageModel().getData().length);
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
			var uiFieldsArray = this.getResourceBundle().getText("uiFields");
			var uiFields = uiFieldsArray.split(",");
			for (var i = 0; i < uiFields.length; i++) {
				var uiId = uiFields[i];
				var element = sap.ui.getCore().byId(uiId);
				if (element.getValue() !== "") {
					element.setValue("");
				}
				element.setValueState(sap.ui.core.ValueState.none);
			}
		},

		onNavBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash(),
				oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				// The history contains a previous entry
				/*eslint-disable*/
				history.go(-1); /*eslint-enable*/
			} else if (oCrossAppNavigator) {
				// Navigate back to FLP home
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#"
					}
				});
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_initRouting: function() {
			var oViewModel = this.getModel("mainview");
			// all routes to sub-pages are also caught in the mainpage,
			// to steer the visibility of the two containers containing the sub-pages

			this.getRouter().getRoute("start").attachPatternMatched(function() {
				// because the start page is a message page, isPOPage is set to false.
				oViewModel.setProperty("/isPOPage", false);
				// when starting fresh, e.g. by deleting the hash of a purchase order deep link, 
				// the input is set back to empty.
				this.byId("input").setValue("");
			}, this);

			this.getRouter().getTargets().getTarget("notFound").attachDisplay(function() {
				oViewModel.setProperty("/isPOPage", false);
			}, this);

			/*		this.getRouter().getTargets().getTarget("confirmed").attachDisplay(function() {
						oViewModel.setProperty("/isPOPage", false);
					}, this);

					this.getRouter().getRoute("po").attachPatternMatched(function(oEvent) {
						var sPO = oEvent.getParameter("arguments").poId;
						oViewModel.setProperty("/isPOPage", true);
						this.byId("input").setValue(sPO);
						this._bindView("/SEPMRA_C_GR_PurchaseOrder('" + sPO + "')");
					}, this);*/
		}

	});
});