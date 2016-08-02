sap.ui.jsview("spatial-demo.bpDetails", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf shine-so.main
     */
    getControllerName: function() {
        return "spatial-demo.bpDetails";
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

        var oList = new sap.m.List({
            width: '100%'
        });
        oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("SALES_DATA")
        }));

        view.bpId = new sap.m.ObjectAttribute({});
        view.bpPhone = new sap.m.ObjectStatus({
            state: sap.ui.core.ValueState.None
        });
        view.bpEmail = new sap.m.ObjectStatus({
            state: sap.ui.core.ValueState.None
        });
        view.bpWeb = new sap.m.ObjectAttribute({
            active: true,
            press: function() {
                sap.m.URLHelper.redirect(this.getText(), true);
            }
        });

        view.bpHeader = new sap.m.ObjectListItem({
            title: "",
            number: "",
            numberUnit: "",
            attributes: [
                view.bpId,
                view.bpWeb
            ],
            firstStatus: view.bpEmail,
            secondStatus: view.bpPhone
        });
        oList.addItem(view.bpHeader);

        // sales chart
        oList.addItem(new sap.m.GroupHeaderListItem({
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
            value: "{amount}"
        }));

        oList.addItem(new sap.m.CustomListItem({
            content: [view.oSalesChart]
        }));

        // address details
        oList.addItem(new sap.m.GroupHeaderListItem({
            title: sap.app.i18n.getText("ADDRESS")
        }));

        // building
        view.bpBuildingItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("BUILDING"),
            value: ""
        });
        oList.addItem(view.bpBuildingItem);

        // street
        view.bpStreetItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("STREET"),
            value: ""
        });
        oList.addItem(view.bpStreetItem);

        // city
        view.bpCityItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("CITY"),
            value: ""
        });
        oList.addItem(view.bpCityItem);

        // country
        view.bpCountryItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("COUNTRY"),
            value: ""
        });
        oList.addItem(view.bpCountryItem);

        // zip
        view.bpZipItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("ZIP"),
            value: ""
        });
        oList.addItem(view.bpZipItem);
        
                //Distance from current location
        view.bpDistanceItem = new sap.m.DisplayListItem({
            label: sap.app.i18n.getText("DISTANCE"),
            value:""
        });
        oList.addItem(view.bpDistanceItem);

        oSplitterV.addSecondPaneContent(oList);

        return oSplitterV;
    }
});