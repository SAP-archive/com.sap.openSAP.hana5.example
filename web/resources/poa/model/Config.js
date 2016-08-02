jQuery.sap.declare("sap.shineNext.poa.model.Config");

sap.shineNext.poa.model.Config = {};

/**
 * Supply here the service url of the service to fetch data from
 */
sap.shineNext.poa.model.Config.getServiceUrl = function () {
	return '/sap/hana/democontent/epm/services/poa.xsodata';
};

/**
 * 
 */
(function () {
	
	// The "reponder" URL parameter defines if the app shall run with mock data
	var responderOn = jQuery.sap.getUriParameters().get("responderOn");
	
	// set the flag for later usage
	sap.shineNext.poa.model.Config.isMock = ("true" === responderOn) || !sap.shineNext.poa.model.Config.getServiceUrl();
}
)();