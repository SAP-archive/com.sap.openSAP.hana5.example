jQuery.sap.declare("sap.shine.esh.Component");


sap.ui.core.UIComponent.extend("sap.shine.esh.Component", {

	createContent: function() {

		this.view = sap.ui.view({
			id: "app",
			viewName: "sap.shine.esh.view.servicePage",
			type: "XML"
		});
		
		return this.view;
	},
	
	metadata : {
		name : "Full-text Search with SAPUI5, ODATA, and CDS",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.ui.commons","sap.m"],
			components : []
		},
		config : {
			resourceBundle : "i18n/messagebundle.hdbtextbundle"
		},
		properties : {
			ID: {	name:"ID", type:"string", defaultValue:"productsearch" },
			title: {	name:"title", type:"string", defaultValue:"Products Search in SHINE" },			
			description: {	name:"description", type:"string", defaultValue:"SHINE service for OData search" },	
			url: {	name:"url", type:"string", defaultValue:"/sap/hana/democontent/epm/ui5search/services/productTexts.xsodata" },
			schema: {	name:"schema", type:"string", defaultValue:"com.sap.openSAP.hana5.example.services" },
			entitySet: {	name:"entitySet", type:"string", defaultValue:"PRODUCTS_TEXT" }
		}


	},
	
	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("sap.shine.esh");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

	}
	
});
