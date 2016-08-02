sap.ui.controller("spatial-demo.main", {

    // instantiated view will be added to the oViewCache object and retrieved from there
    oViewCache: {},

    onInit: function() {

    },

    /**
     * getCachedView checks if view already exists in oViewCache object, will create it if not, and return the view
     */
    getCachedView: function(viewName) {
        if (!this.oViewCache[viewName]) {
            var fullViewName = "spatial-demo" + "." + viewName;
            this.oViewCache[viewName] = sap.ui.view({
                id: viewName,
                viewName: fullViewName,
                type: sap.ui.core.mvc.ViewType.JS
            });
        }
        return this.oViewCache[viewName];
    },

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf shine_so.main
     */
    //	onInit: function() {
    //
    //	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf shine_so.main
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf shine_so.main
     */
    onAfterRendering: function() {
        var oController = this;
        var view = oController.getView();
        var aUrl = "/sap/hana/democontent/epm/spatial/services/getKeys.xsjs";
        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            success: function(arg1, arg2, jqXHR) {

                if (arg1.entry.APP_ID) {
                    // set keys to nokia settings
                    // nokia.Settings.set("app_id", arg1.entry.APP_ID);
                    // nokia.Settings.set("app_code", arg1.entry.APP_CODE);
                    sap.app.platform = new H.service.Platform({
                      'app_id': arg1.entry.APP_ID,
                      'app_code': arg1.entry.APP_CODE
                    });

                    // initialize the view
                    // add initial shell content
                    view.oShell.addContent(sap.app.mainController.getCachedView("bpDetails"));

                } else {
                    // show welcome dialog with help to obtain the keys
                    var welcomeDialog = new sap.account.WelcomeDialog(oController);
                    welcomeDialog.open();
                }

            },
            error: function() {

            }
        });
    },

    logout: function() {
        var aUrl = "/sap/hana/xs/formLogin/token.xsjs";
        jQuery.ajax({
            url: aUrl,
            method: 'GET',
            dataType: 'text',
            beforeSend: function(jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', 'Fetch');
            },
            success: function(arg1, arg2, jqXHR) {
                var aUrl = "/sap/hana/xs/formLogin/logout.xscfunc";
                jQuery.ajax({
                    url: aUrl,
                    type: 'POST',
                    dataType: 'text',
                    beforeSend: function(jqXHR1, settings) {
                        jqXHR1.setRequestHeader('X-CSRF-Token', jqXHR.getResponseHeader('X-CSRF-Token'));
                    },
                    success: function() {
                        location.reload();
                    },
                    error: function() {

                    }
                });

            },
            error: function() {

            }
        });
    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf shine_so.main
     */
    //	onExit: function() {
    //
    //	}

});