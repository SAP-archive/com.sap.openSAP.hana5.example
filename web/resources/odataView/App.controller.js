/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.controller("odataView.App", {
	onInit: function() {
		this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
		var userName = sap.ui.getCore().getModel("config").getProperty("/UserName");
		var urlMulti = "/xsodata/purchaseOrder.xsodata";
		sap.ui.getCore().getModel().setProperty("/mPath", urlMulti);
		sap.ui.getCore().getModel().setProperty("/mEntity1", "/POHeader");
		sap.ui.getCore().getModel().setProperty("/mEntity2", "/POItem");
	},
	callMultiService: function() {
		var oTable = sap.ui.getCore().byId("App").byId("tblPOHeader");
		var oTableItem = sap.ui.getCore().byId("App").byId("tblPOItem");		    	  

		oTable.removeAllColumns();
		oTable.removeAllItems();
		oTableItem.removeAllColumns();
		oTableItem.removeAllItems();

		var mPath = sap.ui.getCore().getModel().getProperty("/mPath");
		var mEntity1 = sap.ui.getCore().getModel().getProperty("/mEntity1");
		var mEntity2 = sap.ui.getCore().getModel().getProperty("/mEntity2");

		var oModel = new sap.ui.model.odata.ODataModel(mPath, true);
		oModel.attachEvent("requestFailed", oDataFailed);

		var oMeta = oModel.getServiceMetadata();
		var oControl;
		var columnList = new sap.m.ColumnListItem();
		var columnListItem = new sap.m.ColumnListItem();
		if (!oMeta) {
			sap.m.MessageBox.show("Bad Service Definition", {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Service Call Error",
				actions: [sap.m.MessageBox.Action.OK],
				styleClass: "sapUiSizeCompact"
			});
		} else {
			//Table Column Definitions 
			for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
				var property = oMeta.dataServices.schema[0].entityType[0].property[i];
				oTable.addColumn(new sap.m.Column({
					header: new sap.m.Label({
						text: property.name
					}),
					width: "125px"
				}));
				columnList.addCell(new sap.m.Text({
					text: {
						path: property.name
					},
					name: property.name
				}));
			}
			oTable.setModel(oModel);
			for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
				var property = oMeta.dataServices.schema[0].entityType[1].property[i];

				oTableItem.addColumn(new sap.m.Column({
					header: new sap.m.Label({
						text: property.name
					}),
					width: "125px"
				}));
				columnListItem.addCell(new sap.m.Text({
					text: {
						path: property.name
					},
					name: property.name
				}));
			}
			oTableItem.setModel(oModel);
		}
		oTable.bindItems({
			path: mEntity1,
			template: columnList
		});
		oTableItem.bindItems({
			path: mEntity2,
			template: columnListItem
		});
	},
	onRowSelect: function(oEvent) {
		var data = oEvent.getSource().getModel();
		var oTable = oEvent.getSource();
		var poId = data.getProperty("PURCHASEORDERID", oTable.getContextByIndex(oTable.getSelectedIndex()));
		var oTableItems = sap.ui.getCore().byId("tblPOItem");
		var ContextItem = sap.ui.getCore().byId("val2_2").getValue() + "(PURCHASEORDERID='" + poId + "')" + sap.ui.getCore().byId("val2_3").getValue();
		oTableItems.bindItems(ContextItem);
	},
	callExcel: function(oEvent) {
		//Excel Download
		window.open("/xsjs/hdb.xsjs");
		return;
	}
});