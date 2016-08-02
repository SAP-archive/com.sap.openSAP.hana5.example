sap.ui.jsview("sap.shineNext.odataMeta.view.App", { 

        getControllerName: function() {
            return "sap.shineNext.odataMeta.view.App"; 
        },

        createContent: function(oController) {
	        this.addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode

            var oTable = new sap.m.Table("bpTable", {
                tableId: "bpTable",
                growingThreshold: 10,
                growing: true
            });
            var sort1 = new sap.ui.model.Sorter("PARTNERID");
            var columnList = new sap.m.ColumnListItem();
            oTable.bindItems({
                path: "bpModel>/BusinessPartners",
                template: columnList,
                sorter: sort1
            });

            //Table Column Definitions 
        	var oMeta = sap.ui.getCore().getModel("bpModel").getServiceMetadata();
            for ( var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
                var property = oMeta.dataServices.schema[0].entityType[0].property[i];
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({
                        text: property.name
                    }),
                    width: "125px"
                }));
                columnList.addCell(new sap.m.Text({
                    text: {
                        path: "bpModel>"+property.name
                    },
                    name: property.name
                }));
            }
 		  

        var displayPanel = new sap.m.Panel("dispPanel").setHeaderText('Business Partner Details');
        displayPanel.setExpandable(true);
        displayPanel.setExpanded(true);

        displayPanel.addContent(oTable);
       return displayPanel;
    }
});