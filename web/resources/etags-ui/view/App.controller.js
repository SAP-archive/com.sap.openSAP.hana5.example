jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("shine.usercrud.etagsdemo.util.utility");
jQuery.sap.require("shine.usercrud.etagsdemo.app.tileDialog");

sap.ui.controller("shine.usercrud.etagsdemo.view.App", {


    handlePressHome: function(oEvent) {

        sap.m.URLHelper.redirect("/launchpad/", false);

    },
    
    handleInfoHelp: function(oEvent){
    	
   	 var i18n = this.getView().getModel("i18n");
        var oHelpDialog = new HelpDialog();
        var oSourceId = oEvent.getSource().getId();
        oHelpDialog.addContent(oSourceId.split("--")[1], i18n);
      
        var dialog = new sap.m.Dialog({
            title: i18n.getProperty('INFOHELP_' + oSourceId.split("--")[1].toUpperCase() + '_TITLE'),
            type: 'Message',
              content: oHelpDialog.oSimpleForm,
            beginButton: new sap.m.Button({
              text: 'OK',
              press: function () {
                dialog.close();
              }
            }),
            afterClose: function() {
              dialog.destroy();
            }
          });

          dialog.open();
        
   },
    
    //create the user
    createUser: function(oEvent){
        // handle xsrf token
        // first obtain token using Fetch
    	var oModel;
    	var oEntry ={};
        var i18n = this.getView().getModel("i18n");
    	oEntry.FirstName = sap.ui.getCore().byId('idDgFirstName').getValue();
        oEntry.LastName = sap.ui.getCore().byId('idDgLastName').getValue();
        oEntry.Email = sap.ui.getCore().byId('idDgEMail').getValue();
        oEntry.ZMYNEW1 = "";
        if(oEntry.LastName === ""){
        	oEntry.LastName = null;
        }
        if(oEntry.Email === ""){
        	oEntry.Email = null;
        }
        oModel = this.getView().getModel();
    	
        var xsrf_token;
        $.ajax({
            type: "GET",
            async: false,
            url: "/user/xsjs/eTagsServices.xsjs",
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
            type: "GET",
            url: "/user/xsjs/eTagsServices.xsjs",
            async: false,
            headers: {
                'x-csrf-token': xsrf_token
            },
            contentType: "application/json",
            success: function(data) {
            	oEntry.UserId = data;
                oModel.create("/UserDetails", oEntry, null, function(success){
                    sap.m.MessageBox.show(
                            i18n.getProperty("CREATE_USER_SUCCESS"), {
                                icon: sap.m.MessageBox.Icon.SUCCESS,
                                title: i18n.getProperty("CREATE_USER"),
                                actions: [sap.m.MessageBox.Action.OK]

                            }
                        );
                }, function(err){
                    sap.m.MessageBox.show(
                            i18n.getProperty("CREATE_USER_FAILURE"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: i18n.getProperty("CREATE_USER"),
                                actions: [sap.m.MessageBox.Action.OK]

                            }
                        );
                });
            },
            error: function(xhr, ajaxOptions, thrownError) {
                sap.m.MessageBox.show(
                    i18n.getProperty("CREATE_USER_FAILURE"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: i18n.getProperty("CREATE_USER"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
            }

        });
        

    },
    
    //update the user
    updateUser: function(oEvent){
    	var oContext, oETag, oModel;
    	var oEntry ={};
        var i18n = this.getView().getModel("i18n");
    	oContext = this.getView().byId('idUserCRUDTable').getSelectedItem().getBindingContextPath();
    	oETag = this.getView().getModel().getProperty(oContext +  "/__metadata/etag");
    	oEntry.FirstName = sap.ui.getCore().byId('idDgFirstName').getValue();
        oEntry.LastName = sap.ui.getCore().byId('idDgLastName').getValue();
        oEntry.Email = sap.ui.getCore().byId('idDgEMail').getValue();
        oEntry.ZMYNEW1 = "";
        if(oEntry.LastName === ""){
        	oEntry.LastName = null;
        }
        if(oEntry.Email === ""){
        	oEntry.Email = null;
        }
        oModel = this.getView().getModel();
        oModel.update(oContext,oEntry, null, function(success){
            sap.m.MessageBox.show(
                    i18n.getProperty("USER_UPDATE_SUCCESS"), {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: i18n.getProperty("UPDATE_USER_DETAILS"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
        }, function(err){
            if(i18n.getProperty("ETAGS_PRECOND_FAILED") === err.response.statusText){
                sap.m.MessageBox.show(
                    i18n.getProperty("USER_UPDATE_FAILED"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: i18n.getProperty("UPDATE_USER_DETAILS"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
            }

        }, false,oETag  );
        
    	
    },
    
    //delete the user 
    deleteUser: function(oEvent){
    	var oContext, oETag;
    	var i18n = this.getView().getModel("i18n");
    	
    	//validation for table row selection
    	if(!UTIL.validateTableRowSelected(this, 'idUserCRUDTable')){
            sap.m.MessageBox.show(
                    i18n.getProperty("ROW_SELECTION"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: i18n.getProperty("DELETE_USER"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
            
            return;
    	}
    	
    	oContext = this.getView().byId('idUserCRUDTable').getSelectedItem().getBindingContextPath();
    	oETag = this.getView().getModel().getProperty(oContext +  "/__metadata/etag");
    	oModel = this.getView().getModel();
    	oModel.remove(oContext, null, function(success){
            sap.m.MessageBox.show(
                    i18n.getProperty("DELETE_USER_SUCCESS"), {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: i18n.getProperty("DELETE_USER"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
    	}, function(err){
    	    if(i18n.getProperty("ETAGS_PRECOND_FAILED") === err.response.statusText){
    	       sap.m.MessageBox.show(
                    i18n.getProperty("DELETE_USER_FAILED"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: i18n.getProperty("DELETE_USER"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
    	    }      

    	}, oETag);
    	
    },
    
    //open the dialog for the user data input
    onOpenDialog: function(oEvent) {
    	var oPersonNo, oFirstName, oLastName, oEMail;
    	var oSelectedItem;
    	var i18n = this.getView().getModel("i18n");
        var srcText = oEvent.getSource().getText();
    	
    	//validation for table row selection
    	if(srcText === i18n.getProperty("UPDATEUSER") && !UTIL.validateTableRowSelected(this, 'idUserCRUDTable')){
            sap.m.MessageBox.show(
                    i18n.getProperty("ROW_SELECTION"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: i18n.getProperty("UPDATE_USER_DETAILS"),
                        actions: [sap.m.MessageBox.Action.OK]

                    }
                );
            
            return;
    	}
        
        this._action = srcText;
        if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment("shine.usercrud.etagsdemo.view.Dialog", this);
            this.getView().addDependent(this._oDialog);
        }

        // toggle compact style
        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
        //set the values of the selected row in the dialog opened
        //first get the valued from the table and then set the value in the dialog
        if(this._action === i18n.getProperty("UPDATEUSER")){
        	oSelectedItem = this.getView().byId('idUserCRUDTable').getSelectedItem().getCells();
        	oPersonNo = oSelectedItem[0].getTitle();
        	oFirstName = oSelectedItem[1].getTitle();
        	oLastName = oSelectedItem[2].getTitle();
        	oEMail = oSelectedItem[3].getTitle(); 
            sap.ui.getCore().byId('idDgFirstName').setValue(oFirstName);
            sap.ui.getCore().byId('idDgLastName').setValue(oLastName);
            sap.ui.getCore().byId('idDgEMail').setValue(oEMail); 
        }
        else if(this._action === i18n.getProperty("CREATEUSER")){
            sap.ui.getCore().byId('idDgFirstName').setValue("");
            sap.ui.getCore().byId('idDgLastName').setValue("");
            sap.ui.getCore().byId('idDgEMail').setValue(""); 
        }
      	
        this._oDialog.open();
    },

    //close the dialog for user data input
    onCloseDialog: function(oEvent) {

        var that = this;
        var i18n = this.getView().getModel("i18n");
        var actionMethod;
        var srcBtnText = oEvent.getSource().getText();
        if (srcBtnText === "Ok") {
        	
        		//validation for user input
        		if(UTIL.validateFirstName(sap.ui.getCore().byId('idDgFirstName').getValue())&& UTIL.validateLastName(sap.ui.getCore().byId('idDgLastName').getValue()) && UTIL.validateEMail(sap.ui.getCore().byId('idDgEMail').getValue())){
                	actionMethod = that._action;
                	if (actionMethod === i18n.getProperty("UPDATEUSER")) {
    	                that.updateUser();
    	                that._oDialog.close();
                	}
                	else if(actionMethod === i18n.getProperty("CREATEUSER")){
                		that.createUser();
                		that._oDialog.close();
                	}
        		}
        		else{
                    sap.m.MessageBox.show(
                            i18n.getProperty("USER_INPUT_INVALID"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: i18n.getProperty("USER_INPUT"),
                                actions: [sap.m.MessageBox.Action.OK]

                            }
                        );
                    
        		}

        } else {

            sap.ui.getCore().byId('idDgFirstName').setValue("");
            sap.ui.getCore().byId('idDgLastName').setValue("");
            sap.ui.getCore().byId('idDgEMail').setValue("");            
            this._oDialog.close();
        }

    },
    
    //filter null values
    filterNullValue: function(oEvent){  
    	var oTable, oTemplate;
    	var arr = new Array();
    	var that = this;
    	var i18n = this.getView().getModel("i18n");
    	oTable = that.getView().byId("idUserCRUDTable");
        oTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.ObjectIdentifier({
                    title: "{UserId}",
                    class: "sapMTableContentMargin"
                }),
                new sap.m.ObjectIdentifier({
                	title: "{FirstName}",
                    class: "sapMTableContentMargin"
                }),
                new sap.m.ObjectIdentifier({
                    title: "{LastName}",
                    class: "sapMTableContentMargin"
                }),
                new sap.m.ObjectIdentifier({
                    title: "{Email}",
                    class: "sapMTableContentMargin"
                })
            ]
        });
        var oSorter = new sap.ui.model.Sorter("UserId", true);
    	if(oEvent.getSource().getPressed()){
    		oEvent.getSource().setTooltip(i18n.getProperty("CLEAR_FILTER"));	
            var oFilter1 = new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.EQ, null);
            var oFilter2 = new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.EQ, null);
            var oFilter3 = new sap.ui.model.Filter("Email", sap.ui.model.FilterOperator.EQ, null);
            arr.push(oFilter1);
            arr.push(oFilter2);
            arr.push(oFilter3);
            var oFilter = new sap.ui.model.Filter(arr, false);
            oTable.unbindItems();
            oTable.bindItems("/UserDetails", oTemplate, oSorter, oFilter);
    	}
    	else{
    		oEvent.getSource().setTooltip(i18n.getProperty("APPLY_FILTER"));
    		oTable.unbindItems();
            oTable.bindItems("/UserDetails", oTemplate, oSorter);
    	}
    },
    
    clearUserDetailsLogs: function(oEvent){
    	var that = this;
    	var i18n = this.getView().getModel("i18n");
        var xsrf_token;
        var oModel = this.getView().getModel();
        $.ajax({
            type: "GET",
            async: false,
            url: "/user/xsjs/eTagsServices.xsjs",
            contentType: "application/json",
            headers: {
                'x-csrf-token': 'Fetch'
            },
            success: function(data, textStatus, request) {
                xsrf_token = request.getResponseHeader('x-csrf-token');
            }
        });
        
        $.ajax({
            url: "/user/xsjs/eTagsServices.xsjs",
            type: 'DELETE',
            headers: {
                'x-csrf-token': xsrf_token
            },
            contentType: "application/json",
            success: function(data) {
            	sap.m.MessageBox.show(
            			i18n.getProperty("USER_DETAILS_LOGS_DELETION_SUCCESS"), {
                            icon: sap.m.MessageBox.Icon.SUCCESS,
                            title: i18n.getProperty("USER_DETAILS_LOGS_DELETION"),
                            actions: [sap.m.MessageBox.Action.OK]

                        }
                    );
            	oModel.refresh();
            	
            },
            error: function(xhr, ajaxOptions, thrownError) {
                sap.m.MessageBox.show(
                		i18n.getProperty("USER_DETAILS_LOGS_DELETION_FAILURE"), {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: i18n.getProperty("USER_DETAILS_LOGS_DELETION"),
                            actions: [sap.m.MessageBox.Action.OK]

                        }
                    );
            }
        });
    }

});