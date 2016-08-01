  sap.ui.controller("opensap.odataBasic.view.App", {
 	onInit: function() {
 		var model = new sap.ui.model.json.JSONModel({});
 		this.getView().setModel(model);
 	},

 	callUserService: function() {
 		var oModel = sap.ui.getCore().getModel("userModel");
 		var result = this.getView().getModel().getData();
 		var oEntry = {};
 		oEntry.UserId = "0000000000";
 		oEntry.FirstName = result.FirstName;
 		oEntry.LastName = result.LastName;
 		oEntry.Email = result.Email;
 		oEntry.ZMYNEW1 = "";

 		oModel.setHeaders({
 			"content-type": "application/json;charset=utf-8"
 		});
 		oModel.create("/Users", oEntry, null, function() {
 			sap.m.MessageToast.show("Create successful");
 		}, this.onErrorCall);
 	},

 	callUserUpdate: function() {
 		var oModel = sap.ui.getCore().getModel("userModel");
 		oModel.setHeaders({"content-type" : "application/json;charset=utf-8"});
 		oModel.submitChanges(
 			function() {
 				sap.m.MessageToast.show("Update successful");
 			},
 			function() {
 				sap.m.MessageToast.show("Update failed");
 			});
 	},

 	onErrorCall: function(oError) {
 		if (oError.response.statusCode === 500 || oError.response.statusCode === 400) {
 			var errorRes = JSON.parse(oError.response.body);
 			if (!errorRes.error.innererror){
 			 	sap.m.MessageBox.alert(errorRes.error.message.value);	
 			}else{
 				if (!errorRes.error.innererror.message){
 					sap.m.MessageBox.alert(errorRes.error.innererror.toString());
 				}else{
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
