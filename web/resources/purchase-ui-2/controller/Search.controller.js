/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"shine/democontent/epm/poworklist/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("shine.democontent.epm.poworklist.controller.Search", {

		setFilter: function(oEvent) {
			//filterTerms = terms;
			var terms = oEvent.getParameter("query");
			var attribute = "COMPANY";
			var mySplitResults = terms.split(' | ' + sap.global.oBundle.getText("attribute") + ' ');
			gFilterTerms = mySplitResults[0];
			gFilterAttribute = mySplitResults[1];

			if (gFilterTerms === "*"){ this.emptyFilter();}

			oTable = this.getOwnerComponent().getAggregation("rootControl").byId("po_table_view").byId("poTable");

			//Change from the Display Attribute Names to the property names in the ODATA service
			switch (gFilterAttribute) {
				case 'Company Name':
				case 'Firmenname':
					gFilterAttribute = 'COMPANYNAME';
					break;
				case 'Product ID':
				case 'Produkt':
					gFilterAttribute = 'PRODUCT_PRODUCTID';
					break;
				case 'Product Name':
				case 'Produkt Benennung':
					gFilterAttribute = 'ProductName';
					break;
				case 'Product Description':
				case 'Produktbeschreibung':
					gFilterAttribute = 'PRODUCTDESC';
					break;
				case 'City':
				case 'Stadt':
					gFilterAttribute = 'CITY';
					break;
				case 'Category':
				case 'Kategorie':
					gFilterAttribute = 'CATEGORY';
					break;
				case 'Purchase Order ID':
				case 'Auftragsbestätigung':
					gFilterAttribute = 'PURCHASEORDERID';
					break;
			}

			//Build OData Service Sorter by PO ID, and Item
			var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");

			//Build the OData Service Filter Options
			if (gFilterTerms === "") {
				oTable.bindRows("/PO_WORKLIST", sort1, []);
			} else {
				var aflt1 = new sap.ui.model.Filter(escape(gFilterAttribute), sap.ui.model.FilterOperator.EQ, escape(gFilterTerms));
				oTable.bindRows("/PO_WORKLIST", sort1, [aflt1]);
			}

			//Set the Number of Rows in table header and clear the table lead selection
			var iNumberOfRows = oTable.getBinding("rows").iLength;
			oTable.setTitle(oBundle.getText("pos", [numericSimpleFormatter(iNumberOfRows)]));
			oTable.clearSelection();

			//When a new search is executed, the detail item area must be cleared
			var oView = this.getOwnerComponent().getAggregation("rootControl").byId("po_detail_view");
			var Context = "/PO_WORKLIST(PURCHASEORDERID='JUNK')";
			oView.bindContext(Context);

			var columns = oTable.getColumns();
			var length = columns.length;
			for (var i = 0; i < length; i++) {
				columns[i].setFilterValue('');
				columns[i].setFiltered(false);
			}

			var oTableItem = this.getOwnerComponent().getAggregation("rootControl").byId("po_detail_view").byId("poItemTable");
			var ContextItem = "/PurchaseOrderHeader(PurchaseOrderId='JUNK')/PurchaseOrderItem";
			var sort1 = new sap.ui.model.Sorter("PurchaseOrderId,PurchaseOrderItem");
			oTableItem.bindRows(ContextItem, sort1);

			var columns = oTableItem.getColumns();
			var length = columns.length;
			for (i = 0; i < length; i++) {
				columns[i].setFilterValue('');
				columns[i].setFiltered(false);
			}

		},

		emptyFilter: function() {
			gFilterTerms = "";
			gFilterAttribute = "";

			oTable = sap.ui.getCore().byId("poTable");
			var sort1 = new sap.ui.model.Sorter("PURCHASEORDERID,PURCHASEORDERITEM");
			oTable.bindRows("/PO_WORKLIST", sort1);
		},

		loadFilter: function(oEvent) {
			sap.global.gSearchParam = oEvent.getParameter("suggestValue");
			if (sap.global.gSearchParam === "") {
				return;
			} else {
				var aUrl = '/sap/hana/democontent/epm/services/poWorklistQuery.xsjs?cmd=filter' + '&query=' + escape(sap.global.gSearchParam) +
					'&page=1&start=0&limit=25';
				jQuery.ajax({
					url: aUrl,
					method: 'GET',
					dataType: 'json',
					success: jQuery.proxy(onLoadFilter, this),
					error: onErrorCall
				});
			}
		},

		openTileDialog: function(oEvent) {
			var iData = parseInt(oEvent.getSource().data("tileDialog"));
			var oTileDialog = new sap.account.TileDialog(this, iData);
			this.getView().addDependent(oTileDialog);
			oTileDialog.open();
		}

	});
});

function onLoadFilter(myJSON) {
	var oSuggestItems = sap.ui.getCore().getComponent("comp").getModel("suggestItems");
	var oSearchControl = this.byId("filterBy");
	oSearchControl.setModel(oSuggestItems);

	var suggestItems = [];
	var newData = {};
	newData.Collection = [];
	for (var i = 0; i < myJSON.length; i++) {
		suggestItems[i] = {};
		suggestItems[i].Name = myJSON[i].terms + ' | ' + sap.global.oBundle.getText("attribute") + ' ' + myJSON[i].attribute;
		suggestItems[i].key = myJSON[i].terms;
	//	newData.Collection[i].push(suggestItems);
	}
	newData.Collection = suggestItems;
	oSuggestItems.setData(newData, true);
	var selectTemplate = new sap.m.SuggestionItem({
		id: "suggestionsTemp",
		key: "{key}",
		text: "{Name}"
	});
	oSearchControl.setModel(oSuggestItems);
	oSearchControl.bindAggregation("suggestionItems", "/Collection", selectTemplate);
	oSearchControl.suggest();

}

function onErrorCall(jqXHR, textStatus, errorThrown) {
	sap.ui.commons.MessageBox.show(jqXHR.responseText,
		"ERROR",
		oBundle.getText("error_action"));
	return;
}