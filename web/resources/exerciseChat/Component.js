jQuery.sap.declare("sap.xs.chat.Component");


sap.ui.core.UIComponent.extend("sap.xs.chat.Component", {
	init: function(){
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");		
		// Chat Model
      	var oModel = new sap.ui.model.json.JSONModel();
       	var names = ["Student1","Student2","Student3","Student4","Student5","Student6"];
      	oModel.setData({
      		user: names[Math.floor(names.length * Math.random())],
        	chat: "",
        	message: ""
      	});
      	sap.ui.getCore().setModel(oModel,"chatModel");
         
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
	},
	
	createContent: function() {
     
		var settings = {
				ID: "chatRoot",
				title: "Node.js Web Sockets Chat",
				description: "Node.js Web Sockets Chat"
			};
		
		var oView = sap.ui.view({
			id: "app",
			viewName: "sap.xs.chat.view.App",
			type: "XML",
			viewData: settings
		});
		oView.setModel(sap.ui.getCore().getModel("chatModel"));
    	return oView;
	}
});