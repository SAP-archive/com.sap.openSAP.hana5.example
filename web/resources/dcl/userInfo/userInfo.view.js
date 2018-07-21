sap.ui.jsview("userInfo.userInfo", {

	getControllerName : function() {
		return "userInfo.userInfo"
	},

	createContent : function(oController) {
        var backendURL = "/node/dcl/userinfo2"
	    var oModel = new sap.ui.model.json.JSONModel(backendURL, false)
        var restErrorMessage = "Something has gone wrong while accessing the REST service at " + backendURL + ". Please check whether the node.js application " +
                 "is up and running. Depending on your runtime either execute 'cf logs node-hello-world-backend --recent' or 'xs logs node-hello-world-backend --recent'."

        oModel.attachRequestFailed(function(oControlEvent) {
            /**
             * if the session is invalid the page will be
             * reloaded and the user will be redirected to the login page
             */
            if(oControlEvent.mParameters && oControlEvent.mParameters.statusCode === 401) {
                location.reload();
            }
            else {
                alert(restErrorMessage);
            }
        })
        sap.ui.getCore().setModel(oModel)
        oModel.loadData("/node/dcl/userinfo2")

        var oLayout = new sap.ui.commons.layout.MatrixLayout({
            id : "matrixLayout",
            layoutFixed : false
        })

        // create panel for jwt data
        var oPanelJwt = new sap.ui.commons.Panel()
        oPanelJwt.setText("JWT Token Data")
        oPanelJwt.setShowCollapseIcon(false)
        var oLayoutJwt = new sap.ui.commons.layout.MatrixLayout({
            id : "gridJwt",
            layoutFixed : false
        })
        userNameLabel = new sap.ui.commons.Label({
            text : 'User ID',
            design : sap.ui.commons.LabelDesign.Bold
        })
        userNameValue = new sap.ui.commons.TextView({
            text : "{/user/id}"
        })
        firstNameLabel = new sap.ui.commons.Label({
            text : 'First name',
            design : sap.ui.commons.LabelDesign.Bold
        })
        firstNameValue = new sap.ui.commons.TextView({
            text : "{/user/name/givenName}"
        })
        lastNameLabel = new sap.ui.commons.Label({
            text : 'Last name',
            design : sap.ui.commons.LabelDesign.Bold
        })
        lastNameValue = new sap.ui.commons.TextView({
            text : "{/user/name/familyName}"
        })
        oLayoutJwt.createRow(userNameLabel, userNameValue)
        oLayoutJwt.createRow(firstNameLabel, firstNameValue)
        oLayoutJwt.createRow(lastNameLabel, lastNameValue)
        oPanelJwt.addContent(oLayoutJwt)

        // create panel for db data
        var oPanelDb = new sap.ui.commons.Panel();
        oPanelDb.setText("Database Data")
        oPanelDb.setShowCollapseIcon(false)
        var oLayoutDb = new sap.ui.commons.layout.MatrixLayout({
            id : "gridDb",
            layoutFixed : false
        })
        applicationUserLabel = new sap.ui.commons.Label({
            text : 'Application user',
            design : sap.ui.commons.LabelDesign.Bold
        })
        applicationUserValue = new sap.ui.commons.TextView({
            text : "{/hdbCurrentUser/0/APPLICATION_USER}"
        })
        technicalUserLabel = new sap.ui.commons.Label({
            text : 'Technical user',
            design : sap.ui.commons.LabelDesign.Bold
        })
        technicalUserValue = new sap.ui.commons.TextView({
            text : "{/hdbCurrentUser/0/CURRENT_USER}"
        })
        oLayoutDb.createRow(applicationUserLabel, applicationUserValue)
        oLayoutDb.createRow(technicalUserLabel, technicalUserValue)
        oPanelDb.addContent(oLayoutDb)

        oLayout.createRow(oPanelJwt)
        oLayout.createRow(oPanelDb)

        return oLayout
	}
});