sap.ui.jsview("spatial-demo.main", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf shine-so.main
     */
    getControllerName: function() {
        return "spatial-demo.main";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf shine-so.main
     */
    createContent: function(oController) {
        sap.app.mainController = oController;

        var view = this;
        view.oShell = new sap.ui.ux3.Shell({
            id: "main",
            appTitle: sap.app.i18n.getText("TITLE"),
            appIcon: "images/SAPLogo.gif",
            showLogoutButton: true,
            logout: function() {
                oController.logout();
            },
            showSearchTool: false,
            showFeederTool: false,
            showTools: false,
            showPane: false,
            designType: sap.ui.ux3.ShellDesignType.Crystal
        });

        view.oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
            id: "nav-bpDetails",
            text: sap.app.i18n.getText("BP_DETAILS_TITLE")
        }));

        view.oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
            id: "nav-sales-analysis",
            text: sap.app.i18n.getText("SALES_ANALYSIS")
        }));
        
        view.oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
            id: "nav-productsHeatMap",
            text: sap.app.i18n.getText("PRODUCT_SALES")
        }));

        view.oShell.addStyleClass('sapDkShell');

        // action when shell workset item are clicked
        view.oShell.attachWorksetItemSelected(function(oEvent) {
            var sViewName = oEvent.getParameter("id").replace("nav-", "");
            view.oShell.setContent(sap.app.mainController.getCachedView(sViewName));
        });

        return view.oShell;
    }

});