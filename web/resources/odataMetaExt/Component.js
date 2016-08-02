jQuery.sap.declare("sap.shineNext.odataMetaExt.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.odataMetaExt.Component", {
	init: function(){
 
	      var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epmNext/services/businessPartnersExt.xsodata/", true);
          sap.ui.getCore().setModel(oModel, "bpModel");  
          
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "odataMeta",
				title: "OData Extended Metadata Exercise",
				description: "SHINE OData Extended Metadata Exercise"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.odataMetaExt.view.App",
			type: "JS",
			viewData: settings
		});
		 oView.setModel(sap.ui.getCore().getModel("bpModel"), "bpModel");  		
		return oView;
	}
});