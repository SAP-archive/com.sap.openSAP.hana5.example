sap.ui.jsview("sales_dashboard.Shell", {

	getControllerName : function() {
		return "sales_dashboard.Shell";
	},

	createContent : function(oController) {
		sap.app.mainController = oController;
		oController.oShell = new sap.ui.ux3.Shell("myShell", {
			appIcon : "/images/sap_18.png",
			appIconTooltip : "SAP",
			appTitle : oBundle.getText("SHELL_HEADER_TITLE"),
			showLogoutButton : true,
			logout:function(){
				oController.logout();
			},
			showSearchTool : false,
			showFeederTool : false,
			showTools : false,
			showPane : false,
			designType : sap.ui.ux3.ShellDesignType.Crystal,
		});

		createShell(oController);
		buildShellPersonalization(oController);
		buildShellNavigation(oController);
	
		//var oLayout = new sap.ui.commons.layout.MatrixLayout();
		//oController.oOverviewView = sap.ui.view({id:"overview_view", viewName:"sales_dashboard.Overview", type:sap.ui.core.mvc.ViewType.JS});
		//oController.oProductsView = sap.ui.view({id:"products_view", viewName:"sales_dashboard.Products", type:sap.ui.core.mvc.ViewType.JS});
		//oController.oDetailsView = sap.ui.view({id:"details_view", viewName:"sales_dashboard.Details", type:sap.ui.core.mvc.ViewType.JS});
				
		//oLayout.createRow(oController.oOverviewView);   
		//oController.oShell.setContent(oLayout);
		return oController.oShell;
	}
});

function createShell(oController) {
	var oUserTxt = new sap.ui.commons.TextView({
		tooltip : oBundle.getText("welcome") 
	});
	oController.oShell.addHeaderItem(oUserTxt);
	oController.getSessionInfo(oController,oUserTxt);
	oController.oShell.addHeaderItem(new sap.ui.commons.Button({
		text : oBundle.getText("personalize"),
		tooltip : oBundle.getText("personalize"),
		press : oController.handlePersonalizeShell
	}));

	oController.oShell.addHeaderItem(new sap.ui.commons.MenuButton({
		text : oBundle.getText("help"),
		tooltip : oBundle.getText("helpm"),
		menu : new sap.ui.commons.Menu("menu1", {
			items : [ new sap.ui.commons.MenuItem("menuitem1", {
				text : oBundle.getText("help")
			}), new sap.ui.commons.MenuItem("menuitem2", {
				text : oBundle.getText("incident")
			}), new sap.ui.commons.MenuItem("menuitem3", {
				text : oBundle.getText("about")
			}) ]
		})
	}));
}

function buildShellPersonalization(oController) {
	// EXPERIMENTAL - THIS WILL CHANGE!!
	oController.oShell._getPersonalization().attachPersonalizationChange(
			oController.handlePersonalizeShellChange);
	// initialize settings
	if (JSON && window["localStorage"]) { // only in browsers with native JSON
											// and offline storage support
		var sSettings = localStorage.getItem("sapUiShellTestSettings");
		if (sSettings) {
			oController.oShell.initializePersonalization(JSON.parse(sSettings));
		}
	}
}

function buildShellNavigation(oController) {
	var WI = sap.ui.ux3.NavigationItem;
	
	if (!sap.isSingle) {
		oController.oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
			id : "nav-Overview",
			//key : "nav-Overview",			
			text : sap.app.i18n.getText("OVERVIEW_TITLE")
		}));
		oController.oShell.addWorksetItem(new sap.ui.ux3.NavigationItem({
			id : "nav-Products",
			//key : "nav-Products",			
			text : sap.app.i18n.getText("PRODUCT_REPORTS_TITLE"),
		}));
	}
	oController.oShell.addStyleClass('sapDkShell');	
	

	oController.oShell.addWorksetItem(new WI("nav-Details", {
		//key : "nav-Details",
		text : oBundle.getText("Details") }));	

//	oController.oShell.attachEvent("worksetItemSelected", function(oEvent){
//		var oLayout = new sap.ui.commons.layout.MatrixLayout();	
//    	var sId = oEvent.getParameter("id");
//		switch (sId) {
//		case "wi_home":
//			oController.oShell.setContent(oLayout.createRow(oController.oOverviewView));
//			break;
//		case "wi_products":
//			oController.oShell.setContent(oLayout.createRow(oController.oProductsView));
//			break;	
//		case "wi_details":
//			oController.oShell.setContent(oLayout.createRow(oController.oDetailsView));
//			break;				
//		}
//	});
	
	// action when shell workset item are clicked
	oController.oShell.attachWorksetItemSelected(function(oEvent) {
		var sViewName = oEvent.getParameter("id").replace("nav-", "");
		oController.oShell.setContent(sap.app.mainController.getCachedView(sViewName));
	});
	
	// initial shell content
	if (!sap.isSingle) {
		oController.oShell.addContent(sap.app.mainController.getCachedView("Overview"));
	} else {
		oController.oShell.addContent(sap.app.mainController.getCachedView("Details"));
	}
	
	
}