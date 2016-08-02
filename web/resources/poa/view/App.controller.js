jQuery.sap.require("sap.shineNext.poa.util.baseAppController");

sap.shineNext.poa.util.baseAppController("sap.shineNext.poa.view.App", {
	
	onInit : function () {
		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				
				defaultPageId : "Master",
				
				isMaster : function (sPageId) {
					return ("Detail" !== sPageId && "LineItem" !== sPageId);
				},
				
				viewName : function (sPageId) {
					return "sap.shineNext.poa.view." + sPageId;
				},
				
				viewType : "XML",
				
				transition : "slide"
			};
		
		this.configureApplication(this.getView().app, oAppConfig);
	}
});