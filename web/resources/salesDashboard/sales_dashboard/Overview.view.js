sap.ui.jsview("sales_dashboard.Overview", {

	getControllerName : function() {
		return "sales_dashboard.Overview";
	},

	createContent : function(oController) {
        var view = this;
		var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
		oLayout.setLayoutFixed(false);

		// All the data bindings for the below charts can be found in the overview.controller.js
		
		//Sales by Region Panel
		var salesByRegionPanel = new sap.ui.commons.Panel().setText(oBundle.getText("salesRegion"));
		salesByRegionPanel.setHeight("380px");
		salesByRegionPanel.setWidth("100%");
		
		// add the help button
		var regionHelpBtn = new sap.ui.commons.Button({
			text: '?',
			press: function() {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(1);	
			}
		});
		regionHelpBtn.addStyleClass('helpButton'); // shift it right
		salesByRegionPanel.addButton(regionHelpBtn);
		
		// add body for the panel
	    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	    salesByRegionPanel.addContent(layoutNew);
	    
	      // sales by region chart
        view.oSalesRegionPie = new sap.viz.ui5.Pie("saleRegionPie", {
            width: "100%",
            height: "320px",
            plotArea: {},
            title: {
                visible: false
            }
        });
        
        view.oSalesRegionPie.setToolTip(new sap.viz.ui5.types.Tooltip({ 
            formatString : [[tooltipFormatString]]
        }));
        
        layoutNew.createRow(view.oSalesRegionPie);

        //Sales by Country Panel
        var salesByCountryPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("SALES_BY_COUNTRY"));
        var layoutNew = new sap.ui.commons.layout.MatrixLayout({
            width: "100%"
        });
        salesByCountryPanel.addContent(layoutNew);
        salesByCountryPanel.setHeight("380px");
        salesByCountryPanel.setWidth("100%");

        // add help button
        var countryHelpBtn = new sap.ui.commons.Button({
            text: '?',
            press: function() {
                var tileDialog = new sap.account.TileDialog(this);
                tileDialog.open(2);
            }
        });
        countryHelpBtn.addStyleClass('helpButton');
        salesByCountryPanel.addButton(countryHelpBtn);

        view.oSalesCountryBarChart = new sap.viz.ui5.Column({
            width: "100%",
            height: "320px",
            title: {
                visible: false
            },
            yAxis: {
                label: {
                    formatString: "u"
                }
            }
        });
        
        view.oSalesCountryBarChart.setToolTip(new sap.viz.ui5.types.Tooltip({ 
            formatString : [[tooltipFormatString]]
        }));

        var xAxis = view.oSalesCountryBarChart.getXAxis();
        var yAxis = view.oSalesCountryBarChart.getYAxis();

        xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible: true,
            text: sap.app.i18n.getText("COUNTRY_CODES")
        }));

        yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible: true,
            text: sap.app.i18n.getText("SALES_IN_EUR")
        }));
        yAxis.getLabel().setUnitFormatType(sap.viz.ui5.types.Axis_label_unitFormatType.FinancialUnits);

        view.oSalesCountryBarChart.getLegend().setVisible(false);

        layoutNew.createRow(view.oSalesCountryBarChart);

        //Sales Rank Panel
        var salesRankPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("SALES_RANK"));
        var layoutNew = new sap.ui.commons.layout.MatrixLayout({
            width: "100%"
        });
        salesRankPanel.addContent(layoutNew);
        salesRankPanel.setHeight("420px");
        salesRankPanel.setWidth("100%");

        // add help button
        var rankHelpBtn = new sap.ui.commons.Button({
            text: '?',
            press: function() {
                var tileDialog = new sap.account.TileDialog(this);
                tileDialog.open(3);
            }
        });
        rankHelpBtn.addStyleClass('helpButton');
        salesRankPanel.addButton(rankHelpBtn);

        view.oSalesRankBubble = new sap.viz.ui5.Bubble({
            width: "100%",
            height: "320px",
            title: {
                visible: false
            },
            xAxis: {
                label: {
                    formatString: "u"
                }
            }
        });

        view.oSalesRankBubble.setToolTip(new sap.viz.ui5.types.Tooltip({ 
            formatString : [[tooltipFormatString]]
        }));
        
        xAxis = view.oSalesRankBubble.getXAxis();
        yAxis = view.oSalesRankBubble.getYAxis();

        xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible: true,
            text: sap.app.i18n.getText("TOTAL_SALES_IN_EUR")
        }));

        yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
            visible: true,
            text: sap.app.i18n.getText("SALES_RANK")
        }));

        layoutNew.createRow(view.oSalesRankBubble);

        var oVerticalLayout = new sap.ui.commons.layout.VerticalLayout({
            width: '100%'
        });

        var textView = new sap.ui.commons.TextView({
            text: sap.app.i18n.getText("SELECT_REGION"),
            width: '100px',
            design: sap.ui.commons.TextViewDesign.Bold
        });

        var view = this;

        this.dropDown = new sap.ui.commons.DropdownBox({
            change: function(oControlEvent) {
                oController.onFilterChange(oControlEvent.getParameters().newValue, view);
            }
        });

        var oHorLayout = new sap.ui.commons.layout.HorizontalLayout({
            width: '100%'
        });

        oHorLayout.addContent(textView);
        oHorLayout.addContent(this.dropDown);

        var oItemTemplate1 = new sap.ui.core.ListItem();
        oItemTemplate1.bindProperty("text", "region");
        oItemTemplate1.bindProperty("key", "key");
        this.dropDown.bindItems("/", oItemTemplate1);

        this.oDiscountChart = new sap.viz.ui5.Pie({
            width: "100%",
            height: "320px",
            plotArea: {
                //'colorPalette' : d3.scale.category20().range()
            },
            title: {
                visible: true,
                text: sap.app.i18n.getText("DISCOUNT_PER_REGION_TITLE")
            }
        });

        view.oDiscountChart.setToolTip(new sap.viz.ui5.types.Tooltip({ 
            formatString : [[tooltipFormatString]]
        }));

        oVerticalLayout.addContent(oHorLayout);
        oVerticalLayout.addContent(this.oDiscountChart);

        // Sales Discount Panel
        var salesDiscountPanel = new sap.ui.commons.Panel().setText(sap.app.i18n.getText("DISCOUNT_PER_REGION_TITLE"));
        salesDiscountPanel.addContent(oVerticalLayout);
        salesDiscountPanel.setHeight("420px");
        salesDiscountPanel.setWidth("100%");

        var discountHelpBtn = new sap.ui.commons.Button({
            text: '?',
            press: function() {
                var tileDialog = new sap.account.TileDialog(this);
                tileDialog.open(4);
            }
        });
        discountHelpBtn.addStyleClass('helpButton');
        salesDiscountPanel.addButton(discountHelpBtn);

        // add sales by region graph to layout
        var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell();
        oCell1.setVAlign(sap.ui.commons.layout.VAlign.Top);
        oCell1.addContent(salesByRegionPanel);

        // add sales by country graph to layout
        var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell();
        oCell2.setVAlign(sap.ui.commons.layout.VAlign.Top);
        oCell2.addContent(salesByCountryPanel);
        oLayout.createRow(oCell1, oCell2);

        // add sales discount graph to layout
        var oCell4 = new sap.ui.commons.layout.MatrixLayoutCell();
        oCell4.setVAlign(sap.ui.commons.layout.VAlign.Top);
        oCell4.addContent(salesDiscountPanel);

        // add sales rank graph to layout
        var oCell3 = new sap.ui.commons.layout.MatrixLayoutCell();
        oCell3.setVAlign(sap.ui.commons.layout.VAlign.Top);
        oCell3.addContent(salesRankPanel);
        oLayout.createRow(oCell4, oCell3);

        return oLayout;
	}
});