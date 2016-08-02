sap.ui.jsfragment("app.sendFailedDialog", {

    cell: function(oContent) {
        return new sap.ui.commons.layout.MatrixLayoutCell({
            content: oContent
        });

    },

    image: function() {
        var oImage = new sap.ui.commons.Image({
            decorative: true
        });
        oImage.addStyleClass("sapUiMboxIcon");
        oImage.addStyleClass("sapUiMboxError");
        return oImage;

    },
    
    createContent: function() {
        var oMsg = new sap.ui.commons.TextView().setText(sap.app.i18n.getText("SMTP_NOT_CONFIG")).addStyleClass("sapUiMboxText");
        var oGotoText = new sap.ui.commons.TextView().setText(sap.app.i18n.getText("GO_TO")).addStyleClass("sapUiMboxText").addStyleClass("sapUiMltPadRight");
        var oLink = new sap.ui.commons.Link({
            text: sap.app.i18n.getText("SMTP_CONFIG_LINK"),
            press: function() {
                window.open('/sap/hana/xs/admin/#/smtp');
            }
        });
        var oText = new sap.ui.commons.TextView().setText(sap.app.i18n.getText("SMTP_CONFIG_DESCRIPTION")).addStyleClass("sapUiMboxText").addStyleClass("sapUiMltPadLeft");
        var oHorizontalLayout = new sap.ui.layout.HorizontalLayout({
            content: [oGotoText,oLink, oText]
        });
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oMsg, oHorizontalLayout]
        });
        var oContent = new sap.ui.commons.layout.MatrixLayout({
            layoutFixed: false
        }).addStyleClass("sapUiMboxCont");
        oContent.createRow(this.cell(this.image("ERROR")), this.cell(oVerticalLayout));
        var dialogButton = new sap.ui.commons.Button({
            text: sap.app.i18n.getText("OK"),
            press: function() {
                oDialog.close();
            }
        });
        var oDialog = new sap.ui.commons.Dialog({
            title: sap.app.i18n.getText("EMAIL_ERROR"),
            modal : true,
            content: oContent,
            buttons: dialogButton
        });
        return oDialog;
    }
});