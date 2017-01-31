/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/excelUpload/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.excelUpload.controller.App", {

 	onInit: function() {
		this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
		var oConfig = this.getOwnerComponent().getModel("config");
		var userName = oConfig.getProperty("/UserName");		
 		this.getView().setModel(this.getOwnerComponent().getModel());
 		var userModel = this.getOwnerComponent().getModel("userModel");
 		var oTable = this.getView().byId("userTable");
		oTable.setModel(userModel);
 	},
 	
	handleUploadComplete: function(oEvent) {
    	var sResponse = oEvent.getParameter("response");
    	if (sResponse) {
      		var sMsg = "";
      		var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
      	if (m[1] === "200") {
        	sMsg = "Return Code: " + m[1] + "\n" + m[2], "SUCCESS", "Upload Success";
        	oEvent.getSource().setValue("");
      	} else {
        	sMsg = "Return Code: " + m[1] + "\n" + m[2], "ERROR", "Upload Error";
      	}

      	sap.m.MessageToast.show(sMsg);
    	}
  	},

  	handleUploadPress: function(oEvent) {
    	var oFileUploader = sap.ui.getCore().byId("app--fileUploader");
    	oFileUploader.setUploadUrl("/node/excel/upload");

		oFileUploader.destroyHeaderParameters();	
		oFileUploader.addHeaderParameter( 
			new sap.ui.unified.FileUploaderParameter({
    	        name: "X-CSRF-Token",
    	        value: getCSRFToken()
    	}));			    		    	
    	oFileUploader.upload();
  	},

		onErrorCall: function(oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}

		}
	});
});
