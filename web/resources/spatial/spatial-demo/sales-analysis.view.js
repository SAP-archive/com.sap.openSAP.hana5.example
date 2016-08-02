sap.ui.jsview("spatial-demo.sales-analysis", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf shine-so.main
     */
    getControllerName: function() {
        return "spatial-demo.sales-analysis";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf shine-so.main
     */
    createContent: function(oController) {
        var view = this;

        //create a horizontal Splitter
        var oSplitterV = new sap.ui.commons.Splitter();
        oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
        oSplitterV.setSplitterPosition("60%");
        oSplitterV.setMinSizeFirstPane("50%");
        oSplitterV.setMinSizeSecondPane("20%");
        oSplitterV.setWidth("100%");
        oSplitterV.setHeight("100%");

        view.oList = new sap.m.List({
            width: '100%'
        });
        view.oList.addItem(new sap.m.ActionListItem({
            text: sap.app.i18n.getText("REMOVE_POLYGON"),
            press: function() {
                oController.removePolygon(oController);
            }
        }));

        view.oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("SALES_REGION_DATA")
        }));

        view.bpHeader = new sap.m.ObjectListItem({
            title: sap.app.i18n.getText("TOTAL_SALES"),
            number: "",
            numberUnit: "EUR",
            attributes: [],
        });
        view.oList.addItem(view.bpHeader);

        // sales chart
        view.oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("SALES_CHART_TITLE")
        }));

        view.oSalesChart = new sap.makit.Chart({
            type: sap.makit.ChartType.Column,
            width: "100%",
            height: "175px",
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
            value: "{year}"
        }));
        view.oSalesChart.addColumn(new sap.makit.Column({
            name: "AMOUNT",
            value: "{salesAmount}"
        }));

        view.oList.addItem(new sap.m.CustomListItem({
            content: [view.oSalesChart]
        }));

        // top customer details
        view.oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("TOP_5_BP")
        }));

        // add 5 customer list item
        view.oCustomerItems = [];

        for (var j = 0; j < 5; j++) {
            var item = new sap.m.ObjectListItem({
                title: "",
                number: "",
                numberUnit: "EUR",
                attributes: [],
            });
            item.attr = new sap.m.ObjectAttribute();
            item.addAttribute(item.attr);
            view.oList.addItem(item);
            view.oCustomerItems.push(item);
        }

        oSplitterV.addSecondPaneContent(view.oList);

        return oSplitterV;
    }
});