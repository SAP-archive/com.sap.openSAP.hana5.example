 sap.ui.controller("spatial-demo.sales-analysis", {

     onInit: function() {
         var controller = this;
         controller.isPolygonDisplayed = false;
     },

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
        var view = this.getView();
        var polyLineStrip, polyLine;
        var polyLineGroup = new H.map.Group();
        
        // Create the svg mark-up
        var svgMarkup = '<svg  width="30" height="30" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="15" cy="15" r="10" stroke="black" stroke-width="5" fill="white" />' +
          '</svg>';
        var polyLineIcon = new H.map.Icon(svgMarkup);
        
        // Obtain the default map types from the platform object:
        var defaultLayers = sap.app.platform.createDefaultLayers();
        
        // Instantiate (and display) a map object:
        oController.map = new H.Map(
            document.getElementById("__splitter1_firstPane"),
            defaultLayers.normal.map,
            {
              zoom: 5,
              center: { lat: 50.5, lng: 3.4 }
        });  
        oController.map.addObject(polyLineGroup);
        
        // Attach an event listener to map display
        // obtain the coordinates and display in an alert box.
        oController.map.addEventListener('tap', function (evt) {
            
            // if (!evt.target instanceof H.map.Marker) {
                var coord = oController.map.screenToGeo(evt.currentPointer.viewportX,
                        evt.currentPointer.viewportY);
                var length = polyLineGroup.getObjects().length;
                if (!polyLineStrip && length == 1) {
                    polyLineStrip = new H.geo.Strip();
                    polyLineStrip.pushPoint(polyLineGroup.getObjects()[0].getPosition());
                    polyLineStrip.pushPoint(coord);
                    polyLine = new H.map.Polyline(
                        polyLineStrip, { style: { lineWidth: 4 }}
                    );
                    oController.map.addObject(polyLine);
                } else if (length > 1) {
                    polyLineStrip.pushPoint(coord);
                    polyLine.dispose();
                    polyLine = new H.map.Polyline(
                        polyLineStrip, { style: { lineWidth: 4 }}
                    );
                    oController.map.addObject(polyLine);
                }
                
                // Add the first marker
                var polyLineMarker = new H.map.Marker(coord,
                      {icon: polyLineIcon});
                polyLineGroup.addObject(polyLineMarker);
                
                if (polyLineGroup.getObjects().length == 1) {
                    polyLineMarker.addEventListener("tap", function(){
                        polyLineStrip.pushPoint(this.getPosition());
                        oController.polygon = new H.map.Polygon(polyLineStrip, {
                              style: {
                                strokeColor: '#00f',
                                lineWidth: 8
                              }
                            });
                        oController.map.addObject(oController.polygon);
                        oController.isPolygonDisplayed = true;
                        oController.bpMarkers.removeAll();
                        
                        // construct payload
                        var payload = {};
                        payload.points = [];
                        
                        var eachFn = function(lat, lng, alt, idx) {
                            //console.log("point", idx + ":", lat, lng, alt);
                            payload.points.push({
                                lat: lat,
                                long: lng
                            });
                        }
                        polyLineStrip.eachLatLngAlt(eachFn);
                        oController.sendRequest(oController, payload);
                        
                        polyLine.dispose();
                        polyLineGroup.removeAll();
                        // polyLineStrip.dispose();
                        polyLineStrip = null;
                    });
                }
            // }
        });
        
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(oController.map));
        
        // Create the default UI:
	    oController.ui = H.ui.UI.createDefault(oController.map, defaultLayers);    
        
        var oDialog1 = new sap.ui.commons.Dialog();
         oDialog1.setTitle(sap.app.i18n.getText("TITLE"));
         var oText = new sap.ui.core.HTML({
             content: sap.app.i18n.getText("INIT_HELP")
         });
         oDialog1.addContent(oText);
         oDialog1.addButton(new sap.ui.commons.Button({
             text: sap.app.i18n.getText("OK"),
             press: function() {
                 oDialog1.close();
             }
         }));
         oDialog1.open();
         
         oController.bpMarkers = new H.map.Group();
         oController.map.addObject(oController.bpMarkers);

         oController.map.addEventListener("mapviewchangeend", function(event) {

             // exclude invalid request
             // exclude if user has drawn a polygon
             if (oController.map.getViewBounds().getTopLeft().lat == oController.map.getViewBounds().getBottomRight().lat || oController.isPolygonDisplayed) {
                 return;
             }

             // make request for sales analysis for this area
             oController.getSalesAnalysisForArea(oController, view);
         });
     },
     
     /**
      * Add data to the map.
      * Mark customers and fill up the sales data.
      */
     addDataToMap: function(data, view, oController) {
         // remove customer markers from the map
         if (oController.bpMarkers) {
             oController.bpMarkers.removeAll();
         }

         view.bpHeader.setNumber(data.totalSales);

         var oModel = new sap.ui.model.json.JSONModel({});
         oModel.setData(data);

         view.oSalesChart.setModel(oModel);
         if (data && data.salesYoY.length > 0) {
             view.oSalesChart.bindRows("/salesYoY");
         } else {
             view.oSalesChart.unbindRows();
             view.oSalesChart.rerender();
         }

         // add details for top customers
         for (var j = 0; j < data.topBuyers.length; j++) {
             view.oCustomerItems[j].setTitle(data.topBuyers[j].companyName + ' ' + data.topBuyers[j].legalForm);
             view.oCustomerItems[j].setNumber(data.topBuyers[j].totalSales);
             view.oCustomerItems[j].setNumberUnit("EUR");
             view.oCustomerItems[j].attr.setText(data.topBuyers[j].partnerID);

             // plot this customer on the map
             // Create a new marker on the location
             var custMarker = new H.map.Marker({lat:parseFloat(data.topBuyers[j].lat), lng:parseFloat(data.topBuyers[j].long)});
            var addedCoords = [];
             
             
            // add event listeners for bpmarkers
            custMarker.addEventListener("tap", function(evt) {
                 var marker = evt.target;
                 evt.stopPropagation();
    
                     if (oController.oSalesChart) {
                         oController.oSalesChart.destroy();
                     }
    
                     oController.oSalesChart = new sap.makit.Chart({
                         type: sap.makit.ChartType.Column,
                         width: "300px",
                         height: "175px",
                         showRangeSelector: false,
                         showTableValue: true,
                         category: new sap.makit.Category({
                             column: "YEAR",
                             displayName: sap.app.i18n.getText("YEAR")
                         }),
                         values: [new sap.makit.Value({
                             expression: "AMOUNT",
                             format: "rounded2",
                             displayName: sap.app.i18n.getText("AMOUNT")
                         })],
                     });
    
                     oController.oSalesChart.addColumn(new sap.makit.Column({
                         name: "YEAR",
                         value: "{year}"
                     }));
                     oController.oSalesChart.addColumn(new sap.makit.Column({
                         name: "AMOUNT",
                         value: "{amount}"
                     }));
                    
                    var bubbles = oController.ui.getBubbles();
                    if (bubbles && bubbles.length > 0) {
                        var count;
                        for (count = 0; count < bubbles.length; count++) {
                            //bubbles[count].dispose();
                            oController.ui.removeBubble(bubbles[count]);
                        }
                    }
    
                    // Set the tail of the bubble to the coordinate of the marker
                    var bubble =  new H.ui.InfoBubble(marker.getPosition(), {
                      // read custom data
                      content:  '<div>' +
                         '<h3>' + marker.getData().companyName + ' ' + marker.getData().legalForm + '</h3>' +
                         '<div id=\'chartHolder\'></div></div>'
                    });
                    // show info bubble
                    oController.ui.addBubble(bubble);
    
                     // send event for bp transaction details display
                     $.ajax({
                         type: "GET",
                         async: true,
                         url: "/sap/hana/democontent/epm/spatial/services/getBPTransactionData.xsjs?cmd=getData&bpId=" + marker.getData().partnerID,
                         success: function(data) {
                             var oModel = new sap.ui.model.json.JSONModel({});
                             oModel.setData(data);
    
                             oController.oSalesChart.setModel(oModel);
                             oController.oSalesChart.bindRows("/salesYoY");
    
                             // remove old chart
                             $("#chartHolder").html("");
    
                             oController.oSalesChart.placeAt('chartHolder');
                         },
                         error: function(err) {
                                            }
                     });
    
                 
             });

             // Add marker to its container so it will be render
             oController.bpMarkers.addObject(custMarker);

             /* We store the partnerID of the customer
              * Place object in the marker so we can create an infoBubble
              * with this information on click.
              */
             custMarker.setData(data.topBuyers[j]);
         }

         // reset texts in empty items
         for (; j < 5; j++) {
             view.oCustomerItems[j].setTitle("");
             view.oCustomerItems[j].setNumber("");
             view.oCustomerItems[j].setNumberUnit("");
             view.oCustomerItems[j].attr.setText("");
         }
     },

     /**
      * make sales analysis request for area
      */
     getSalesAnalysisForArea: function(oController, view) {

         // construct payload
         var payload = {};
         payload.points = [];
         // top left
         payload.points.push({
             lat: oController.map.getViewBounds().getTopLeft().lat,
             long: oController.map.getViewBounds().getTopLeft().lng
         });
         // top right
         payload.points.push({
             lat: oController.map.getViewBounds().getTopLeft().lat,
             long: oController.map.getViewBounds().getBottomRight().lng
         });
         // bottom right
         payload.points.push({
             lat: oController.map.getViewBounds().getBottomRight().lat,
             long: oController.map.getViewBounds().getBottomRight().lng
         });
         // bottom left
         payload.points.push({
             lat: oController.map.getViewBounds().getBottomRight().lat,
             long: oController.map.getViewBounds().getTopLeft().lng
         });
         // top left
         payload.points.push({
             lat: oController.map.getViewBounds().getTopLeft().lat,
             long: oController.map.getViewBounds().getTopLeft().lng
         });

         oController.sendRequest(oController, payload);
     },
     
     sendRequest: function(oController, payload) {
        // handle xsrf token
         // first obtain token using Fetch
         var xsrf_token;
         $.ajax({
             type: "GET",
             async: false, // request has to synchronous
             url: "/sap/hana/democontent/epm/services/soCreate.xsodata",
             contentType: "application/json",
             headers: {
                 'x-csrf-token': 'Fetch'
             },
             success: function(data, textStatus, request) {
                 xsrf_token = request.getResponseHeader('x-csrf-token');
             }
         });

         // add x-csrf-token in headers

         // make the request to get the information
         $.ajax({
             type: "POST",
             data: JSON.stringify(payload),
             headers: {
                 'x-csrf-token': xsrf_token
             }, // add header to send x-csrf-token with this request
             async: true,
             url: "/sap/hana/democontent/epm/spatial/services/getSalesAnalysis.xsjs",
             success: function(data) {
                 oController.addDataToMap(data, oController.getView(), oController);
             },
             error: function(err) {

             }
         }); 
     },

     /** function to remove polygon **/
     removePolygon: function(oController) {

         if (oController.isPolygonDisplayed) {

             // remove polygon instance from map
             if (oController.map) {
                 oController.map.removeObject(oController.polygon);
             }

             // remove customer markers from the map
             if (oController.bpMarkers) {
                 oController.bpMarkers.removeAll();
             }

             // reset flag
             oController.isPolygonDisplayed = false;

             // make request for sales analysis for this area
             oController.getSalesAnalysisForArea(oController, oController.getView());
         }
     }

 });