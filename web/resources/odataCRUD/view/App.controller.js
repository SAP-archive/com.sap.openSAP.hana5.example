  sap.ui.controller("opensap.odataBasic.view.App", {
 	onInit: function() {
 		var model = new sap.ui.model.json.JSONModel({});
 		this.getView().setModel(model);
 	},

 	callUserService: function() {
 		var oModel = sap.ui.getCore().getModel("userModel");
 		var result = this.getView().getModel().getData();
 		var oEntry = {};
 		oEntry.PERS_NO = "0000000000";
 		oEntry.FIRSTNAME = result.FirstName;
 		oEntry.LASTNAME = result.LastName;
 		oEntry.E_MAIL = result.Email;

 		oModel.setHeaders({
 			"content-type": "application/json;charset=utf-8"
 		});
 		oModel.create("/Users", oEntry, null, function() {
 			sap.m.MessageToast.show("Create successful");
 		}, this.onErrorCall);
 	},

 	callUserUpdate: function() {
 		var oModel = sap.ui.getCore().getModel("userModel");
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
 			sap.m.MessageBox.alert(errorRes.error.innererror);
 			return;
 		} else {
 			sap.m.MessageBox.alert(oError.response.statusText);
 			return;
 		}

 	}
 });
