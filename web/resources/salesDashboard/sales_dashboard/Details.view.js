sap.ui.jsview("sales_dashboard.Details", {

	getControllerName : function() {
		return "sales_dashboard.Details";
	},

	createContent : function(oController) {
		//code for the search view which does the fuzzy search
		  sap.ui.localResources("sales_dashboard");
		  var oSearchView = sap.ui.view({id:"so_search_view", viewName:"sales_dashboard.Search", type:sap.ui.core.mvc.ViewType.JS});		
	
		  
	  var oLayout = new sap.ui.commons.layout.MatrixLayout({width:"100%"});
	  oLayout.createRow(oSearchView);
	  
  	  var oModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesOrders.xsodata/", true);
  	  oModel.attachRequestCompleted(function () {
    	oController.onBindingChange(oController);
      });
  	
	  var arrayHeaders = new Array();
      var oControl;
      this.oSHTable = new sap.ui.table.Table("soTable",{tableId: "soHeader",
               visibleRowCount: 10,
               rowSelectionChange: oController.onRowSelect,
               selectionMode: sap.ui.table.SelectionMode.Single,
               navigationMode: sap.ui.table.NavigationMode.Paginator });
      oTable = this.oSHTable;
      oTable.setTitle(oBundle.getText("SALES_ORDER_HEADERS"));
         
     //Table Column Definitions
      oControl = new sap.ui.commons.TextField().bindProperty("value","SALESORDERID");
      oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("SALES_ORDER_ID")}), template: oControl, sortProperty: "SALESORDERID", filterProperty: "SALESORDERID", filterOperator: sap.ui.model.FilterOperator.EQ, flexible: true, width: "125px" }));
 

      oControl = new sap.ui.commons.TextField().bindProperty("value","PARTNER.PARTNERID");
      oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("PARTNER_ID")}), template: oControl, sortProperty: "PARTNER.PARTNERID", filterProperty: "PARTNER.PARTNERID", width: "125px" }));
      
      oControl = new sap.ui.commons.TextView().bindProperty("text","Buyer/COMPANYNAME");
      oTable.addColumn(new sap.ui.table.Column({
    	  label:new sap.ui.commons.Label({text: oBundle.getText("COMPANY")}), 
    	  template: oControl, 
    	  sortProperty: "Buyer/COMPANYNAME", 
    	  filterProperty: "Buyer/COMPANYNAME", 
    	  filterOperator: sap.ui.model.FilterOperator.Contains, 
    	  width: "125px" }));
     
      oControl = new sap.ui.commons.TextView().bindProperty("text","Buyer/CITY");
      oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("CITY")}), template: oControl, sortProperty: "Buyer/CITY", filterProperty: "Buyer/CITY", filterOperator: sap.ui.model.FilterOperator.Contains, width: "125px" }));

      oControl = new sap.ui.commons.TextView().bindText("GROSSAMOUNT",numericFormatter); 
      oControl.setTextAlign("End");
      oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("GROSS_AMOUNT")}), template: oControl, sortProperty: "GROSSAMOUNT", filterProperty: "GROSSAMOUNT", hAlign: sap.ui.commons.layout.HAlign.End, width: "125px"}));

      oControl = new sap.ui.commons.TextField().bindProperty("value","CURRENCY");
      oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("CURRENCY")}), template: oControl, sortProperty: "CURRENCY", filterProperty: "CURRENCY", width: "125px" }));
   
      
     oTable.setModel(oModel);
     var sort1 = new sap.ui.model.Sorter("SALESORDERID", true);
     
     oTable.bindRows({
    	    path: "/SalesOrderHeader",
    	    parameters: {expand: "Buyer",
    	    	         select: "SALESORDERID,CURRENCY,GROSSAMOUNT,TAXAMOUNT,PARTNER.PARTNERID,Buyer/COMPANYNAME,Buyer/CITY"},
    	    sorter: sort1
    	});
	 
	 var iNumberOfRows = oTable.getBinding("rows").iLength;
	 oTable.setTitle("Sales Orders" + " (" + numericSimpleFormatter(iNumberOfRows) + ")" );
	 oLayout.createRow(oTable);
	  
	 
	// Toolbar
	    var oToolbar1 = new sap.ui.commons.Toolbar("tb1");
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);

		var oButton1 = new sap.ui.commons.Button("btnNew",{
			text : sap.app.i18n.getText("NEW"),
			tooltip : sap.app.i18n.getText("CREATE_LONG"),
			press : function(oEvent){
	      	  oController.onNewPress(oEvent); } 
		});
		oToolbar1.addItem(oButton1);
		
		oButton1 = new sap.ui.commons.Button("btnRefresh",{
			text : sap.app.i18n.getText("REFRESH"),
			tooltip : sap.app.i18n.getText("REFRESH"),
			press : function(oEvent){
	      	  oController.onRefresh(oEvent); } 
		});
		oToolbar1.addItem(oButton1);
		
		oButton1 = new sap.ui.commons.Button("btnDelete",{
			text : sap.app.i18n.getText("DELETE"),
			tooltip : sap.app.i18n.getText("DELETE_LONG"),
			press : function(oEvent){
	      	  oController.onDeletePress(oEvent); } 
		});
		oToolbar1.addItem(oButton1);
		
		var sendButton = new sap.ui.commons.Button("btnSend",{
            text: sap.app.i18n.getText("SEND"),
            tooltip: sap.app.i18n.getText("SEND_LONG"),
            press: [oController.onSend,oController]
        });
         oToolbar1.addItem(sendButton);
         
     var helpBtn = new sap.ui.commons.Button({
         text: '?',
         press: function() {
         	var tileDialog = new sap.account.TileDialog(this);
         	tileDialog.open(8);	
         }
     });
     helpBtn.addStyleClass('helpButton');
     oToolbar1.addItem(helpBtn);
		
	 oTable.setToolbar(oToolbar1);
		
	 
	/*//Work around a limitation in SAPUI5 where numeric values for string fields couldn't be sent in the filter as string
	    var orig_createFilterParams = sap.ui.model.odata.ODataListBinding.prototype.createFilterParams;
    sap.ui.model.odata.ODataListBinding.prototype.createFilterParams = function(aFilters) {
        orig_createFilterParams.apply(this, arguments);
        
        if (aFilters) {
            // old filterparam of overridden function           
        
            // adapt or modify the internal sFilterParams
        	if(aFilters[0]==null){ }
        	else {
        		this.sFilterParams = "$filter=((" + aFilters[0].sPath + " eq '" + aFilters[0].oValue1 + "'))"; }
            
            // new filterparam
            // see also Filter.js for the properties of the filter: sPath, sOperator, OValue1, oValue2
        }
    }*/
    
    
    //Sales Items
	var oModelItem = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/salesOrders.xsodata/", true);
 	var arrayHeaders = new Array();
    var oControl;
    this.oSITable = new sap.ui.table.Table("soItemTable",{tableId: "soItems",
             visibleRowCount: 10,
             selectionMode: sap.ui.table.SelectionMode.None });
    oTable = this.oSITable;
    oTable.setTitle(oBundle.getText("SALES_ORDER_ITEMS"));
    
    oControl = new sap.ui.commons.TextField().bindProperty("value","SALESORDERITEM");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("SALES_ORDER_ITEM_ID")}), template: oControl, sortProperty: "SALESORDERITEM", filterProperty: "SALESORDERITEM", width: "100px" }));
    
    //Product Id
    oControl = new sap.ui.commons.TextField().bindProperty("value","PRODUCTID");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("PRODUCT")}), template: oControl, sortProperty: "PRODUCTID", filterProperty: "PRODUCTID", width: "100px" }));
    oTable.setModel(oModelItem);
    
    //Product Description
    oControl = new sap.ui.commons.TextField().bindProperty("value","PRODUCT_NAME");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("PRODUCT_NAME")}), template: oControl, sortProperty: "PRODUCT_NAME", filterProperty: "PRODUCT_NAME", width: "250px" }));
    oTable.setModel(oModelItem);
    
    //Quantity
    oControl = new sap.ui.commons.TextView().bindText("QUANTITY",numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("QUANTITY")}), template: oControl, sortProperty: "QUANTITY", filterProperty: "QUANTITY", hAlign: sap.ui.commons.layout.HAlign.End, width: "100px"}));

    //Quantity Unit	
    oControl = new sap.ui.commons.TextField().bindProperty("value","QUANTITYUNIT");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("QUANTITY_UNIT")}), template: oControl, sortProperty: "QUANTITYUNIT", filterProperty: "QUANTITYUNIT", width: "80px" }));
    oTable.setModel(oModelItem);
    
    //Gross Amount
    oControl = new sap.ui.commons.TextView().bindText("NETAMOUNT",numericFormatter);
    oControl.setTextAlign("End");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("NET_AMOUNT")}), template: oControl, sortProperty: "NETAMOUNT", filterProperty: "NETAMOUNT", hAlign: sap.ui.commons.layout.HAlign.End, width: "100px"}));

    //Currency
    oControl = new sap.ui.commons.TextField().bindProperty("value","CURRENCY");
    oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("CURRENCY")}), template: oControl, sortProperty: "CURRENCY", filterProperty: "CURRENCY", width: "100px" }));
    oTable.setModel(oModelItem);
    
    oLayout.createRow(oTable);
    return oLayout;
    
	},
	
	lineItemCount: function(oController) {
		  arguments.callee.myStaticVar = arguments.callee.myStaticVar || 1;
		  arguments.callee.myStaticVar++;
		  return arguments.callee.myStaticVar;
		},	
	
	
createNewDialogContent: function(oController) {
		var that = this;
		
		var min = that.lineItemCount(oController);
		

		// create a simple matrix layout
		this.oLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false
			});
		
	
	this.submitButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("CREATE"),
		style: sap.ui.commons.ButtonStyle.Accept,
		press : function() {
			var max = that.lineItemCount(oController);
			oController.onSubmit(min, max);
		}
	});
	
	this.addLineItemButton = new sap.ui.commons.Button({
		text : sap.app.i18n.getText("ADD_LINE_ITEM"),
		style: sap.ui.commons.ButtonStyle.Accept,
		press : function() {
			that.createNewLineItemContent(oController);
		}
	});
	
	this.oLayout.createRow(this.submitButton);
	
	this.oComboBoxBp = new sap.ui.commons.ComboBox({
		displaySecondaryValues: true,
		width: '300px',
		change: function(oEvent){
			    
			}

	});
	
	this.oComboBoxBp.setModel(new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/businessPartners.xsodata", 
			true));
	
	var oItemTemplateBp = new sap.ui.core.ListItem();
	oItemTemplateBp.bindProperty("text", "COMPANYNAME");
	oItemTemplateBp.bindProperty("additionalText", { parts: [
      {path: "PARTNERID"}
      ],
      formatter: function(partnerid){ 
             return partnerid;
      }
	});
	
	var oDataTemplateBp = new sap.ui.core.CustomData({key:"PARTNERID",
		value: "{PARTNERID}"});
	oItemTemplateBp.addCustomData(oDataTemplateBp);
	
	var sortBp = new sap.ui.model.Sorter("COMPANYNAME");
	this.oComboBoxBp.bindItems({
	    path: "/BusinessPartners",
	    parameters: {select: "PARTNERID,COMPANYNAME"},
	    sorter: sortBp,
	    template: oItemTemplateBp
	} );
	
	var selectBpLbl = new sap.ui.commons.TextView({
		text: sap.app.i18n.getText("SELECT_BP")
	});
	
	this.oLayout.createRow(selectBpLbl, this.oComboBoxBp);
	that.createNewLineItemContent(oController);
						
		return this.oLayout;
	},
	
createNewLineItemContent: function(oController){
	
	var that = this;

	var lineitemindex = that.lineItemCount(oController);
	
	var oComboBoxPd = new sap.ui.commons.ComboBox({
				id: "productsel" + lineitemindex,
	            displaySecondaryValues: true,
	            width: '300px',
	            change: function(oEvent){
	                       
	                   }
			 });
	
	
	oComboBoxPd.setModel(new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/productDetails.xsodata", 
			true));

  var oItemTemplatePd = new sap.ui.core.ListItem();
  oItemTemplatePd.bindProperty("text", "PRODUCT_NAME");
  oItemTemplatePd.bindProperty("additionalText", { 
      parts: [ {path: "PRODUCT_PRICE", type: new sap.ui.model.type.Float({
                      minFractionDigits: 2,
                      maxFractionDigits: 2            
                  })},
               {path: "PRODUCT_CURRENCY"}
             ],
      formatter: function(price, currency){ 
             return price + " " + currency;
      }
  });

  var oDataTemplatePd1 = new sap.ui.core.CustomData({key:"PRODUCTID",
      value: "{PRODUCTID}"});
  oItemTemplatePd.addCustomData(oDataTemplatePd1);

  var oDataTemplatePd2 = new sap.ui.core.CustomData({key:"PRODUCT_CURRENCY",
      value:"{PRODUCT_CURRENCY}"});
  oItemTemplatePd.addCustomData(oDataTemplatePd2);

  var sortPd = new sap.ui.model.Sorter("PRODUCT_NAME");
  oComboBoxPd.bindItems({
			   path: "/ProductDetails",
			   parameters: {select: "PRODUCTID,PRODUCT_NAME,PRODUCT_PRICE,PRODUCT_CURRENCY"},
			   sorter: sortPd,
			   template: oItemTemplatePd
  });

  var selectProductLblPd = new sap.ui.commons.TextView({
      text: sap.app.i18n.getText("SELECT_PRODUCT")
  });

  // create a simple Input field
  var quantityInputPd = new sap.ui.commons.TextField({
	  id: "quantitysel" + lineitemindex,
      value: "1"
  });

  var quantityLbPd = new sap.ui.commons.TextView({
      text: sap.app.i18n.getText("ENTER_QUANTITY")
  });

  var addButtonPd = new sap.ui.commons.Button({
	  
	  id: "addlineitmbtn" + lineitemindex,
	  icon: "images/AddLineItem.gif",
	  iconHovered: "images/AddLineItemHover.gif",
	  iconSelected: "images/AddLineItemHover.gif",
	  tooltip: "Add Row",
	  width: "30px",
    press : function(oControlEvent) {
           
  	  	//oControlEvent.getSource().getId();

           if(sap.ui.getCore().byId(oControlEvent.getSource().getId()).getTooltip_AsString() == 'Add Row')
          	 {
          	 	sap.ui.getCore().byId(oControlEvent.getSource().getId()).setTooltip('Remove Row');
          	 	sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIcon("images/DeleteLineItem.gif");
          	 	sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIconHovered("images/DeleteLineItemHover.gif");
          	 	sap.ui.getCore().byId(oControlEvent.getSource().getId()).setIconSelected("images/DeleteLineItemHover.gif");
          	 	that.createNewLineItemContent(oController);
          	 }
           
           else if(sap.ui.getCore().byId(oControlEvent.getSource().getId()).getTooltip_AsString() == 'Remove Row'){
          	 that.oLayout.removeRow(jQuery.sap.domById(oControlEvent.getSource().getId()).parentElement.parentElement.id);
           }
    }

  });

  this.oLayout.createRow( selectProductLblPd, oComboBoxPd, quantityLbPd, quantityInputPd, addButtonPd);

}
	
});