jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.SelectDialog");

sap.ui.controller("sap.shineNext.poa.view.Detail", {

	/**
	 * Called by the UI5 runtime to init this controller
	 */
	onInit : function () {
		this.getView().setModel(sap.ui.getCore().getModel("i18n"),"i18n");
		this.getView().setModel(sap.ui.getCore().getModel("device"),"device");
		this.getView().setModel(sap.ui.getCore().getModel("employee"),"employee");	
		this.getView().setModel(sap.ui.getCore().getModel());			
		// subscribe for refresh events
		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "RefreshDetail", this._refresh, this);
	},
	
	/**
	 * Called by the UI5 runtime to cleanup this controller
	 */
	onExit : function () {
		// destroy the control if needed
		if (this._recipientDialog) {
			this._recipientDialog.destroy();
			this._recipientDialog = null;
		}
	},
	
	/**
	 * Refreshes the model
	 */
	_refresh : function (channelId, eventId, data) {
		
		if (data && data.context) {
			
			// set context of selected master object
			this.getView().setBindingContext(data.context);
			
			var context = this.getView().getBindingContext();
			var oModel = new sap.ui.model.json.JSONModel({
				actionsEnabled : context && !!context.getObject()
			});
			this.getView().setModel(oModel, "cfg");
			
			// scroll to top of page
			this.getView().byId("page").scrollTo(0);
		}
	},
	
	/**
	 * Lazy loading of tab content
	 */
	handleTabSelect : function (evt) {
		var key = evt.getParameter("key");
		var item = evt.getParameter("item");
		var tabBar = evt.getSource();
		if (item.getContent().length === 0) {
			var view = new sap.ui.view({
				id : "tabView" + key,
				viewName : "sap.shineNext.poa.view.Detail" + key,
				type : "XML"
			});
			item.addContent(view);
		}
	},
	
	handleLineItemPress : function (evt) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "LineItem",
			data : {
				context : evt.getSource().getBindingContext()
			}
		});
	},
	
	handleNavBack : function (evt) {
		sap.ui.getCore().getEventBus().publish("nav", "back");
	},
	
	handleApprove : function (evt) {
		this._showApproveRejectDialog("approve");
	},
	
	handleReject : function (evt) {
		this._showApproveRejectDialog("reject");
	},
	
	/**
	 * Shows the approve or reject dialog
	 * @param {String} [mode] Allows to differ between APPROVE and REJECT mode
	 */
	_showApproveRejectDialog : function (mode, forwardRecipientName) {
		
		// to be on the safe side
		var selectedDetail = this.getView().getBindingContext().getObject();
		if (!selectedDetail) {
			return;
		}
		
		// get texts
		var bundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
		var dialogTitle = bundle.getText(mode + "DialogTitle");
		var confirmButtonText = bundle.getText(mode + "DialogConfirmAction");
		var busyTitle = bundle.getText(mode + "DialogBusyTitle");
		var successMsg = bundle.getText(mode + "DialogSuccessMsg");
		var confirmMsg = bundle.getText(mode + "DialogConfirmMsg");
		confirmMsg = confirmMsg.replace("{0}", selectedDetail.CreatedByName);
		confirmMsg = confirmMsg.replace("{1}", forwardRecipientName);
		
		// create dialog
		var that = this;
		var dialog = new sap.m.Dialog({
			title : dialogTitle,
			content : [
				new sap.m.Text({
					text : confirmMsg
				}).addStyleClass("sapUiSmallMarginBottom"),
				new sap.m.TextArea({
					rows : 4,
					width : "100%",
					placeholder : bundle.getText("dialogNotePlaceholder")
				})
			],
			contentWidth : "30rem",
			stretchOnPhone : true,
			leftButton : new sap.m.Button({
				text : confirmButtonText,
				press : function () {
					dialog.close();
				}
			}),
			rightButton : new sap.m.Button({
				text : bundle.getText("dialogCancelAction"),
				press : function () {
					dialog.close();
				}
			}),
			afterClose : function (evt) {
				
				// remove virtual state if dialog not closed by browser history
				var pressedButton = evt.getParameter("origin");
				if (pressedButton) {
					sap.ui.getCore().getEventBus().publish("nav", "back");
				}
				
				// open busy dialog if confirmed
				if (pressedButton === this.getLeftButton()) {
					
					// open busy dialog
					var busyDialog = new sap.m.BusyDialog({
						showCancelButton : false,
						title : busyTitle,
						close : function () {
							
							// remove detail from model
							var oModel = sap.ui.getCore().getModel();
							var oData = oModel.getData();
							var oldCollection = oData.PurchaseOrderCollection;
							var newCollection = jQuery.grep(oldCollection, function (detail) {
								return detail.ID !== selectedDetail.ID;
							});
							oData["PurchaseOrderCollection"] = newCollection;
							oModel.setData(oData);
							
							// tell list to update selection
							sap.ui.getCore().getEventBus().publish("app", "SelectDetail");
							
							// the app controller will close all message toast on a "nav back" event
							// this is why we can show this toast only after a delay
							setTimeout(function () {
								sap.m.MessageToast.show(successMsg);
							}, 200);
						}
					});
					busyDialog.open();
					
					// close busy dialog after some delay
					setTimeout(jQuery.proxy(function () {
						busyDialog.close();
						busyDialog.destroy();
					}, this), 2000);
				}
				
				// clean up
				dialog.destroy();
			}
		});
		
		// open dialog
		sap.ui.getCore().getEventBus().publish("nav", "virtual");
		dialog.open();
	},
	
	handleForward : function (evt) {
		// lazy creation of recipient dialog
		if (!this._recipientDialog) {
			this._createRecipientDialog();
		}

		// open dialog
		sap.ui.getCore().getEventBus().publish("nav", "virtual");
		this._recipientDialog.open();
	},

	_createRecipientDialog : function (evt) {
		
		// create the dialog as an internal member
		this._recipientDialog = sap.ui.xmlfragment("sap.shineNext.poa.view.RecipientHelpDialog", this);
		this._recipientDialog.setFilterOperator(sap.ui.model.FilterOperator.Contains); // TODO : move to XML view once API changed
		this._recipientDialog.setModel(sap.ui.getCore().getModel("i18n"), "i18n"); // TODO: remove once ResourceModel issue is fixed
		
		// TODO: sort does not work with GrowingList yet
			/*sorter : new sap.ui.model.Sorter("LastName", false, function (oContext) {
				var lastName = oContext.getProperty("LastName"),
					letter = (lastName && lastName.length > 0) ? lastName.charAt(0).toUpperCase() : "?";
				return {
					key: letter,
					text: letter
				};
			}),*/
	},
	
	closeRecipientDialog : function (evt) {

		var selectedItem = evt.getParameter("selectedItem");
		if (selectedItem) {
			
			// display the reject dialog if an item was selected 
			sap.ui.getCore().getEventBus().publish("nav", "virtual");
			this._showApproveRejectDialog("forward", selectedItem.getTitle());
			
		} else {
			
			// remove virtual state if dialog not cancelled via browser history back
			sap.ui.getCore().getEventBus().publish("nav", "back");
		}
	}
});