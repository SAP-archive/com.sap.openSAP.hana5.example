//To use a javascript view its name must end with .view.js
sap.ui.jsview("spatial-demo.productsHeatMap", {

    getControllerName : function() {
        return "spatial-demo.productsHeatMap";
    },
    
	createContent : function(oController) {	
        var view = this;

        //create a horizontal Splitter
        var oSplitterV = new sap.ui.commons.Splitter("heatMapSplitter");
        oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
        oSplitterV.setSplitterPosition("60%");
        oSplitterV.setMinSizeFirstPane("50%");
        oSplitterV.setMinSizeSecondPane("20%");
        oSplitterV.setWidth("100%");
        oSplitterV.setHeight("100%");

        view.oList = new sap.m.List({
            width: '100%'
        });
        view.oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("CHOOSE_PRODUCT")
        }));

        view.selector = new sap.m.Select({
           width: '100%',
           change: function(oEvent) {
               oController.onProductSelected(oEvent, oController);
           },
           validationSuccess: function(oEvent) {
               alert('val success');
           }
        });
        
        view.oList.addItem(new sap.m.CustomListItem({
            content: [view.selector]
        }));

        // sales chart
        view.oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("PRODUCT_SALES_YOY")
        }));

        view.oSalesChart = new sap.makit.Chart({
            type: sap.makit.ChartType.Column,
            width: "100%",
            height: "300px",
            showRangeSelector: false,
            showTableValue: true,
            category: new sap.makit.Category({
                column: "YEAR",
                displayName: sap.app.i18n.getText("YEAR")
            }),
            values: [new sap.makit.Value({
                expression: "AMOUNT",
                format: "rounded2",
                displayName: sap.app.i18n.getText("AMOUNT")
            })],
        });

        view.oSalesChart.addColumn(new sap.makit.Column({
            name: "YEAR",
            value: "{YEAR_OF_SALE}"
        }));
        view.oSalesChart.addColumn(new sap.makit.Column({
            name: "AMOUNT",
            value: "{GROSSAMOUNT_1}"
        }));
        
        view.oList.addItem(new sap.m.CustomListItem({
            content: [view.oSalesChart]
        }));

        oSplitterV.addSecondPaneContent(view.oList);

        return oSplitterV;
	}
});