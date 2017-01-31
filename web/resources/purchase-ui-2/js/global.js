/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, quotes:0*/
    // Service Call Logic
    var gFilterTerms = "";
    var gFilterAttribute = "";
    var gLastOrdersChangedTime = "";
    var gSearchParam;
   // jQuery.sap.require("sap.ui.model.json");
   // var oPieModel = new sap.ui.model.json.JSONModel();

    /*************** Language Resource Loader *************/
    jQuery.sap.require("jquery.sap.resources");
    var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
    var oBundle = jQuery.sap.resources({
        url: "./i18n/i18n.properties",
        locale: sLocale
    });
    
    /** Tooltip formatting for the chart */
    var tooltipFormatString = '';
    if (sLocale.indexOf("de") > -1) {
        tooltipFormatString = '#.###.###.###,00'; 
    } else {
        tooltipFormatString = '#,###,###,###.00'; 
    }

    /** initialize tile dialog */
    jQuery.sap.registerModulePath('app', 'js');
    jQuery.sap.require("app.tileDialog");


    function escape(v1) {
        var v2 = v1.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return v2;
    }

    /*** Numeric Formatter for Quantities ***/
    function numericSimpleFormatter(val) {
        if (val === undefined) {
            return '0';
        } else {
            jQuery.sap.require("sap.ui.core.format.NumberFormat");
            var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
                maxFractionDigits: 0,
                minFractionDigits: 0,
                groupingEnabled: true
            });
            return oNumberFormat.format(val);
        }

    }
    
    /* Wrapper for the function to be executed only once */
    function once(fn, context) { 
	    var result;
	    return function() { 
		    if(fn) {
			    result = fn.apply(context || this, arguments);
			    fn = null;
		    }
		    return result;
	    };
    }