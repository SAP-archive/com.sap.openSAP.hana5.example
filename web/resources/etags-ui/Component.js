jQuery.sap.require("jquery.sap.resources");
jQuery.sap.declare("shine.usercrud.etagsdemo.Component");

sap.app = {};

sap.ui.core.UIComponent.extend("shine.usercrud.etagsdemo.Component", {

	metadata : {
		name : "SHINE - User CRUD ETags Demo",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "shine.usercrud.etagsdemo.view.App",

		config : {
			resourceBundle : "i18n/messagebundle.hdbtextbundle",
			serviceConfig : {
				name: "/UserCRUD.xsodata",
				serviceUrl: "/user/xsodata/UserCRUD.xsodata"
			}
		}


	},
	
	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("shine.usercrud.etagsdemo");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		// Create and set domain model to the component
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		this.setModel(oModel);

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