jQuery.sap.require("sap.shine.esh.util.Helper");

sap.ui.controller("sap.shine.esh.view.servicePage", {

    //property to check if the table on this service page was already filled
    tableFilled: false,

    onInit: function() {
        this.fillTable();
    },
    
    onAfterRendering: function(){
    	
    	if(!this.infoPopover){
    		this.infoPopover = sap.ui.xmlfragment("fragment.infoPopover", this);
    	}
    	
    },

    handleSearch: function(evt){
    	this.clearCheckedFacets();
        this.search(evt);
    },
    
    handleInfoPopover:function(evt){
    	var that = this;
    	if(!that.infoPopover){
    		that.infoPopover = sap.ui.xmlfragment("fragment.infoPopover", this);
    	}
    	that.infoPopover.openBy(evt.getSource());
    },

    //creates columns for every property of the entityTyoe and adds them to the table
    //also returns the cell-templates for the content in the colums
    getDataBindingCells: function(properties, resultTable) {
        var dataBindingCells = [];

        for (var i = 0; i < properties.length; i++) {
            var col = new sap.m.Column({
                header: new sap.m.Text({
                    text: properties[i].name,
                    maxLines: 2
                }),

            });
            //show less columns if the screen size is smaller than a desktop
            if (i > 4) {
                col.setMinScreenWidth(sap.m.ScreenSize.Tablet);
            }
            //show even less columns if the screen size is smaller than a tablet
            if (i > 6) {
                col.setMinScreenWidth(sap.m.ScreenSize.Desktop);
            }

            resultTable.addColumn(col);

            var text;

            if (properties[i].name === "TEXT@com.sap.vocabularies.Search.v1.Highlighted") {
                text = properties[i]["TEXT@com.sap.vocabularies.Search.v1.Highlighted"];
            } else {
                text = properties[i].name;
            }

            var cell = new sap.m.Text({
                text: "{" + text + "}"
            });
            dataBindingCells.push(cell);
        }

        return dataBindingCells;
    },

    fillTable: function() {

        //if table is already filled, dont fill it again
        if (this.tableFilled) {
            return;
        }

        var that = this;
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();

        var helper = sap.shine.esh.util.Helper;
        helper._currentSchemas = [];

        //get the properties
        var entitySet = helper.getSelectedEntitySet(view);
        var properties = helper.getPropertiesOfEntitySet(view, entitySet);

        //fill the sort selector with the available properties
        this.fillSortBySelector(properties);

        var resultList = this.byId(oComponent.getProperty('ID') + "-resultList");
        var resultTable = this.byId(oComponent.getProperty('ID') + "-resultTable");
        var oModel = sap.ui.getCore().getModel();

        //result table data binding
        resultTable.bindItems({
            path: "/" + oComponent.getProperty('entitySet'),
            template: new sap.m.ColumnListItem({
                cells: that.getDataBindingCells(properties, resultTable)
            }),
            parameters: {
                custom: {
                    facets: 'all'
                }
            },
            events: {
                dataReceived: function(evt) {
                    helper.fillFacets(evt.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"], view, that.getCheckedFacets());

                }
            }
        });
        resultTable.setModel(oModel);

        this.tableFilled = true;
    },

    //fills the sort by selector with the properties of the selected entitiySet
    fillSortBySelector: function(properties) {
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();

        var startItem = new sap.ui.core.Item({
            text: "Sort by:",
            enabled: false
        });
        this.byId(oComponent.getProperty('ID') + "sortBySelector").addItem(startItem);

        for (var i = 0; i < properties.length; i++) {
            var item = new sap.ui.core.Item({
                text: properties[i].name,
                key: "sortItemItem" + i
            });
            this.byId(oComponent.getProperty('ID') + "sortBySelector").addItem(item);
        }

        this.byId(oComponent.getProperty('ID') + "sortBySelector").setSelectedItem(startItem);
    },

    //switches the view between resultTable and facets
    switchControls: function(evt) {
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();

        var table = this.byId(oComponent.getProperty('ID') + "-resultTable");
        var facets = this.byId(oComponent.getProperty('ID') + "-facetList");

        var displayTable = false;
        var displayFacets = false;

        var selectedButton = evt.getParameters().id;
        if (selectedButton.indexOf("table") > -1) {
            displayTable = true;
            displayFacets = false;
        }

        if (selectedButton.indexOf("facets") > -1) {
            displayTable = false;
            displayFacets = true;
        }

        facets.setLayoutData(new sap.ui.layout.GridData({
            span: "L3 M3 S12",
            visibleOnSmall: displayFacets,
        }));

        table.setLayoutData(new sap.ui.layout.GridData({
            span: "L9 M9 S12",
            visibleOnSmall: displayTable,
        }));
    },

    getFilter: function(path, value) {
        var formattedPath = path.replace("Count by", "").trim();

        var formattedValue = value.split("(")[0].trim();

        var filter = new sap.ui.model.Filter(formattedPath, "EQ", formattedValue);

        return filter;
    },

    //filters the results in the table when a facet is clicked
    //does not work yet
    filterByFacet: function() {
        //get text next to the checkbox for filtering
        var that = this;

        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();
        var helper = sap.shine.esh.util.Helper;


        var searchBar = this.byId(oComponent.getProperty('ID') + "searchBar");
        var searchTerm = searchBar.getValue();
        var table = this.byId(oComponent.getProperty('ID') + "-resultTable");
        var entitySet = helper.getSelectedEntitySet(view);
        var properties = helper.getPropertiesOfEntitySet(view, entitySet);

        var filterList = [];
        var facetListItems = this.byId(oComponent.getProperty('ID') + "-facetList").getItems();

        //iterate over all checkboxes & create filter for every ACTIVE checkbox
        for (var i = 0; i < facetListItems.length; i++) {
            var subList = facetListItems[i];

            var path = subList.getContent()[0].getText();
            var subListItems = subList.getContent()[1].getItems();

            for (var j = 0; j < subListItems.length; j++) {
                var value = subListItems[j].getLabel();
                var isChecked = subListItems[j].getContent()[0].getSelected();
                if (isChecked) {
                    var filter = that.getFilter(path, value);
                    filterList.push(filter);
                }
            }
        }

        //rebind the table with the applied filters
        if (searchTerm !== "") {
            table.destroyColumns();
            table.bindItems({
                path: "/" + oComponent.getProperty('entitySet'),
                template: new sap.m.ColumnListItem({
                    cells: that.getDataBindingCells(properties, table)
                }),
                parameters: {
                    custom: {
                        facets: 'all',
                        search: searchTerm
                    }
                },
                events: {
                    dataReceived: function(evt) {
                        helper.fillFacets(evt.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"], that.getView(), that.getCheckedFacets());
                    }
                },
                filters: filterList
            });
        } else {
            table.destroyColumns();
            table.unbindAggregation("items");
            table.bindItems({
                path: "/" + oComponent.getProperty('entitySet'),
                template: new sap.m.ColumnListItem({
                    cells: that.getDataBindingCells(properties, table)
                }),
                parameters: {
                    custom: {
                        facets: 'all',

                    }
                },
                events: {
                    dataReceived: function(evt) {
                        helper.fillFacets(evt.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"], that.getView(), that.getCheckedFacets());
                        this.handleSortChange();
                    }
                },
                filters: filterList
            });
        }
    },

    getCheckedFacets: function() {
        var filterList = [];
        //iterate over all checkboxes & create filter for every ACTIVE checkbox
        var that = this;
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();
        var facetListItems = this.byId(oComponent.getProperty('ID') + "-facetList").getItems();

        for (var i = 0; i < facetListItems.length; i++) {
            var subList = facetListItems[i];

            var subListItems = subList.getContent()[1].getItems();

            for (var j = 0; j < subListItems.length; j++) {
                var value = subListItems[j].getLabel();
                value = value.split("(")[0].trim();
                var isChecked = subListItems[j].getContent()[0].getSelected();
                if (isChecked) {
                    filterList.push(value);
                }
            }
        }
        return filterList;
    },

    clearCheckedFacets: function() {
        var filterList = [];
        //iterate over all checkboxes & create filter for every ACTIVE checkbox
        var that = this;
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();
        var facetListItems = this.byId(oComponent.getProperty('ID') + "-facetList").getItems();

        for (var i = 0; i < facetListItems.length; i++) {
            var subList = facetListItems[i];

            var subListItems = subList.getContent()[1].getItems();

            for (var j = 0; j < subListItems.length; j++) {
                var value = subListItems[j].getLabel();
                value = value.split("(")[0].trim();
                var isChecked = subListItems[j].getContent()[0].getSelected();
                if (isChecked) {
                    subListItems[j].getContent()[0].setSelected(false);

                }
            }
        }
        return filterList;
    },

    //searches the result table for the text in the searchbar
    //only works on bp_crm/bestvine
    search: function(evt) {
        var searchVal = evt.getSource().getValue();
        var helper = sap.shine.esh.util.Helper;
        var that = this;
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();
        var entitySet = helper.getSelectedEntitySet(view);
        var properties = helper.getPropertiesOfEntitySet(view, entitySet);
        var resultTable = this.byId(oComponent.getProperty('ID') + "-resultTable");

        //clear the table
        resultTable.destroyColumns();
        if (searchVal === "") {
            searchVal = "*";
        }
        //re-bind items, this time with url-parameter "search=textInTheSearchBar"
        resultTable.bindItems({
            path: "/" + oComponent.getProperty('entitySet'),
            template: new sap.m.ColumnListItem({
                cells: that.getDataBindingCells(properties, resultTable)
            }),
            parameters: {
                custom: {
                    search: searchVal,
                    facets: 'all',

                }
            },
            events: {
                dataReceived: function(evt) {
                    if (evt.mParameters.data) {
                        helper.fillFacets(evt.mParameters.data["@com.sap.vocabularies.Search.v1.Facets"], that.getView(), that.getCheckedFacets());
                    } else {
                        helper.fillFacets([], that.getView(), []);
                    }
                }
            }
        });
    },

    //gets triggered whenever the sort selector changes
    handleSortChange: function() {
        var view = this.getView();
        var oComponent = view.getController().getOwnerComponent();
        var table = this.byId(oComponent.getProperty('ID') + "-resultTable");
        var binding = table.getBinding("items");

        //isChecked defines if the sort should be ascending or descending
        var isChecked = false;

        var selectedButton = this.byId(oComponent.getProperty('ID') + "-ascDscSegButtons").getSelectedButton();

        if (this.byId(selectedButton).getText() === "Descending") {
            isChecked = true;
        } else {
            isChecked = false;
        }

        //get selected property
        var path = this.byId(oComponent.getProperty('ID') + "sortBySelector").getSelectedItem().getText();
        //dont sort if no real property is selected
        if (path === "Sort by:") {
            return;
        }

        //create sorter with the right path and the boolean if asc/desc
        var sorter = new sap.ui.model.Sorter(path, isChecked);

        //sort the table
        binding.sort(sorter);

    }
});