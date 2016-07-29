jQuery.sap.declare("sap.xs.Exercise3.Component");


sap.ui.core.UIComponent.extend("sap.xs.Exercise3.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
		// Chat Model
      	var oModel = new sap.ui.model.json.JSONModel();
       	oModel.setData({      		
        	chat: "",
        	message: ""
      	});
      	sap.ui.getCore().setModel(oModel,"chatModel");
         
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "chatRoot",
				title: "Exercise 3 Asynch Test Framework",
				description: "Exercise 3 Asynch Test Framework"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.xs.Exercise3.view.App",
			type: "XML",
			viewData: settings
		});
		oView.setModel(sap.ui.getCore().getModel("chatModel"));
    	return oView;
	}
});