jQuery.sap.declare("sap.shineNext.odataDeep.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.odataDeep.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
  
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "odataDeep",
				title: "OData Deep Insert Exercise",
				description: "SHINE OData Deep Insert Exercise"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.odataDeep.view.App",
			type: "XML",
			viewData: settings
		});
		return oView;
	}
});