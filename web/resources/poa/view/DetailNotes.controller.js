sap.ui.controller("sap.shineNext.poa.view.DetailNotes", {

	/**
	 * Initializes this controller
	 */
	onInit : function () {
		this.getView().setModel(sap.ui.getCore().getModel("i18n"),"i18n");
		this.getView().setModel(sap.ui.getCore().getModel("device"),"device");
		this.getView().setModel(sap.ui.getCore().getModel("employee"),"employee");	
		this.getView().setModel(sap.ui.getCore().getModel());			
		// subscribe for refresh events
		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "RefreshDetail", this._refresh, this);
	},
	
	/**
	 * Refreshes the view
	 */
	_refresh : function (channelId, eventId, data) {
	}
});