//To use a javascript controller its name must end with .controller.js
sap.ui.controller("sap.shineNext.odataDeep.view.App", {
  onInit: function() {
        var model = new sap.ui.model.json.JSONModel({});
        this.getView().setModel(model);
        this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
    },
    
  callCreateService: function(){
		var result = this.getView().getModel().getData();
		var oBusinessPartner = {};
		oBusinessPartner.PARTNERID = "0000000000";
		oBusinessPartner.EMAILADDRESS = result.Email;
		oBusinessPartner.COMPANYNAME = result.CompanyName;                                                     
		
		var oAddress = {};
		oAddress.ADDRESSID = "0000000000"; 
		oAddress.CITY = result.City;

		var oLink = {};
		oLink.uri = "$2";
		
		 var xhr = new XMLHttpRequest();
 
		 xhr.open("POST", '/sap/hana/democontent/epm/services/businessPartnersAddresses.xsodata/$batch', true);
		 
		 var token = getCSRFToken();
	     xhr.setRequestHeader("X-CSRF-Token", token);
		 
		 xhr.setRequestHeader("Accept", 'application/json'); 
		 xhr.setRequestHeader("Content-Type", 'multipart/mixed;boundary=batch'); 
		 xhr.setRequestHeader("DataServiceVersion", '2.0'); 
		 xhr.setRequestHeader("MaxDataServiceVersion", '2.0');
		 
		 var body = '';
		 
		 body += '--batch' + '\n';		 
	     body +='Content-Type:multipart/mixed;boundary=changeset' + '\n';	     
	     body +='Content-Transfer-Encoding:binary'+ '\n';
	     body +='\n';
	     
	     body += '--changeset' + '\n';	     
	     body += 'Content-Type:application/http' + '\n';
		 body += 'Content-Transfer-Encoding:binary\n';	     
		 body += 'Content-ID: 1\n';
	     body +='\n';
	     
		 body += 'POST BusinessPartners HTTP/1.1\n';
		 body += "Content-Type: application/json\n";	
		 var jsonBP = JSON.stringify(oBusinessPartner);
		 body += "Content-Length:" + jsonBP.length +'\n';
	     body +='\n';
		 body += jsonBP + '\n';
	     body += '--changeset' + '\n';
		 
	     body += 'Content-Type:application/http' + '\n';
		 body += 'Content-Transfer-Encoding:binary\n';	     
		 body += 'Content-ID: 2\n';
	     body +='\n';
		 
		 body += 'POST Addresses HTTP/1.1\n';
		 body += "Content-Type:application/json\n";
		 var jsonAdd = JSON.stringify(oAddress);
		 body += "Content-Length:" + jsonAdd.length +'\n';
	     body +='\n';
		 
		 body += jsonAdd + '\n';
	     body += '--changeset' + '\n';	     
		 
	     body += 'Content-Type:application/http' + '\n';
		 body += 'Content-Transfer-Encoding:binary\n';
	     body +='\n';
	     
		 body += 'PUT $1/$links/AddRef HTTP/1.1\n';
		 body += "Content-Type:application/json\n";
		 var jsonLink = JSON.stringify(oLink);
		 body += "Content-Length:" + jsonLink.length +'\n';
	     body +='\n';
	     
		 body += jsonLink + '\n';
		 
	     body += '--changeset' + '--\n';	     
	     body +='\n';
    
		 body += '--batch' + '--\n';	  		 
	     
         xhr.onload = function() { };
		 xhr.send(body);
		 sap.m.MessageToast.show("Business Partner created");    
  }
});