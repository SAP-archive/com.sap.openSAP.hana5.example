jQuery.sap.declare("sap.shine.esh.util.Helper");

sap.shine.esh.util.Helper = {

    _currentSchemas : [],

    //get the schemas available in an odata service by its url 
	getSchemasByUrl: function(url) {
        var oModel = new sap.ui.model.odata.ODataModel(url, true);
        //TODO: is this still needed for the bp_crm service? if countMode is set to none, the growing-function of the table doesnt work..
        //set the global model 
        sap.ui.getCore().setModel(oModel);
		var oMetadata = oModel.getServiceMetadata();
		return oMetadata.dataServices.schema;
	},

	//get the matching schema-object to the schema that is momentarily selected in the dialog 
	getSelectedSchemaByUrlAndName: function(url, name) {
		var schemaList = helper.getSchemasByUrl(url);

		for (var i = 0; i < schemaList.length; i++) {
			if (schemaList[i].namespace === name) {
				return schemaList[i];
			}
		}
	},

	getSelectedSchemaByView: function(view) {
		var oComponent = view.getController().getOwnerComponent();

		var url = oComponent.getProperty('url');

        if(!this._currentSchemas || this._currentSchemas.length === 0){
            this._currentSchemas = this.getSchemasByUrl(url);
        }

		for (var i = 0; i < this._currentSchemas.length; i++) {
			if (this._currentSchemas[i].namespace === oComponent.getProperty('schema')) {
				return this._currentSchemas[i];
			}
		}
	},

	getSelectedEntitySet: function(view) {
		var oComponent = view.getController().getOwnerComponent();

		var url = oComponent.getProperty('url');

		var schema = this.getSelectedSchemaByView(view);

		var entititySets = schema.entityContainer[0].entitySet;

		for (var i = 0; i < entititySets.length; i++) {
			if (entititySets[i].name === oComponent.getProperty('entitySet')) {
				return entititySets[i];
			}
		}
	},

	//get the matching entitiyType of the selected entitiySet
	getEntityTypeOfEntitySet: function(entititySet){
		var splittedStringArray = entititySet.entityType.split(".");
		var len = splittedStringArray.length;
		return splittedStringArray[len-1];
	},

	getPropertiesOfEntitySet: function(view, entititySet) {
		var oComponent = view.getController().getOwnerComponent();
		var entityType = this.getEntityTypeOfEntitySet(entititySet);

        if(!this._currentSchemas || this._currentSchemas.length === 0){
            this.getSchemasByUrl(oComponent.getProperty('url'));
        }

        var schemas = this._currentSchemas;
		var properties = [];

		//go through all schemas
		for (var i = 0; i < schemas.length; i++) {

			//if schema has entity types
			if(schemas[i].entityType){

				//go through all entitiy types
				for (var j = 0; j < schemas[i].entityType.length; j++) {
					var currentET = schemas[i].entityType[j];

					//if the current entityType matches the entityType of theentitySet
					if(currentET.name===entityType){
						return currentET.property;
					}
				}
			}
		}
	},

	//check if given string only contains a-z / 0-9
	isAlphanumeric: function(string) {
		if (!/^[a-z0-9]+$/i.test(string)) {
			return true;
		}
		return false;
	},

	//remove spaces from a string
	removeSpaces: function(string) {
		return string.replace(/ /g, "");
	},
	
    _cleanUpFacets : function(facets){
        for(var i=0; i<facets.length; i++){
            var facet = facets[i];
            for(var j=0; j<facet.Items.length; j++){
                var value = facet.Items[j];
                var keys = Object.keys(value);
                for(var z=0; z<keys.length; z++){
                    if (keys[z].indexOf('@com.sap.vocabularies.Common.v1.Label') >= 0) {
                        value['Label'] = value[keys[z]];
                    }
                }
            }
        }
        return facets;
    },
    _getControlId:function(view, id){
        return view.createId(view.getController().getOwnerComponent().getProperty('ID') + '-' + id);
    },

    fillFacets : function(data, view, checkedFacets){
        if(data !== undefined){

            var facetContainer = sap.ui.getCore().byId(this._getControlId(view, 'facetList'));
            var facet = sap.ui.getCore().byId(this._getControlId(view, 'facet'));
            var facets = this._cleanUpFacets(data);
            var model = new sap.ui.model.json.JSONModel({facets:facets});
            facetContainer.setModel(model, 'facets');

            facetContainer.bindItems({
                path: 'facets>/facets',
                template: facet
            });

            var facetListItems = facetContainer.getItems();
			//re-select the facets that were selected before the rebind
			for (var k = 0; k < checkedFacets.length; k++) {
				for (var i = 0; i < facetListItems.length; i++) {
					var subList = facetListItems[i];
					var subListItems = subList.getContent()[1].getItems();

					for (var j = 0; j < subListItems.length; j++) {
						var value = subListItems[j].getLabel();
						value = value.split("(")[0].trim();
						if(value === checkedFacets[k]){
							subListItems[j].getContent()[0].setSelected(true);
						}
					}
				}
			}
        }
    },

    _getCurrentViewId : function(id){
        return id.substr(0, id.lastIndexOf('-'));
    }

};
