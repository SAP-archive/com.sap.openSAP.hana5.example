package com.sap.refapps;

import java.sql.Connection;
import java.sql.DriverManager;

import org.json.JSONArray;
import org.json.JSONObject;

import com.sap.gateway.v4.rt.cds.edm.CDSEdmProvider;
import com.sap.gateway.v4.rt.xsa.cds.XSACDSEdmProvider;

public class MyEdmProvider extends XSACDSEdmProvider{

		
	public MyEdmProvider() {
		super();
	}
	
	/*
	@Override
	public String getContainerName(){
			return "$container";
		
	}
	
	@Override
	public String getcdsNamespace(){
		return "$namespace";
	}
	
	
	/*
	 * Use this method to override the exposed context.
	 * By default the first contet annotated as 
	 * OData.Publish : true will be exposed as OData 
	@Override
	public String getcdsContext(){
		return "you fully qualified context";
	}
	
	
	//Provide your connection details
	@Override
	public Connection getConnection(){
		Connection conn = null;
		String DB_USERNAME = "";
		String DB_PASSWORD = "";
		String DB_HOST = "";
		String DB_PORT = "";
		
		try{
		JSONObject obj = new JSONObject(System.getenv("VCAP_SERVICES"));
		JSONArray arr = obj.getJSONArray("user-provided");

		DB_USERNAME = arr.getJSONObject(0).getJSONObject("credentials")
				.getString("username");
		DB_PASSWORD = arr.getJSONObject(0).getJSONObject("credentials")
				.getString("password");
		DB_HOST = arr.getJSONObject(0).getJSONObject("credentials")
				.getString("host").split(",")[0];
		DB_PORT = arr.getJSONObject(0).getJSONObject("credentials")
				.getString("port");
		String DB_READ_CONNECTION_URL = "jdbc:sap://" + DB_HOST + ":" + DB_PORT ;
		//Class.forName("com.sap.db.jdbc.Driver");
		conn = (Connection) DriverManager.getConnection(DB_READ_CONNECTION_URL,DB_USERNAME,DB_PASSWORD);
		
			
		}catch(Exception x){
			System.out.println("Connection Error" );
			x.printStackTrace();
			
		}
		
		return conn;
	}
	*/

}
