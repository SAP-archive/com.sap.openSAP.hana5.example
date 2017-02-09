sap.ui.define([
	"sap/ui/Device"
], function(Device) {
	"use strict";

	//var sContentDensityClass = Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";

	var sContentDensityClass = (function() {
		var sCozyClass = "sapUiSizeCozy",
			sCompactClass = "sapUiSizeCompact",
			oBody = jQuery(document.body);
		if (oBody.hasClass(sCozyClass) || oBody.hasClass(sCompactClass)) { // density class is already set by the FLP
			return "";
		} else {
			return Device.support.touch ? sCozyClass : sCompactClass;
		}
	}());

	return {
		/**
		 * Will wait until the specified properties are available in the model for the elementbinding given.
		 *
		 * @param oElementBinding the element binding that should contain the data
		 * @param aProperties the properties that are expected to be available
		 * @returns {Promise} Gets resolved if the data is already on the client or when the data has been requested from the server. Gets rejected when there was no data on the server.
		 */

		getContentDensityClass: function() {
			return sContentDensityClass;
		},

		attachControlToView: function(oView, oControl) {
			jQuery.sap.syncStyleClass(sContentDensityClass, oView, oControl);
			oView.addDependent(oControl);
		}
	};
});