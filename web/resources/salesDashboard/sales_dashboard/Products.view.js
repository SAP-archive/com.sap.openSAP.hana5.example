sap.ui.jsview("sales_dashboard.Products", {

	getControllerName : function() {
		return "sales_dashboard.Products";
	},

	createContent : function(oController) {
		var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
		oLayout.setLayoutFixed(false);
		
		//Years Compare Panel
		var yearsComparePanel = new sap.ui.commons.Panel().setText(oBundle.getText("COMPARE_PRODUCT_CATEGORY_YEAR"));
		yearsComparePanel.setHeight("380px");
		yearsComparePanel.setWidth("100%");
		
		var compareHelpBtn = new sap.ui.commons.Button({
			text: '?',
			press: function() {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(5);	
			}
		});
		compareHelpBtn.addStyleClass('helpButton');
		yearsComparePanel.addButton(compareHelpBtn);
		
	    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	    yearsComparePanel.addContent(layoutNew);
	    var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesYearCompare.xsodata/", true);
  	    var sort1 = new sap.ui.model.Sorter("Product_Category");
  	    
  	    var currentYear =  new Date().getFullYear();
  	    var previousYear = new Date().getFullYear() - 1;
  	    var dataset = new sap.viz.ui5.data.FlattenedDataset({	  	    
        dimensions : [ { axis : 1, 
                         name : oBundle.getText("productCategory"), 
                         value : "{PRODUCT_CATEGORY}" } ],
        measures : [ 
                { name : oBundle.getText("salesY1",[previousYear]), 
                  value : '{YEAR1_NET_AMOUNT}' }, 
                  { name : oBundle.getText("salesY1",[currentYear]), 
                      value : '{YEAR2_NET_AMOUNT}' },                 
                ]       });
  	      dataset.setModel(oModel);
  	      

  	      var bindString = "/InputParams(IP_YEAR_1='"+
  	      					previousYear +
  	      					"',IP_YEAR_2='" +
  	      				    currentYear +
  	      				    "')/Results";
  	    	   
	      dataset.bindData(bindString,sort1);  

     var oYearsCompareBarChart = new sap.viz.ui5.Column({
     width : "100%",
     height : "320px",
     title : {
             visible : false
     },
     dataset : dataset
     });
     layoutNew.createRow(oYearsCompareBarChart);  
     
     
     	//Product Sales Details
		var productSalesPanel = new sap.ui.commons.Panel().setText(oBundle.getText("PRODUCT_SALES"));
		productSalesPanel.setHeight("440px");
		productSalesPanel.setWidth("100%");
		
		var productsHelpBtn = new sap.ui.commons.Button({
			text: '?',
			press: function() {
				var tileDialog = new sap.account.TileDialog(this);
				tileDialog.open(6);	
			}
		});
		productsHelpBtn.addStyleClass('helpButton');
		productSalesPanel.addButton(productsHelpBtn);
		
		
	    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	    productSalesPanel.addContent(layoutNew);
	    
	    var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesByProduct.xsodata/", true);
  	    var sort1 = new sap.ui.model.Sorter("TOTAL_SALES");
  	    
  	    var dataset = new sap.viz.ui5.data.FlattenedDataset({

         dimensions : [ {
           axis : 1,
           name : oBundle.getText("PRODUCT"),
           value : "{PRODUCT_NAME}"
         }
         ],

         measures : [ {
           group : 1,
           name : oBundle.getText("SALES"),
           value : '{SALES}'
         }, /*{
           group : 2,
           name : oBundle.getText("sales"),
           value : '{TOTAL_SALES}'
         },*/ {
           group : 2,
           name : oBundle.getText("SALES_SHARE"),
           value : '{SHARE_SALES}'
         } ]
       });
	      dataset.setModel(oModel);
	      dataset.bindData("/SalesByProduct",sort1); 
      
       var oSalesRankBubble = new sap.viz.ui5.Scatter({
         width : "100%",
         height : "380px",
         title : {
           visible : false
         },
         dataset : dataset
       });
	     layoutNew.createRow(oSalesRankBubble); 
	     
	     xAxis = oSalesRankBubble.getXAxis();
	        yAxis = oSalesRankBubble.getYAxis();

	        xAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	            visible : true,
	            text : sap.app.i18n.getText("SALES_IN_EUR")
	        }));

	        yAxis.setTitle(new sap.viz.ui5.types.Axis_title({
	            visible : true,
	            text : sap.app.i18n.getText("SALES_SHARE")
	        }));

	        oSalesRankBubble.getLegend().setIsScrollable(true); 
	        
	        layoutNew.createRow(oSalesRankBubble);
	        
     
     oLayout.createRow(yearsComparePanel);
     oLayout.createRow(productSalesPanel)
     return oLayout;
     
	}
});