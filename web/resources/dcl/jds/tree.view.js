sap.ui.jsview("jds.tree", {

	getControllerName : function() {
		return "jds.tree";
	},

	createContent : function(oController) {
        var backendURL = "/node/dcl/salesorder"
	    var oModel = new sap.ui.model.json.JSONModel(backendURL, false);
        var restErrorMessage = "Something has gone wrong while accessing the REST service at " + backendURL + 
                 ". Please check whether the node.js application is up and running. Depending on your runtime " + 
                 "either execute 'cf logs node-hello-world-backend --recent' or 'xs logs node-hello-world-backend --recent'."
        var restErrorMessageForbidden = "Something has gone wrong while accessing the REST service at " + backendURL + 
                 ". The end user is not authorized to access the data. Ensure that the required structured " +
                 "privilege is assigned."

        oModel.attachParseError(function(oControlEvent) {
        	alert(restErrorMessage);
        });

        oModel.attachRequestFailed(function(oControlEvent) {
            //alert('EVENT FAILED: ' + oControlEvent.getParameters.responseText);
            alert(restErrorMessage);
        });

        var oTable = new sap.ui.table.TreeTable({
            id : "SalesOrderOverview",
            columns: [
                new sap.ui.table.Column({label: "Id", template: "id"}),
                new sap.ui.table.Column({label: "Customer Country", template: "customerCountry"}),
                new sap.ui.table.Column({label: "Employee Language", template: "employeeLanguage"}),
                new sap.ui.table.Column({label: "Currency", template: "currencyCode"}),
                new sap.ui.table.Column({label: "Gross Amount", template: "grossAmount"}),
                new sap.ui.table.Column({label: "Net Amount", template: "netAmount"}),
                new sap.ui.table.Column({label: "Tax Amount", template: "taxAmount"}),
                new sap.ui.table.Column({label: "Lifecycle Status", template: "lifecycleStatus"}),
                new sap.ui.table.Column({label: "Billing Status", template: "billingStatus"}),
                new sap.ui.table.Column({label: "Delivery Status", template: "deliveryStatus"})
            ],
            visibleRowCount : 20,
            width : "100%",
            selectionMode : sap.ui.table.SelectionMode.Single,
            selectionBehavior : sap.ui.table.SelectionBehavior.Row
        });

        oTable.setModel(oModel);
        var oSorter = new sap.ui.model.Sorter("id");
        oTable.bindRows("/salesorders", oSorter);

        // button to generate more data
        var oBtn = new sap.ui.commons.Button({text: "Refresh",
            press: function() {
                var aData = jQuery.ajax({
                    type : "GET",
                    contentType : "application/json",
                    url : backendURL,
                    dataType : "json",
                    async: false, 
                    success : function(data, textStatus, jqXHR) {
                    	oModel.loadData(backendURL);
                    },
                    statusCode: {
                        403 : function() {
                            location.reload();
                        }
                    }
                });
            }
        });
        oTable.setToolbar(new sap.ui.commons.Toolbar({items: [oBtn]}));
        
        var oPanel = new sap.ui.commons.Panel().setText("Sales Orders").addContent(oTable);
        return oPanel;
	}
});