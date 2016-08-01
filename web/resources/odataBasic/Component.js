/*eslint no-undef: 0*/
jQuery.sap.declare("opensap.odataBasic.Component");

sap.ui.core.UIComponent.extend("opensap.odataBasic.Component", {

	createContent: function() {
		//To-Do: Insert Model Here
		var oModel = new sap.ui.model.odata.ODataModel("/xsodata/businessPartners.xsodata/", true);
		sap.ui.getCore().setModel(oModel, "bpModel");

		var settings = {
			ID: "odataBasic",
			title: "OData Basic Exercise",
			description: "SHINE service for OData Basic Exercise"
		};

		var oView = sap.ui.view({
			id: "app",
			viewName: "opensap.odataBasic.view.App",
			type: "JS",
			viewData: settings
		});

		oView.setModel(oModel, "bpModel");
		return oView;
	}
});