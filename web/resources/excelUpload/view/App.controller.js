/*eslint no-unused-vars: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
 sap.ui.controller("opensap.excelUpload.view.App", {
 	onInit: function() {
 		var model = new sap.ui.model.json.JSONModel({});
 		this.getView().setModel(model);
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
 		if (oError.response.statusCode === 500 || oError.response.statusCode === 400) {
 			var errorRes = JSON.parse(oError.response.body);
 			sap.m.MessageBox.alert(errorRes.error.message.value);
 			return;
 		} else {
 			sap.m.MessageBox.alert(oError.response.statusText);
 			return;
 		}

 	}
 });