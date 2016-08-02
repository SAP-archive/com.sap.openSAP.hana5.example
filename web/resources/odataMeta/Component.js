jQuery.sap.declare("sap.shineNext.odataMeta.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.odataMeta.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
  
	      var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/businessPartners.xsodata/", true);
          sap.ui.getCore().setModel(oModel, "bpModel");  
          
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "odataMeta",
				title: "OData Metadata Exercise",
				description: "SHINE OData Metadata Exercise"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.odataMeta.view.App",
			type: "JS",
			viewData: settings
		});
		 oView.setModel(sap.ui.getCore().getModel("bpModel"), "bpModel");  		
		return oView;
	}
});