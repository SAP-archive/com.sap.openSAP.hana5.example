jQuery.sap.declare("shine.usercrud.etagsdemo.util.utility");

function UTIL() {

}

UTIL.validateFirstName = function(name) {
	
	var isValid = true;
    var letters = /^[a-zA-Z]*$/;
    if (name === "") {
    	isValid = false;
    }
    else if(!name.match(letters)){
    	isValid = false;
    }
    return isValid;
}

UTIL.validateLastName = function(name) {
	
	var isValid = true;
    var letters = /^[a-zA-Z]*$/;
    if (name === "") {
    	//to accept null values do nothing
    }
    else if(!name.match(letters)){
    	isValid = false;
    }
    return isValid;
}

UTIL.validateEMail = function(email) { 
	var isValid = true;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email === ""){
    	
    }
    else if(!re.test(email)){
    	isValid = false;
    }
    return isValid;
} 

UTIL.validateTableRowSelected = function(that, id) { 
	var isRowSelected = true;
	if (that.getView().byId(id).getSelectedItem() === null) {
		isRowSelected = false;
	}
    return isRowSelected;
}