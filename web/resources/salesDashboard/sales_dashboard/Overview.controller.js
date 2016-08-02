sap.ui.controller("sales_dashboard.Overview", {

	onInit: function() {
        var view = this.getView();

        // Data bindings
        // Discount by region chart
        var oRegionModel = new sap.ui.model.json.JSONModel();
        oRegionModel.setData(
            [{
                region: "AMER",
                key: "AMER"
            }, {
                region: "AFR",
                key: "AFR"
            }, {
                region: "APJ",
                key: "APJ"
            }, {
                region: "EMEA",
                key: "EMEA"
            }, ]);
        view.dropDown.setModel(oRegionModel);

        var oDiscountModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesDiscount.xsodata/");

        var filterParam = '';
        if (view.dropDown.getSelectedKey() === '') {
            filterParam = 'AMER';
        } else {
            filterParam = view.dropDown.getSelectedKey();
        }

        this.onFilterChange(filterParam, view);
        view.oDiscountChart.setModel(oDiscountModel);

        // --------------------------------------
        // Sales By Region Pie Chart Data model
        var oSalesRegionModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesByRegion.xsodata", true);
        var sort1 = new sap.ui.model.Sorter("TOTAL_SALES");

        var regionDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                axis: 1,
                name: sap.app.i18n.getText("REGION"),
                value: "{REGION}"
            }],
            measures: [{
                name: sap.app.i18n.getText("TOTAL_SALES"),
                value: '{TOTAL_SALES}'
            }]
        });
        regionDataset.bindData("/SalesByRegion", sort1);
        view.oSalesRegionPie.setDataset(regionDataset);
        view.oSalesRegionPie.setModel(oSalesRegionModel);

        // --------------------------------------
        // Sales by country bar chart model
        var oSalesCountryModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesByCountry.xsodata/", true);

        var countryDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                axis: 1,
                name: sap.app.i18n.getText("COUNTRY"),
                value: "{COUNTRY}"
            }],
            measures: [{
                name: sap.app.i18n.getText("TOTAL_SALES"),
                value: '{TOTAL_SALES}'
            }]
        });
        countryDataset.bindData("/SalesByCountry", sort1);
        view.oSalesCountryBarChart.setDataset(countryDataset);
        view.oSalesCountryBarChart.setModel(oSalesCountryModel);

        // --------------------------------------
        // Sales rank bubble chart
        var oSalesRankModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesSalesRank.xsodata/", true);
        sort1 = new sap.ui.model.Sorter("SALES");

        var salesRankDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                axis: 1,
                name: sap.app.i18n.getText("COMPANY_NAME"),
                value: "{COMPANY_NAME}"
            }],

            measures: [{
                group: 1,
                name: sap.app.i18n.getText("TOTAL_SALES"),
                value: '{SALES}'
            }, {
                group: 2,
                name: sap.app.i18n.getText("SALES_RANK"),
                value: '{SALES_RANK}'
            }, {
                group: 3,
                name: sap.app.i18n.getText("NUMBER_OF_ORDERS"),
                value: '{ORDERS}'
            }]
        });
        salesRankDataset.bindData("/salesRank", sort1);
        view.oSalesRankBubble.setDataset(salesRankDataset);
        view.oSalesRankBubble.setModel(oSalesRankModel);
    },

    /** 
     * Method is called whenever the user changes the selection in the drop down for Discount by region.
     */
    onFilterChange: function(aFilter, view) {
        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [{
                axis: 1, // must be one for the x-axis, 2 for y-axis
                name: 'Company',
                value: "{COMPANY_NAME}"
            }],
            measures: [
                // measure 1
                {
                    name: 'Discount %', // 'name' is used as label in the Legend 
                    value: '{DISCOUNT}' // 'value' defines the binding for the displayed value   
                }
            ],


        });

        oDataset.bindData({
            path: "/InputParams(IP_EMEA='EMEA',IP_AMER='AMER',IP_APJ='APJ',IP_AFR='AFR')/Results",
            filters: [new sap.ui.model.odata.Filter("REGION", [{
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: aFilter
                }]),
                new sap.ui.model.odata.Filter("DISCOUNT", [{
                    operator: sap.ui.model.FilterOperator.GT,
                    value1: 0
                }])
            ]
        });

        view.oDiscountChart.setDataset(oDataset);
    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf shine-so.overview
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf shine-so.overview
     */
    //onAfterRendering: function() {
    //
    //	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf shine-so.overview
     */
    //	onExit: function() {
    //
    //	}
});

