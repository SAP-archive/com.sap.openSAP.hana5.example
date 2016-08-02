jQuery.sap.declare("sap.shineNext.xsjsMultiply.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.xsjsMultiply.Component", {
	
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);		
	},
	createContent: function() {
		var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/businessPartners.xsodata/", true);
      
		var settings = {
				ID: "xsjsMultiply",
				title: "XSJS Multiply Exercise",
				description: "SHINE XSJS Multiply Exercise"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.xsjsMultiply.view.App",
			type: "XML",
			viewData: settings
		});

		return oView;
	}
});
