sap.ui.controller("spatial-demo.bpDetails", {

    // instantiated view will be added to the oViewCache object and retrieved from there
    oViewCache: {},

    onInit: function() {

    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf shine_so.main
     */
    //	onBeforeRendering: function() {
    //
    //	},
    
    onAfterRendering: function() {
        var view = this.getView();
        var addresses = [],
            labels = [],
            bps = [];
        
        // Obtain the default map types from the platform object:
        var defaultLayers = sap.app.platform.createDefaultLayers();
        
        // Instantiate (and display) a map object:
        var map = new H.Map(
            document.getElementById("__splitter0_firstPane"),
            defaultLayers.normal.map,
            {
              zoom: 2,
              center: { lat: 0.0, lng: 0.0 }
        });  
        
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        
        // Create the default UI:
	    var ui = H.ui.UI.createDefault(map, defaultLayers);
	    
        var clusteringProviderTemp = new H.clustering.Provider([], {
          clusteringOptions: {
             minWeight: 1,
             eps: 32
          }
        });
        
        //for distance calculation
         var lati,longi;
         function locationFound(p){
         lati = p.coords.latitude;
         longi = p.coords.longitude;
        }
        function locationNotFound(err){
       // console.log('No location');
      // alert('Please accept to reveal your co-ordinates');
          jQuery.sap.require("sap.ui.commons.MessageBox");
                sap.ui.commons.MessageBox.alert(sap.app.i18n.getText("REVEAL_COORDINATES"),
                    sap.ui.commons.MessageBox.Icon.INFORMATION,
                    sap.app.i18n.getText("LOCREQUIRED"));
    }
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
        }
        else {
            locationNotFound();
        }
        
        /*
         * Function to be called on marker click.
         */
        function onMarkerSelected(label, selectedBP, marker) {
            var bubble =  new H.ui.InfoBubble(marker.getPosition(), {
              // read custom data
              content: label
            });
            // show info bubble
            ui.addBubble(bubble);
            
            // infoBubbles.openBubble(label, marker.coordinate);

            view.bpHeader.setTitle(selectedBP.Name);
            view.bpId.setText(selectedBP.ID);
            view.bpEmail.setText(selectedBP.Email);
            view.bpPhone.setText(selectedBP.Phone);
            view.bpWeb.setText(selectedBP.Web);
        
            view.bpBuildingItem.setValue(selectedBP.Building);
            view.bpStreetItem.setValue(selectedBP.Street);
            view.bpCityItem.setValue(selectedBP.City);
            view.bpCountryItem.setValue(selectedBP.Country);
            view.bpZipItem.setValue(selectedBP.Zip);

            // send event for bp transaction details display
            $.ajax({
                type: "GET",
                async: false,
                url: "/sap/hana/democontent/epm/spatial/services/getBPTransactionData.xsjs?cmd=getData&bpId=" + selectedBP.ID + "&lat=" + selectedBP.lat + "&long=" + selectedBP.long+"&userlat="+lati+"&userlong="+longi,
                success: function(data) {
                    var sales;
                    var oModel = new sap.ui.model.json.JSONModel({});
                    if (!data.salesTotal) {
                        sales = 0;
                    } else {
                        sales = data.salesTotal;
                        // add sales chart
                        oModel.setData(data);
                    }

                    view.oSalesChart.setModel(oModel);
                    view.oSalesChart.bindRows("/salesYoY");
                    oModel.refresh();

                    view.bpHeader.setNumber(sales);
                    view.bpHeader.setNumberUnit(data.currency);
                    //for distance calculation
                    
                    view.bpDistanceItem.setValue(data.distance/1000);
                },
                error: function(err) {
                    alert(err.toString());
                }
            });
        }
        
        // Custom clustering theme description object.
        // Object should implement H.clustering.ITheme interface
        var CUSTOM_THEME = {
          getClusterPresentation: function (cluster) {
            return clusteringProviderTemp.getTheme().getClusterPresentation(cluster);
          },
          getNoisePresentation: function (noisePoint) {
            // Get a reference to data object our noise points
            var data = noisePoint.getData(),
              // Create a marker for the noisePoint
              noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                // Use min zoom from a noise point
                // to show it correctly at certain zoom levels:
                min: noisePoint.getMinZoom()
              });
        
            // Link a data from the point to the marker
            // to make it accessible inside onMarkerClick
            noiseMarker.setData(data);
        
            // Show a bubble on marker click/tap
            noiseMarker.addEventListener("tap", function() {
                    onMarkerSelected(data.$label, data, noisePoint);
            });
        
            return noiseMarker;
          }
        };
        
        $.ajax({
            type: "GET",
            async: false,
            url: "/sap/hana/democontent/epm/spatial/services/getAllBusinessPartnersData.xsjs",
            success: function(data) {
                bps = data.entry;
                for (var i = 0; i < data.entry.length; i++) {
                    labels[i] = data.entry[i].Name;
                    addresses[i] = data.entry[i].Building + ' ' + data.entry[i].Street + ', ' + data.entry[i].Zip + ' ' + data.entry[i].City + ', ' + data.entry[i].Country;
                }
                
                // Create a clustering provider with a custom theme
                var clusteredDataProvider = new H.clustering.Provider([], {
                    clusteringOptions: {
                      // Maximum radius of the neighborhood
                      eps: 64,
                      // minimum weight of points required to form a cluster
                      minWeight: 3
                    },
                    theme: CUSTOM_THEME
                });
                
                for (var z = 0; z < bps.length; z++) {
                    
                    // addMarkerToGroup(group, {lat:parseFloat(bps[z].lat), lng:parseFloat(bps[z].long)}, bps[z].Name);
                    // Create a new marker on the found location
                    // marker = new nokia.maps.map.StandardMarker(
                    //     new nokia.maps.geo.Coordinate(parseFloat(bps[z].lat),
                    //         parseFloat(bps[z].long)));
                    // Add marker to its container so it will be render
                    // addressesContainer.objects.add(marker);
                    var cood = new H.clustering.DataPoint(parseFloat(bps[z].lat),
                        parseFloat(bps[z].long), 1, bps[z]);
    
                    /* We store the address from the location and name of the
                     * Place object in the dataPoint so we can pass the
                     * information to the marker in cluster theme.
                     */
                    bps[z].$address = addresses[z];
                    bps[z].$label = bps[z].Name;
                    clusteredDataProvider.addDataPoint(cood);
                }
    
                // Create a layer that will consume objects from our clustering provider
                var layer = new H.map.layer.ObjectLayer(clusteredDataProvider);
                
                // To make objects from clustering provider visible,
                // we need to add our layer to the map
                map.addLayer(layer);
    
                // show the map and ask user to select a BP
                // map.zoomTo(addressesContainer.getBoundingBox());
                jQuery.sap.require("sap.ui.commons.MessageBox");
                sap.ui.commons.MessageBox.alert(sap.app.i18n.getText("SELECT_BP"),
                    sap.ui.commons.MessageBox.Icon.INFORMATION,
                    sap.app.i18n.getText("TITLE"));
                
            },
            error: function(err) {
                //alert(err.toString());
            }
        });

    }

});