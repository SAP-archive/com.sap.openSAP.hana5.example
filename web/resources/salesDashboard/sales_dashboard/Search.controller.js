

sap.ui.controller("sales_dashboard.Search", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
//   onInit: function() {
//
//   },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//   onBeforeRendering: function() {
//
//   },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
//   onAfterRendering: function() {
//
//   },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//   onExit: function() {
//
//   }

	
	setFilter: function(attribute)
	{
	    //filterTerms = terms;
		var arr, grp;
		arr = new Array();
		
		grp = new Array();
		
		
		for(var i = 0;i<attribute.length; i++){
			
		var mySplitResults = attribute[i].split(' | ' + sap.app.i18n.getText("ATTRIBUTE") + ' ');
	    gFilterTerms = mySplitResults[0];
	    gFilterAttribute = mySplitResults[1];

	    if(gFilterTerms=="*") this.emptyFilter();
	    
	    

	    //Change from the Display Attribute Names to the property names in the ODATA service
	    switch(gFilterAttribute)
	    {
	    case 'Company Name': case 'Firmenname':
	    	gFilterAttribute='Buyer/COMPANYNAME';
	    	break;
 	
	    case 'City': case 'Stadt':
	        gFilterAttribute='Buyer/CITY';
	        break;
	          	
	    }
	    
	    
	    jQuery.sap.require("sap.ui.model.Filter");
	    jQuery.sap.require("sap.ui.model.FilterOperator");
	    var aflt1 = new sap.ui.model.Filter(escape(gFilterAttribute),sap.ui.model.FilterOperator.EQ,gFilterTerms);	

	   	arr.push(aflt1);
	   	
	   	grp.push(gFilterTerms);
		}
		
		
		
		var fltr = new sap.ui.model.Filter(arr, false);
		
 
		//Build OData Service Sorter by SO ID, and Item
	    var sort1 = new sap.ui.model.Sorter("Buyer/COMPANYNAME", true);
	        
	    /*var sort1 = new sap.ui.model.Sorter("Buyer/COMPANYNAME", null, true);    
	    sort1.fnCompare = function(a, b) {  
            if (a < b) return -1;  
            if (a == b) return 0;  
            if (a > b) return  1;  
        };*/  
	        
        oTable = sap.ui.getCore().byId("soTable");
        oTable.bindRows({
            path: "/SalesOrderHeader",
            parameters: {
                expand: "Buyer"
            },
            sorter: sort1,
            filters: [fltr]
        });
	     
	    
	  
	     
	    //Set the Number of Rows in table header and clear the table lead selection
    	var iNumberOfRows = oTable.getBinding("rows").iLength;
    	oTable.setTitle(sap.app.i18n.getText("SALES_ORDER_HEADERS",[this.numericSimpleFormatter(iNumberOfRows)]));    

		var oTableItem = sap.ui.getCore().byId("soItemTable");
		var ContextItem = "/SalesOrderHeader(SALESORDERID='JUNK')/SalesOrderItem";
		
		oTableItem.bindRows(ContextItem);
		
		var columns = oTableItem.getColumns();
	     var length = columns.length;
	     for (var m = 0; m < length; m++) {
	    	 columns[m].setFilterValue('');
	    	 columns[m].setFiltered(false);
	     }
	},
	


        	
	loadFilter: function(oEvent)
	{
		
	    gSearchParam = oEvent.getParameter("value");
	    if(gSearchParam=="*" || gSearchParam==""){
	    	sap.ui.controller("sales_dashboard.Search").emptyFilter();
	    }
	    else{
		    var aUrl = '/sap/hana/democontent/epm/services/soWorklistQuery.xsjs?cmd=filter'+'&query='+escape(oEvent.getParameter("value"))+'&page=1&start=0&limit=25';
		    jQuery.ajax({
		       url: aUrl,
		       method: 'GET',
		       dataType: 'json',
		       success: onLoadFilter,
		       error: onErrorCall });
	    }

	},
	
	numericSimpleFormatter: function(val){
		   if(val==undefined){ return '0';}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 0,
		      minFractionDigits: 0,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	},
	
	
	emptyFilter: function()
	{
	    gFilterTerms ="";
	    gFilterAttribute ="";
	    
	    oTable = sap.ui.getCore().byId("soTable");
	    var sort1 = new sap.ui.model.Sorter("SALESORDERID", true);
 	     oTable.bindRows({	
   	    path: "/SalesOrderHeader",
   	    parameters: {expand: "Buyer"} ,
   	   sorter: sort1
     	});
 	     
     	var iNumberOfRows = oTable.getBinding("rows").iLength;
    	oTable.setTitle(sap.app.i18n.getText("SALES_ORDER_HEADERS",[this.numericSimpleFormatter(iNumberOfRows)]));
    	
	    //Set the Number of Rows in table header and clear the table lead selection
    	var iNumberOfRows = oTable.getBinding("rows").iLength;
    	oTable.setTitle(sap.app.i18n.getText("SALES_ORDER_HEADERS",[this.numericSimpleFormatter(iNumberOfRows)]));    

		var oTableItem = sap.ui.getCore().byId("soItemTable");
		var ContextItem = "/SalesOrderHeader(SALESORDERID='JUNK')/SalesOrderItem";
		
		oTableItem.bindRows(ContextItem);
		
		var columns = oTableItem.getColumns();
	     var length = columns.length;
	     for (var i = 0; i < length; i++) {
	    	 columns[i].setFilterValue('');
	    	 columns[i].setFiltered(false);
	     }
     }
        	




        	
});

function onLoadFilter(myJSON){

	  var aSuggestions = [];
	  
	  for( var i = 0; i<myJSON.length; i++)
	     {
	       aSuggestions[i] = myJSON[i].terms + ' | ' + sap.app.i18n.getText("ATTRIBUTE") + ' ' + myJSON[i].attribute;
	     } 

	  

	  sap.ui.controller("sales_dashboard.Search").setFilter(aSuggestions);
	}



function onErrorCall(jqXHR, textStatus, errorThrown){
	 sap.ui.commons.MessageBox.show(jqXHR.responseText, 
			 "ERROR",
			 sap.app.i18n.getText("ERROR_ACTION") );	
	return;
       	
	}

