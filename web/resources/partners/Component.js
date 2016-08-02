jQuery.sap.declare("sap.shineNext.partners.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.partners.Component", {
	init: function(){
 
          var oModel = new sap.ui.model.odata.ODataModel('/sap/hana/democontent/epm/services/businessPartners2.xsodata', true);
          sap.ui.getCore().setModel(oModel, "bpModel");  
          
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "odataMeta",
				title: "Business Partenrs",
				description: "SHINE Business Partners"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.partners.view.App",
			type: "JS",
			viewData: settings
		});
		 oView.setModel(sap.ui.getCore().getModel("bpModel"));  	
		return oView;

	}
});