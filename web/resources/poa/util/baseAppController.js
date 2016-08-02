jQuery.sap.declare("sap.shineNext.poa.util.baseAppController");

jQuery.sap.require("sap.shineNext.poa.util.AppConfig");
jQuery.sap.require("sap.shineNext.poa.util.NavigationHandler");

(function ($){
	var instance;
	
	sap.shineNext.poa.util.baseAppController = function(sName, oControllerConfig){
		if(instance){
			if(sName || oControllerConfig){
				jQuery.sap.log.error("base appController should only be configured once!");
			}
			//Get the Controller
			return instance;
		}
		
		//initialize the Controller once 
		jQuery.extend(true,oControllerConfig,{
			configureApplication : function(oApp, oAppConfig){
				//initialize global Navigation Handling
				this.navHandler = new sap.shineNext.poa.util.NavigationHandler(oApp,new sap.shineNext.poa.util.AppConfig(oAppConfig)).subscribe();
			}
		});
		instance = sap.ui.controller(sName,oControllerConfig);
	};
}(jQuery));