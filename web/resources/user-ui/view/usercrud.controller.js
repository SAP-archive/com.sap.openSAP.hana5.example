sap.ui.controller("shine.democontent.epm.usercrud.view.usercrud", {

    onInit : function(){
        var oLocalUserData = {
            "FirstName": "",
            "LastName" : "",
            "Email" : "",
            "UserId" : 1
        };
        this.oLocalUserModel = new sap.ui.model.json.JSONModel(oLocalUserData);
        this.getView().setModel(this.oLocalUserModel,"user");
        
        var oLocalUserBatchData = [{
            "FirstName": "",
            "LastName" : "",
            "Email" : "",
            "UserId" : 1
        }];
        this.oBatchModel = new sap.ui.model.json.JSONModel(oLocalUserBatchData);
        this.getView().setModel(this.oBatchModel,"batch");
        
        this.oBatchDialog = null;
        
        var data = { languages: [{
        "name": "German"    
    }]
    };

    var oModel = new sap.ui.model.json.JSONModel(data);
    this.getView().setModel(oModel,"lang");
    },

    callUserService: function() {
        
        var oModel = this.getView().getModel();
        
        var oEntry = this.getView().getModel("user").getData();
                    var xsrf_token;
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: "/user/odata/v4/sap.hana.democontent.epm.data._.UserData/User",
                        contentType: "application/json",
                        headers: {
                            'x-csrf-token': 'Fetch'
                        },
                        success: function(data, textStatus, request) {
                            xsrf_token = request.getResponseHeader('x-csrf-token');
                        },
                        error: function(error){
                            console.log(error);
                        }
                    });
                    
                    var aUrl = '/user/odata/v4/sap.hana.democontent.epm.data._.UserData/User';
                    jQuery.ajax({
                        url: aUrl,
                        method: 'POST',
                        data: JSON.stringify(oEntry),
                        contentType: "application/json",
                        headers: {
                            'x-csrf-token': xsrf_token
                        },
                        success: function(){
                            //sap.ui.commons.MessageBox.alert(i18n.getProperty("CC_NUMBER_ADDED"));
                            alert('Create Successful');
                            this.resetUserModel();
                        },
                        error: function(error) {
                            //sap.ui.commons.MessageBox.alert(i18n.getProperty("ERROR"));
                            console.log(error);
                            alert("Create failed");
                        }
                    });

    },
    updateService: function(Event) {
        var oModel = this.byId("userTbl").getModel();

        oModel.submitChanges(function() {
            alert("Update successful");

        }, function() {
            alert("Update failed");
        });

    },

    onSubmitBatch : function(){
      //create an array of batch changes and save
        var oModel = this.byId("userTbl").getModel();
        var i18n = this.getView().getModel("i18n");
        var batchModel = new sap.ui.model.odata.ODataModel("/sap/hana/democontent/epm/services/userBeforeExit.xsodata/", true);
        var newUserList = this.getView().getModel("batch").getData();
        var batchChanges = [];
        for (var k = 0; k < newUserList.length; k++) {
            batchChanges.push(batchModel.createBatchOperation("/User", "POST", newUserList[k]));
        }
        batchModel.addBatchChangeOperations(batchChanges);
        //submit changes and refresh the table and display message  
        batchModel.submitBatch(function(data, response, errorResponse) {
            oModel.refresh();

            if (errorResponse && errorResponse.length > 0) {
                alert("Error occurred");
            } else {
                alert(i18n.getResourceBundle().getText("USER_CREATED", k));
            }
        }, function(data) {
            alert("Error occurred ");
        });
        this.oBatchDialog.close();
    },

    onDeletePress: function(oEvent) {
        var oTable = this.byId("userTbl");
        var model = oTable.getModel();
        var userId = model.getProperty("UserId", oTable.getContextByIndex(oTable.getSelectedIndex()));

        if (!userId) {
            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show(this.getView().getModel("i18n").getProperty("SELECT_ROW"), "ERROR", "User CRUD");
        } else {

            model.remove("/" + oTable.getContextByIndex(oTable.getSelectedIndex()), {
             
                fnSuccess: function(oData, oResponse) {
                    jQuery.sap.require("sap.ui.commons.MessageBox");
                    sap.ui.commons.MessageBox.show("User deleted successfully.", "SUCCESS", "User CRUD");
                    model.refresh();
                },
                fnError: function() {
                    jQuery.sap.require("sap.ui.commons.MessageBox");
                    sap.ui.commons.MessageBox.show("Could not delete the user.", "ERROR", "User CRUD");
                }
            });

        }
    },
    
    onAddCC: function(oEvent) {
        var oTable = this.byId("userTbl");
        var model = oTable.getModel();
        var userId = model.getProperty("UserId", oTable.getContextByIndex(oTable.getSelectedIndex()));
        var i18n = this.getView().getModel("i18n");
        
        if (!userId) {

            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show(i18n.getProperty("SELECT_ROW"), "ERROR", "User CRUD");

        } else {
            
            var input = new sap.ui.commons.TextField({
                width: '100%'
            });
            
            var btnOk = new sap.ui.commons.Button({
               text : "{i18n>SUBMIT}",
    			press : function() {
    			    var payload = {
    			        key: userId,
    			        value: input.getValue()
    			    };
    			    
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
    			    
    				var aUrl = '/sap/hana/democontent/epm/services/secureStore.xsjs?cmd=store';
                    jQuery.ajax({
                        url: aUrl,
                        method: 'POST',
                        data: JSON.stringify(payload),
                        contentType: "application/json",
                        headers: {
            				'x-csrf-token': xsrf_token
            			},
                        success: function(){
                            sap.ui.commons.MessageBox.alert(i18n.getProperty("CC_NUMBER_ADDED"));
                        },
                        error: function() {
                            sap.ui.commons.MessageBox.alert(i18n.getProperty("ERROR"));
                        }
                    });
                    
                    oDialog.close();
    			} 
            });
            var oDialog = new sap.ui.commons.Dialog({
                title: '{i18n>ADD_CREDIT_CARD}',
    			buttons : [ btnOk ],
    			content : [ input ]
    		});
    		this.getView().addDependent(oDialog);
    		oDialog.open();

        }
    },
    
    onViewCC: function(oEvent) {
        var oTable = this.byId("userTbl");
        var model = oTable.getModel();
        var i18n = this.getView().getModel("i18n");
        var userId = model.getProperty("UserId", oTable.getContextByIndex(oTable.getSelectedIndex()));

        if (!userId) {

            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show(i18n.getProperty("SELECT_ROW"), "ERROR", "User CRUD");

        } else {
            
            var aUrl = '/sap/hana/democontent/epm/services/secureStore.xsjs?cmd=read&key=' + userId;
            jQuery.ajax({
                url: aUrl,
                method: 'GET',
                success: function(data, response){
                    sap.ui.commons.MessageBox.alert(i18n.getResourceBundle().getText("CC_NUMBER_DISPLAY", data));
                },
                error: function() {
                    sap.ui.commons.MessageBox.alert(i18n.getProperty("CC_NUMBER_NOT_PRESENT"));
                }
            });
        }
    },
    
    onDeleteCC: function(oEvent) {
        var oTable = this.byId("userTbl");
        var model = oTable.getModel();
        var i18n = this.getView().getModel("i18n");
        var userId = model.getProperty("UserId", oTable.getContextByIndex(oTable.getSelectedIndex()));

        if (!userId) {

            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show(i18n.getProperty("SELECT_ROW"), "ERROR", "User CRUD");

        } else {

            var aUrl = '/sap/hana/democontent/epm/services/secureStore.xsjs?cmd=delete&key=' + userId;
            jQuery.ajax({
                url: aUrl,
                method: 'GET',
                success: function(data, response){
                    sap.ui.commons.MessageBox.alert(i18n.getProperty("CC_NUMBER_DELETED"));
                },
                error: function() {
                    sap.ui.commons.MessageBox.alert(i18n.getProperty("CC_NUMBER_NOT_PRESENT"));
                }
            });

        }    
    },
    
    onUsrCreateXmlBtnPress : function(){
        
       this.oFileUploader =  new sap.ui.unified.FileUploader({
			uploadUrl: "/sap/hana/democontent/epm/services/xmlParser.xsjs",
			fileType: ["xml"],
			uploadOnChange: false,
			sendXHR: true,
			multiple :true,
			placeholder:"choose one or more files",
			typeMissmatch : [this.onFileTypeMissmatch,this],
			uploadComplete:[this.onXmlUpload,this],
			sameFilenameAllowed : true,
			width : "100%"
		});
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			height : "80px"
		});
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oCell.addContent(this.oFileUploader);
		oLayout.createRow(oCell);
		var oLink = new sap.ui.core.HTML({content : "<div>Download&nbsp;<a href='/sap/hana/democontent/epm/services/sample.xml' download>Sample.xml</a></div>"});
		oLayout.createRow(new sap.ui.commons.layout.MatrixLayoutCell({
            content: [oLink],
            hAlign: sap.ui.commons.layout.HAlign.Center
        }));
		this.oXmlUploadDialog = new sap.ui.commons.Dialog({
            modal: true,
            width : "400px",
            title : "{i18n>CHOOSE_FILE}",
			content: [oLayout],
			buttons :[ new sap.ui.commons.Button({text :"{i18n>SUBMIT}", style:"Accept",press:[this.uploadXml,this]})]
        });
        this.getView().addDependent(this.oXmlUploadDialog);
         this.oXmlUploadDialog.open();
    },
    
    uploadXml : function(){
        var that = this;
        if(this.oFileUploader.oFileUpload.files.length){
             var jqxhr = jQuery.ajax({
    				url : '/sap/hana/democontent/epm/services/soCreate.xsodata',
    					type : 'GET',
    					datatype : 'json',
    					beforeSend : function(xhr) { xhr.setRequestHeader("X-CSRF-Token", "Fetch"); },
    					error : function() {
    					}	
    				}).done(function() {
    			  var token = jqxhr.getResponseHeader("X-CSRF-Token");
    				that.oFileUploader.addHeaderParameter(new sap.ui.commons.FileUploaderParameter({name: "x-csrf-token", value:token }));
    				that.oFileUploader.upload();
    			});
        }else{
            alert(sap.ui.getCore().getModel("i18n").getProperty("NO_FILE_CHOSEN"));
        }
    },
    
    onXmlUpload : function(oEvent){
        var that = this;
        var sStatus = oEvent.getParameter("status");
        var sResponse = oEvent.getParameter("responseRaw");
        var resourceModel = this.getView().getModel("i18n");
        if(sStatus === 200){
            var userList = jQuery.parseJSON(sResponse).users;
            if(userList.length > 0){
                alert(resourceModel.getResourceBundle().getText("USER_CREATED",userList.length));
                this.byId("userTbl").getModel().refresh();
                that.oXmlUploadDialog.close();
            }else{
                alert(resourceModel.getResourceBundle().getText("NO_USR_FOUND"));
                that.oXmlUploadDialog.close();
            }
        }else{
            alert(sResponse);
            that.oXmlUploadDialog.close();
        }
    },
    
    onFileTypeMissmatch : function(){
        this.oFileUploader.clear();
    },
    
    openBatchDialog : function(){
        if(!this.oBatchDialog){
            this.oBatchDialog = sap.ui.xmlfragment("shine.democontent.epm.usercrud.view.batchDialog",this);
            this.getView().addDependent(this.oBatchDialog);
        }
        this.oBatchDialog.open();
    },
    
    addNewLineItem : function(){
        
        var oLocalUserData = {
            "FirstName": "",
            "LastName" : "",
            "Email" : "",
            "UserId" : 1
        };
        this.getView().getModel("batch").getData().push(oLocalUserData);
        this.getView().getModel("batch").updateBindings("true");
        
    },
    
    openTileDialog : function(oEvent){
        var iData = parseInt(oEvent.getSource().data("tileDialog"));
        var oTileDialog = new sap.account.TileDialog(this,iData);
        this.getView().addDependent(oTileDialog);
        oTileDialog.open(iData);
    },
    
    onBatchDialogClose : function(){
        //reset the model
         this.getView().getModel("batch").setData([{
            "FirstName": "",
            "LastName" : "",
            "Email" : "",
            "UserId" : 1
        }]);
    },
    isDeleteIconVisible : function(oEvent){
        if(oEvent.UserId === "0000000000"){
            return false;
        }
        return true;
    },
    
    onRemoveRow : function(oEvent){
        var regEx = /\d+/;
        var sPath = oEvent.getSource().getBindingContext("batch").getPath();
        var iIndex = sPath.match(regEx);
        var oBatchModel = this.getView().getModel("batch");
        oBatchModel.getData().splice(iIndex,1);
        oBatchModel.updateBindings();
    },
    
    resetUserModel : function(){
         
         var oLocalUserData = {
            "FirstName": "",
            "LastName" : "",
            "Email" : "",
            "UserId" : 1
        };
        this.getView().getModel("user").setData(oLocalUserData);
    },
    
    handlePressHome: function(oEvent) {
        var oShell = this.getView().byId("myShell");
        var bState = oShell.getShowPane();
		oShell.setShowPane(!bState);
    },
  
  onListItemPress : function (oEvent){
    //   var oTileDialog = new sap.account.TileDialog(this,1);
    //   this.getView().addDependent(oTileDialog);
    //   oTileDialog.open(1);
    //   var oBtnOk = sap.ui.getCore().byId("idOkBtn");
    //   oBtnOk.addDelegate({"onpress":function(){
    //     var win = window.open("/sap/hana/democontent/epm/ui/userCRUD/index.html?sap-ui-language=de", '_blank');
    //     win.focus(); 
  
		var oItem = oEvent.getParameters();
		var item = JSON.stringify(oItem);
		var languageId = item.substr(36,1);
				
        var oDialog;
        var btnOk = new sap.m.Button( {
               text : "{i18n>OK}",
               press: function(oEvent){
                  oDialog.close();
               }
            });
        
            var oTextView = new sap.ui.core.HTML({
                content: "{i18n>TRANSLATE_TO_LANG"+languageId+"_LINK}",
                width: "100%"
            });
             var destroyDialog = function(oEvent) {
                oEvent.getSource().destroy();
             };
            oDialog = new sap.m.Dialog({
                title: "{i18n>TRANSLATE_TO_LANG"+languageId+"}",
                content : [ oTextView ],
    			buttons : [ btnOk ],
    			closed: destroyDialog
    		});
    		if(!(oDialog.isOpen())){
    	    	this.getView().addDependent(oDialog);
    		    oDialog.open();
    		}
      }
});