sap.ui.controller("sap.shineNext.partners.view.Input", {

	onInit : function() {

		// set model
    	var model = new sap.ui.model.json.JSONModel({});
		this.getView().setModel(model);
	},
	
	getResultItem : function() {
		var result = this.getView().getModel().getData();
		if (!result.Id) {
			result.Id = '0000000000';
		}
		return result;
	},
	
	setResultItem: function(existingItem) {
		var data = (existingItem === undefined) ? {} : existingItem;
		this.getView().getModel().setData(data);
	}
});