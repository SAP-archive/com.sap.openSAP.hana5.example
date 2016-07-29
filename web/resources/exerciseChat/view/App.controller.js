/*eslint no-unused-vars: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.controller("sap.xs.chat.view.App", {

            onInit : function(){
				

                this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode

      			// connection opened 
      			connection.attachOpen(function (oControlEvent) {
        			sap.m.MessageToast.show("connection opened");
      			}); 

      			// server messages
      			connection.attachMessage(function (oControlEvent) {
      				var oModel = sap.ui.getCore().getModel("chatModel");
      				var result = oModel.getData();

       				var data = jQuery.parseJSON(oControlEvent.getParameter("data"));
        			msg = data.user + ": " + data.text,
        			lastInfo = result.chat;
        
       				if (lastInfo.length > 0){ lastInfo += "\r\n"; }   
       				oModel.setData({chat: lastInfo + msg}, true); 
         
       				// scroll to textarea bottom to show new messages
       				$("#app--chatInfo-inner").scrollTop($("#app--chatInfo-inner")[0].scrollHeight);
     			});
      
      			// error handling
      			connection.attachError(function (oControlEvent) {
        			sap.m.MessageToast.show("Websocket connection error" );
      			}); 
       
      			// onConnectionClose
      			connection.attachClose(function (oControlEvent) {
        			sap.m.MessageToast.show("Websocket connection closed");
      			});    

      			sap.ui.getCore().byId("app--message").onsapenter = function(e) { 
      				if (sap.m.InputBase.prototype.onsapenter) {  
     					 sap.m.InputBase.prototype.onsapenter.apply(this, arguments);  
  					}  
      				var oController = sap.ui.getCore().byId("app").getController();
      				oController.sendMsg();
      			};     				
            },
            
            // send message
      		sendMsg: function() {
      			var oModel = sap.ui.getCore().getModel("chatModel");
      			var result = oModel.getData();
       			var msg = result.chat;
       			if (msg.length > 0) {
        			connection.send(JSON.stringify(
         				{user: result.user, text: result.message}
        			));
        	    oModel.setData({message: ""}, true);
       			}     
      		},

			onErrorCall: function(oError){
			    if(oError.response.statusCode === 500 || oError.response.statusCode === 400){
	   	   	 		     var errorRes = JSON.parse(oError.response.body);
                        sap.m.MessageBox.alert(errorRes.error.message.value);
	   		    		return;	
	   	   	 	 }
	   	   	  	 else{
	   			         sap.m.MessageBox.alert(oError.response.statusText); 
	   		    		return;	
	   	   	 	 }
			}
});
