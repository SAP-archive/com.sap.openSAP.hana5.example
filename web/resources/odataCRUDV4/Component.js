/*eslint no-undef: 0, no-unused-vars: 0*/
jQuery.sap.declare("opensap.odataBasic.Component");
sap.ui.core.UIComponent.extend("opensap.odataBasic.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
		
		
		var oParams = {};
		oParams.serviceUrl = "/java/odata/v4/UserData/";
		oParams.synchronizationMode= "None";
		//oParams.json = true;
		//oParams.defaultBindingMode = sap.ui.model.BindingMode.TwoWay;
		//oParams.defaultUpdateMethod = "PUT";
		//oParams.useBatch = false;
	    var oModel = new sap.ui.model.odata.v4.ODataModel(oParams);
	  	//	oModel.attachRejectChange(this,function(oEvent){
	  	//	    sap.m.MessageBox.alert("You are already editing another Entry! Please submit or reject your pending changes!");
		//	});
	  		
	    sap.ui.getCore().setModel(oModel, "userModel");  
	          
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {

		var settings = {
				ID: "odataBasic",
				title: "OData V4 CRUD Exercise",
				description: "SHINE service for OData V4 CRUD Exercise"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "opensap.odataBasic.view.App",
			type: "XML",
			viewData: settings
		});
		
		 oView.setModel(sap.ui.getCore().getModel("userModel"), "userModel");   
		return oView;
	}
});
