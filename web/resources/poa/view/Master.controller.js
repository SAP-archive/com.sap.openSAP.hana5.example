jQuery.sap.require("util.Formatter");

sap.ui.controller("sap.shineNext.poa.view.Master", {

	/**
	 * Called by the UI5 runtime to init this controller
	 */
	onInit : function () {
		this.getView().setModel(sap.ui.getCore().getModel("i18n"),"i18n");
		this.getView().setModel(sap.ui.getCore().getModel("device"),"device");
		this.getView().setModel(sap.ui.getCore().getModel("employee"),"employee");	
		this.getView().setModel(sap.ui.getCore().getModel());	
		// handle data loaded events
		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "DataLoaded", function () {
			
			// show list, hide busy indicator
			var list = this.getView().byId("list");
			var busyIndicator = this.getView().byId("busyIndicator");
			list.setVisible(true);
			busyIndicator.setVisible(false);
			
			// default selection
			this._selectDetail();
			
		}, this);
		
		// handle select events
		bus.subscribe("app", "SelectDetail", this._selectDetail, this);
		
		// move the search bar below the pullToRefresh on touch devices
		if (sap.ui.Device.support.touch) {
			var bar = this.getView().byId("searchBar");
			var page = this.getView().byId("page");
			page.insertAggregation("content", bar, 1);
		}
	},
	
	onExit : function() {
	},
	
	/**
	 * Initially selects the first item (excluding for phones)
	 */
	_selectDetail : function () {
		var list = this.getView().byId("list");
		var items = list.getItems();
		if (!jQuery.device.is.phone && items.length > 0 && !list.getSelectedItem()) {
			list.setSelectedItem(items[0], true);
			this._showDetail(items[0]);
		}
	},
	
	handleRefresh : function (evt) {
		var that = this;
		if (sap.shineNext.poa.model.Config.isMock) {
			
			// just wait if we do not have oData services
			setTimeout(function () {
				that.getView().byId("pullToRefresh").hide();
			}, 2000);
			
		} else {
			
			// trigger search again and hide pullToRefresh when data ready
			var list = this.getView().byId("list");
			var binding = list.getBinding("items");
			var handler = function() {
				that.getView().byId("pullToRefresh").hide();
				binding.detachDataReceived(handler);
			};
			binding.attachDataReceived(handler);
			that._updateList();
		}
	},
	
	handleSearch : function (evt) {
		this._updateList();
	},
	
	handleFilterChange : function (evt) {
		this._updateList();
	},
	
	_updateList : function () {
		
		var filters = [];
		
		// add filter for search
		var searchString = this.getView().byId("searchField").getValue();
		if (searchString && searchString.length > 0) {
			var filter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.Contains, searchString);
			filters.push(filter);
		}
		
		// add filter for filter
		var select = this.getView().byId("filterSelect");
		var key = select.getSelectedKey();
		var filterMap = {
			"5k" : new sap.ui.model.Filter("Amount", sap.ui.model.FilterOperator.GE, 5000),
			"10k" : new sap.ui.model.Filter("Amount", sap.ui.model.FilterOperator.GE, 10000)
		};
		if (filterMap[key]) {
			filters.push(filterMap[key]);
		}
		
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	handleListSelect : function (evt) {
		this._showDetail(evt.getParameter("listItem"));
	},
	
	handleListItemPress : function (evt) {
		this._showDetail(evt.getSource());
	},
	
	/**
	 * Fires both nav and refresh events for a detail object
	 * @param {sap.m.ListItemBase} [item] the list item representing the detail object
	 */
	_showDetail : function (item) {
		
		// navigate to detail page
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "Detail"
		});
		
		// tell detail to update
		sap.ui.getCore().getEventBus().publish("app", "RefreshDetail", {
			context : item.getBindingContext()
		});
	},
	
	handleListItemApprove : function(evt) {

		var bundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
		// hide button
		var list = this.getView().byId("list");
		var swipedItem = list.getSwipedItem();
		list.swipeOut();
		
		// open busy dialog
		var busyDialog = new sap.m.BusyDialog({
			showCancelButton : false,
			title : bundle.getText("approveDialogBusyTitle"),
			close : function () {
				// remove detail from model
				var oModel = sap.ui.getCore().getModel();
				var oData = oModel.getData();
				var oldCollection = oData.PurchaseOrderCollection;
				var newCollection = jQuery.grep(oldCollection, function (detail) {
					return detail.ID !==  swipedItem.getBindingContext().getObject().ID;
				});
				oData["PurchaseOrderCollection"] = newCollection;
				oModel.setData(oData);
				
				// tell list to update selection
				sap.ui.getCore().getEventBus().publish("app", "SelectDetail");
				
				// the app controller will close all message toast on a "nav back" event
				// this is why we can show this toast only after a delay
				setTimeout(function () {
					sap.m.MessageToast.show(bundle.getText("approveDialogSuccessMsg"));
				}, 200);
			}
		});
		busyDialog.open();
		
		// close busy dialog after some delay
		setTimeout(jQuery.proxy(function () {
			busyDialog.close();
			busyDialog.destroy();
		}, this), 2000);
	}
});