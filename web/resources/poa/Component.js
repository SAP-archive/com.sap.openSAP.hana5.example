jQuery.sap.declare("sap.shineNext.poa.Component");


sap.ui.core.UIComponent.extend("sap.shineNext.poa.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageToast");
		jQuery.sap.require("sap.shineNext.poa.model.Config");	
  
		// set data model (mock/oData)
		var m;
		if (!sap.shineNext.poa.model.Config.isMock) {
			var url = sap.shineNext.poa.model.Config.getServiceUrl();
			m = new sap.ui.model.odata.ODataModel(url, true);
		} else {
			m = new sap.ui.model.json.JSONModel("model/mock.json");
		}
		sap.ui.getCore().setModel(m);
		
		// publish event once data is loaded
		m.attachRequestCompleted(function () {
			sap.ui.getCore().getEventBus().publish("app", "DataLoaded");
		});
		
		// set employee mock model
		var employeeUrl = '/sap/hana/democontent/epm/services/poa.xsjs?cmd=getEmployees';
		var eModel = new sap.ui.model.json.JSONModel(employeeUrl, true);
		eModel.loadData(employeeUrl);
		//var eModel = new sap.ui.model.json.JSONModel("model/mockEmployee.json");
		sap.ui.getCore().setModel(eModel, "employee");
		
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messagebundle.hdbtextbundle"
		});
		sap.ui.getCore().setModel(i18nModel, "i18n");
		
		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : jQuery.device.is.phone,
			isNoPhone : !jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		sap.ui.getCore().setModel(deviceModel, "device");
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);		
	},
	
	createContent: function() {
     
		var settings = {
				ID: "poa",
				title: "Purchase Order Approval",
				description: "SHINE Purchase Order Approval"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.shineNext.poa.view.App",
			type: "JS",
			viewData: settings
		});
		
		// show message if in demo mode
		if (sap.shineNext.poa.model.Config.isMock) {
			var msg = "Running in demo mode with mock data";
			sap.m.MessageToast.show(msg, {
				duration: 1000
			});
		}
		
		oView.setModel(sap.ui.getCore().getModel("employee"), "employee");  		
		return oView;
	}
});