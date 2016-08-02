jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.shineNext.partners.view.Detail", {

	onInit : function() {
		// subscribe to onBeforeShow events
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
	},
	
	onBeforeShow : function(evt) {
		if (evt.data.context) {
			this.getView().setBindingContext(evt.data.context);
		}
	},
	
	navButtonPress : function(evt) {
		sap.ui.getCore().getEventBus().publish("nav", "back");
	}
	
	

});