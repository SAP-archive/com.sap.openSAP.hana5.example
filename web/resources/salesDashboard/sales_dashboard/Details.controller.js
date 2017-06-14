sap.ui.controller("sales_dashboard.Details", {
	onRowSelect: function(oEvent){
		var oView = sap.ui.getCore().byId("details_view"); 
		var data = oEvent.getSource().getModel();
		var oTable = oEvent.getSource();
		var soId = data.getProperty("SALESORDERID",oTable.getContextByIndex(oTable.getSelectedIndex()));
		
		var oTableItems = sap.ui.getCore().byId("soItemTable");
		var ContextItem = "/SalesOrderHeader(SALESORDERID='"+soId+"')/SalesOrderItem";
		var sort1 = new sap.ui.model.Sorter("SALESORDERID");
		oTableItems.bindRows(ContextItem,sort1);
	},
	
	onRefresh: function(oEvent) {
		var view = this.getView();
		// clear selection and filters
		view.oSHTable.clearSelection();
		var aCols = view.oSHTable.getColumns();
		if (aCols) {
			for (var i = aCols.length - 1; i >= 0; --i) {
				aCols[i].setFiltered(false);
				aCols[i].setFilterValue("");
			}
		}
		if (view.oSITable.isBound("rows")) {
			view.oSITable.unbindRows();
		}
		// clear filters
		aCols = view.oSITable.getColumns();
		if (aCols) {
			for (var i = aCols.length - 1; i >= 0; --i) {
				aCols[i].setFiltered(false);
				aCols[i].setFilterValue("");
			}
		}
		
		// bind with default value
	    var sort1 = new sap.ui.model.Sorter("SALESORDERID", true);
	    view.oSHTable.bindRows({
	 	    path: "/SalesOrderHeader",
		    parameters: {expand: "Buyer"},
		    sorter: sort1
		});
	    
	},
	
	
	onNewPress: function(oEvent) {
		var view = this.getView();
		this.newDialog = new sap.ui.commons.Dialog({modal: true});
		this.newDialog.setTitle(sap.app.i18n.getText("CREATE_LONG"));
		this.newDialog.addContent(view.createNewDialogContent(this));
		
		
		this.newDialog.open();
		
	},
	
	onDeletePress: function(oEvent) {
		 var oController = this;
		 var oTable = sap.ui.getCore().byId("soTable");
		 var data = oTable.getModel();
		 var soId = data.getProperty("SALESORDERID",oTable.getContextByIndex(oTable.getSelectedIndex()));
		 
		 if (soId && soId !== undefined) {

	            sap.ui.commons.MessageBox.confirm(sap.app.i18n.getText("CONFIRM_DELETE", [soId]),
						function(bResult) {
					oController.deleteConfirm(bResult, oController, soId);
				},
				sap.app.i18n.getText("TITLE_DELETE"));			

			} else {
			    
			    sap.ui.commons.MessageBox.show(sap.app.i18n.getText("ERROR_SELECT"), "ERROR", sap.app.i18n.getText("ERROR_SO_HEADER"));

			}
	},	
	 
	 //Delete Confirmation Dialog Results
	 deleteConfirm: function(bResult,oController,soId){
		 if(bResult){ 
			 var aUrl = "/sap/hana/democontent/epm/services/soDelete.xsodata/so_details('" + soId + "')";
			 jQuery.ajax({
			       url: aUrl,
			       type: 'DELETE',
			       dataType: 'text',
			       success: function(myTxt){
			          	  oController.onDeleteSuccess(myTxt,oController); },
			       error: oController.onErrorCall });
		 }
	 },
	 
	 //Delete Successful Event Handler
	 onDeleteSuccess: function(myTxt,oController){
		 oController.onRefresh();
		 sap.ui.commons.MessageBox.show(sap.app.i18n.getText("DELETE_SUCCESS"), 
				 "SUCCESS",
				 sap.app.i18n.getText("TITLE_DELETE_SUCCESS") );
	 },
	 
	 	 
	/* Called when binding of the model is modified.
	 *
	 */
	onBindingChange: function(oController) {
	    var view = oController.getView();
	    var iNumberOfRows = view.oSHTable.getBinding("rows").iLength;
	    view.oSHTable.setTitle("Sales Orders"  + " (" + this.numericSimpleFormatter(iNumberOfRows) + ")" );
	},
	
	onSubmit: function(min, max) {
		var view = this.getView();
		var oController = this;
		var items = new Array();
        var payload =  {};
        
        //validation for User Input
        if(view.oComboBoxBp._getExistingListBox().getSelectedItem() == null){
        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("FILL_ALL_LINE_ITEMS"), 
                    "ERROR",
                   sap.app.i18n.getText("TITLE_MISSING_DATA") );
        	return;

        	
        }


        
        var endindex = max;
        for (var beginindex = min + 1; beginindex < endindex; beginindex++){
        	if(jQuery.sap.domById('productsel' + beginindex + '-input') != null){
    		    if(sap.ui.getCore().byId('productsel' + beginindex)._getExistingListBox().getSelectedItem() == null){
    	        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("FILL_ALL_LINE_ITEMS"), 
    	                    "ERROR",
    	                   sap.app.i18n.getText("TITLE_MISSING_DATA") );
    	        	return;
    		    }
        	}
        }
        
        for (var beginindex = min + 1; beginindex < endindex; beginindex++){
        	if(jQuery.sap.domById('productsel' + beginindex + '-input') != null){
        		var Quantity = jQuery.sap.domById('quantitysel' + beginindex).value;
    		    if(Number(Quantity) <= 0 || isNaN(Number(Quantity)) || Number(Quantity) % 1 != 0  ) {
    	        	sap.ui.commons.MessageBox.show(sap.app.i18n.getText("TITLE_VALID_INTEGER"), 
    	                    "ERROR",
    	                   sap.app.i18n.getText("CHECK_VALID_INTEGER") );
    	        	return;
    		    }
        	}
        }

		//get the Business Partner ID
		payload.PARTNERID= view.oComboBoxBp._getExistingListBox().getSelectedItem().getCustomData()[0].getValue();
		
	 
        for (var beginindex1 = min + 1; beginindex1 < endindex; beginindex1++){
        	if(jQuery.sap.domById('productsel' + beginindex1 + '-input') != null){
        		items.push({Product_Id: sap.ui.getCore().byId('productsel' + beginindex1)._getExistingListBox().getSelectedItem().getCustomData()[0].getValue(),Quantity: jQuery.sap.domById('quantitysel' + beginindex1).value});
        	}
        }
		
	    
        payload.SalesOrderItems = items;
     // handle xsrf token
		// first obtain token using Fetch
		var xsrf_token;
		$.ajax({
			type: "GET",
			async: false,
			url: "/sap/hana/democontent/epm/services/soCreate.xsodata",
			contentType: "application/json",
			headers: {
				'x-csrf-token': 'Fetch'
			},
			success: function(data, textStatus, request) {
				xsrf_token = request.getResponseHeader('x-csrf-token');
			}
		});

		// add x-csrf-token in headers
		$.ajax({
			type: "POST",
			url: "/sap/hana/democontent/epm/services/soCreateMultiple.xsjs",
			headers: {
				'x-csrf-token': xsrf_token
			},
			contentType: "application/json",
			data: JSON.stringify(payload),
			dataType: "json",
			success: function(data) {

			},
			dataFilter: function(data) {
				oController.onRefresh();
				var oSalesOrderId = data.split('\n')[1].split(' ')[2];
				sap.ui.commons.MessageBox.show('Sales Order ' + oSalesOrderId + ' Created Successfully',
				                    "SUCCESS",
				                    sap.app.i18n.getText("SALES_ORDER_CREATED"));
			}

		});

	    this.newDialog.close();	    
	},

	/*** Numeric Formatter for Currencies ***/
	numericFormatter: function(val){
		   if(val==undefined){ return '0';}
		   else{
		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
		   var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
		      maxFractionDigits: 2,
		      minFractionDigits: 2,
		      groupingEnabled: true });
		   return oNumberFormat.format(val); }
		   
	},

	/*** Numeric Formatter for Quantities ***/
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
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sales-dashboard.details
*/
	onInit: function() {
		var view = this.getView();
		this.oSHTable = this.getView().oSHTable;
		this.deleteModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/soDelete.xsodata/", true);
			
	},
	
	onSend : function(){
	    var that = this;
	    var oTable = this.oSHTable;
	    var selectedIndex = oTable.getSelectedIndex();
	    if(selectedIndex!==-1){
	        $.ajax({
	            url : "/sap/hana/democontent/epm/services/mailSMTP.xsjs?cmd=checkSMTP",
	            success : jQuery.proxy(that.onSendSuccess,that),
	            error : that.onSendFailed
	        });
	   }else{
	       jQuery.sap.require("sap.ui.commons.MessageBox");
	        sap.ui.commons.MessageBox.show("Please Select a Sales Order to Send.",sap.ui.commons.MessageBox.Icon.WARNING,"Invalid Sales Order");
	   }
	},	    
	onSendSuccess : function(response){
	    var oTable = this.oSHTable;
	   var oSalesOrderId = oTable.getRows()[oTable.getSelectedIndex()].getBindingContext().getProperty('SALESORDERID');
	   
				function cell(oContent) {
					return new sap.ui.commons.layout.MatrixLayoutCell({
						content: oContent
					});
				}
				function validateEmail(email) { 
				    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				    return re.test(email);
				} 
				function handleLiveChange(oEvent){
					var _liveChange = oEvent.getParameter("liveValue");
					if(validateEmail(_liveChange))
						oButton.setEnabled(true);
					else
						oButton.setEnabled(false);
				}
				var oText = new sap.ui.commons.TextField({liveChange : handleLiveChange,required:true});
				var oLabel = new sap.ui.commons.Label({text:sap.app.i18n.getText("Email"),labelFor:oText});
				var oButton = new sap.ui.commons.Button({text: "Send",enabled:false, press:function(){
					var _email = oText.getValue();
					oDialog.close();
					$.ajax({
						url:'/sap/hana/democontent/epm/services/mailSMTP.xsjs?cmd=sendMail&email=' + _email + '&soid=' + oSalesOrderId,
						success : function(response){
							sap.ui.commons.MessageBox.show(sap.app.i18n.getText("EMAIL_SUCCESS_DESCRIPTION"),
				                    "SUCCESS",
				                    sap.app.i18n.getText("EMAIL_SUCCESS"));
						},
						error : function(response){
							sap.ui.commons.MessageBox.show(response.responseText,
				                    "Error",
				                    sap.app.i18n.getText("EMAIL_ERROR"));
						}
					});
				}});
				var oContent = new sap.ui.commons.layout.MatrixLayout({layoutFixed:false}).addStyleClass("sapUiMboxCont");                               
				oContent.createRow(cell(oLabel),cell(oText));   
	    var oDialog = new sap.ui.commons.Dialog({
					content : oContent,
					modal : true
				});
				oDialog.setTitle( sap.app.i18n.getText("SEND_LONG"));
				oDialog.addButton(oButton);
				oDialog.open();
	},
	
	onSendFailed : function(response){
	
		var sendFailedDialog = sap.ui.jsfragment("app.sendFailedDialog");
		sendFailedDialog.open();
	}	
});


