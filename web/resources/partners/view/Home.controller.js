jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.shineNext.partners.view.Home", {

	onInit : function() {
		var model = new sap.ui.model.json.JSONModel({
			mode : sap.m.ListMode.None,
			inEdit : false,
			inDelete : false,
			inBatch : false
		});
		this.getView().setModel(model, "local");
	},
	
	itemPress : function(evt) {
		var bus = sap.ui.getCore().getEventBus();
		bus.publish("nav", "to", {
			id : "Detail",
			data : {
				context : evt.getSource().getBindingContext()
			}
		});
	},
	
	createButtonPress : function(evt) {
		var view = this.getView();
		view.inputCreate.getController().setResultItem(undefined);
		sap.ui.getCore().getEventBus().publish("nav", "virtual");
		view.createDialog.open();
	},
	
	createDialogCancel : function(evt) {
		var view = this.getView(); 
		view.createDialog.close();
		sap.ui.getCore().getEventBus().publish("nav", "back");
	},
	
	createDialogConfirm : function() {
		var view = this.getView();
			
			// update model
			var newItem = view.inputCreate.getController().getResultItem();
			var oModel = sap.ui.getCore().getModel();
	
			oModel.setHeaders({"content-type" : "application/json;charset=utf-8"});
			oModel.create('/Buyer', newItem, null, function() {
				view.createDialog.close();
				sap.ui.getCore().getEventBus().publish("nav", "back");				
				sap.m.MessageToast.show("Create successful");
			}, function(oError) {
				view.createDialog.close();
				sap.ui.getCore().getEventBus().publish("nav", "back");	
				 if(oError.response.statusCode == '500'){
   	   	 		     var errorRes = JSON.parse(oError.response.body);
   	   	 		     sap.m.MessageToast.show(errorRes.error.message.value, {
   	   	 		        closeOnBrowserNavigation: false});
   	   	 	 	 }
   	   	  	 	 else{
   					 sap.m.MessageToast.show("oError.response.statusText", {
   	   	   	 		    closeOnBrowserNavigation: false});
   	   	 	 }
			});

	},

});