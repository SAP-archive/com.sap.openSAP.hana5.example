/*
package com.company.test.java.test.extensiontemplate;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.olingo.commons.api.data.ComplexValue;
import org.apache.olingo.commons.api.data.Entity;
import org.apache.olingo.commons.api.data.EntityCollection;
import org.apache.olingo.commons.api.data.Property;
import org.apache.olingo.commons.api.data.ValueType;
import org.apache.olingo.commons.api.edm.EdmPrimitiveTypeKind;
import org.apache.olingo.commons.api.edm.provider.CsdlAction;
import org.apache.olingo.commons.api.edm.provider.CsdlFunction;
import org.apache.olingo.commons.api.edm.provider.CsdlOperation;
import org.apache.olingo.commons.api.edm.provider.CsdlParameter;
import org.apache.olingo.commons.api.edm.provider.CsdlReturnType;
import org.apache.olingo.server.api.ODataApplicationException;
import org.apache.olingo.server.api.uri.UriInfo;
import org.apache.olingo.server.api.uri.UriParameter;
import org.apache.olingo.server.api.uri.UriResource;
import org.apache.olingo.server.api.uri.UriResourceFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.gateway.v4.rt.api.extensions.DataProviderExtensionContext;
import com.sap.gateway.v4.rt.api.extensions.ExtendDataProvider;
import com.sap.gateway.v4.rt.api.extensions.ExtendMetadata;
import com.sap.gateway.v4.rt.api.extensions.ExtensionContext;
import com.sap.gateway.v4.rt.cds.api.CDSDSParams;

//This class contains examples for how to write actions and functions in metadata
//It also demonstrates how to write implementation for actions and functions
//This is just a sample and will not work out of the box

public class MetadataExtensionSample {

	final Logger logger = LoggerFactory.getLogger(MetadataExtensionSample.class);

	//This method explains how to extend a service with namsepace of the schema
	@ExtendMetadata(serviceName="product_sales")
	public List<CsdlOperation> OperationsonProducts() throws ODataApplicationException {
		List<CsdlOperation> operations = new ArrayList<CsdlOperation>();

		CsdlFunction function = new CsdlFunction();
		function.setName("getProductsforCategoryID")
		.setParameters(Arrays.asList(new CsdlParameter().setName("CatID").setType(EdmPrimitiveTypeKind.Int32.getFullQualifiedName())))
		.setReturnType(new CsdlReturnType().setType(EdmPrimitiveTypeKind.String.getFullQualifiedName()).setCollection(true));

		operations.add(function);

		CsdlAction action = new CsdlAction();
		action.setName("addCategory");

		operations.add(action);

		return operations;
	}

	//This method explains how to write the login for the function getProductsforCategoryID
	//This function returns primitive collection
	@ExtendDataProvider(operationName = "getProductsforCategoryID")
	public void getProducts(ExtensionContext ectx) throws ODataApplicationException {
		logger.debug("inside function getProductsforCategoryID");
		Connection conn = null;
		try {
			conn = ((CDSDSParams)ectx.getDSParams()).getConnection();
			DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
			UriInfo ui = dpCtx.getUriInfo();
			//Reading parameter information from the URI
			UriResourceFunction uriResourceAction = (UriResourceFunction) ui.getUriResourceParts().get(0);
			int catId = Integer.parseInt(uriResourceAction.getParameters().get(0).getText());
			PreparedStatement stmt = conn.prepareStatement("SELECT \"name\" FROM \"CD7E1A311A95420DAA1D077EE6433CE9\".\"product_sales.products\" where \"category.id\" = ?");
			stmt.setInt(1, catId);
			ResultSet rs = stmt.executeQuery();
			ArrayList<String> productNames = new ArrayList<String>();	
			while(rs.next())
				productNames.add(rs.getString("name"));

			//creating a primitive collection
			Property p  = new  Property(null,"ProductNames",ValueType.COLLECTION_PRIMITIVE,productNames);
			//setting the result
			dpCtx.setResult(p);
		}
		catch(Exception e){
			logger.info("error in executing the function");
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) 
					{e.printStackTrace();}
			}}
		logger.debug("function executed successfully");
	}

	//This method contains the implementation of the action
	//This action doesn't return anything
	@ExtendDataProvider(operationName = "addCategory")
	public void addNewCategory(ExtensionContext ectx) throws ODataApplicationException {
		Connection conn = null;
		logger.debug("inside action addCategory");
		try {
			conn = ((CDSDSParams)ectx.getDSParams()).getConnection();
			DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
			//getting the post body for the action
			InputStream is = dpCtx.getODataRequest().getBody();
			//JSON parsing the request body
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode rootNode = objectMapper.readTree(is);
			PreparedStatement stmt = conn.prepareStatement("INSERT INTO \"CD7E1A311A95420DAA1D077EE6433CE9\".\"product_category.category\" values(?,?,?,?)");
			stmt.setInt(1, rootNode.get("id").asInt());
			stmt.setString(2,rootNode.get("name").asText());
			stmt.setString(3, rootNode.get("short").asText());
			stmt.setString(4, rootNode.get("long").asText());
			stmt.executeUpdate();
		}
		catch(Exception e){
			logger.error("error in executing the action add Category",e);
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) 
					{e.printStackTrace();}
			}}
		logger.debug("action add Category executed successfully");
	}


	//Some more actions and functions definition
	@ExtendMetadata(serviceName="product_category")
	public List<CsdlOperation> createFunc1() throws ODataApplicationException {

		final List<CsdlOperation> operations = new ArrayList<CsdlOperation>();

		final CsdlReturnType returnType = new CsdlReturnType();
		returnType.setCollection(true);
		returnType.setType("product_category.category");

		// Create the function
		final CsdlFunction function = new CsdlFunction();
		function.setName("categoriesfunccoll")
		.setReturnType(returnType);

		operations.add(function);

		return operations;
	}

	//Some more actions and function with the annotation without serviceName. The actions and functions are added to all schema.
	//This function returns and entity type
	@ExtendMetadata
	public List<CsdlOperation> createmorefuncs() throws ODataApplicationException {

		final List<CsdlOperation> operations = new ArrayList<CsdlOperation>();

		// Create the return type of the function
		final CsdlReturnType returnType = new CsdlReturnType();
		returnType.setType("category");

		// Create the function
		final CsdlFunction function = new CsdlFunction();
		function.setName("categoriesfuncentity")
		.setReturnType(returnType);
		operations.add(function);

		return operations;
	}

	//Some actions to demonstrate various return types
	@ExtendMetadata
	public List<CsdlOperation> createmoreactions() throws ODataApplicationException {

		final List<CsdlOperation> operations = new ArrayList<CsdlOperation>();

		//action returning primitive type
		final CsdlAction actionprim = new CsdlAction();
		final CsdlReturnType returnTypeprim = new CsdlReturnType();
		returnTypeprim.setType(EdmPrimitiveTypeKind.Int32.getFullQualifiedName());
		actionprim.setName("actionprim").setReturnType(returnTypeprim);

		//action returning primitive collection
		final CsdlAction actionprimcol = new CsdlAction();
		final CsdlReturnType returnTypeprimcol = new CsdlReturnType();
		returnTypeprimcol.setCollection(true);
		returnTypeprimcol.setType(EdmPrimitiveTypeKind.Int32.getFullQualifiedName());
		actionprimcol.setName("actionprimcol").setReturnType(returnTypeprimcol);

		//action returning primitive type
		final CsdlAction actioncomplex = new CsdlAction();
		final CsdlReturnType returnTypecomplex = new CsdlReturnType();
		returnTypecomplex.setType("product_details.description");
		actioncomplex.setName("actioncomplex").setReturnType(returnTypecomplex);

		//action returning primitive type
		final CsdlAction actioncomplexcoll = new CsdlAction();
		final CsdlReturnType returnTypecomplexcoll = new CsdlReturnType();
		returnTypecomplexcoll.setType("product_details.description").setCollection(true);
		actioncomplexcoll.setName("actioncomplexcoll").setReturnType(returnTypecomplexcoll);

		operations.add(actionprim);
		operations.add(actionprimcol);
		operations.add(actioncomplex);
		operations.add(actioncomplexcoll);
		return operations;
	}


	//Sample code of function which return entity collection
	@ExtendDataProvider(serviceName = "product_category", operationName = "categoriesfunccoll")
	public void getcategories(ExtensionContext ectx) throws ODataApplicationException {
		logger.info("inside function");
		try {
			Connection conn = ((CDSDSParams)ectx.getDSParams()).getConnection();
			DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
			PreparedStatement stmt = conn.prepareStatement("SELECT * FROM \"product_category.category\"");
			ResultSet rs = stmt.executeQuery();
			EntityCollection result = rs.next()?createEntityCollectionFromResultSet(rs):null;
			//api to set entity collection result
			dpCtx.setResultEntityCollection(result);
		}
		catch(SQLException sqlE){
			sqlE.printStackTrace();
		}

		logger.info("function execution successfull");
	}

	//Sample code which returns entity
	@ExtendDataProvider(serviceName = "product_category", operationName = "categoriesfuncentity")
	public void getcategoriescollection(ExtensionContext ectx) throws ODataApplicationException {
		try {
			Connection conn = ((CDSDSParams)ectx.getDSParams()).getConnection();
			DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
			UriInfo ui = dpCtx.getUriInfo();
			final UriResource firstSegment = ui.getUriResourceParts().get(0);
			final UriResourceFunction uriResourceFunction = (UriResourceFunction) firstSegment;
			final UriParameter parameterAmount = uriResourceFunction.getParameters().get(0);
			//reading from URI parameters
			int amount = Integer.parseInt(parameterAmount.getText());
			PreparedStatement stmt = conn.prepareStatement("SELECT * FROM \"product_category.category\" WHERE \"amount\" = ?");
			stmt.setInt(1, amount);
			ResultSet rs = stmt.executeQuery();
			Entity result = rs.next()?createEntityFromResultSet(rs):null;
			//api to set entity result
			dpCtx.setResultEntity(result);
		}
		catch(SQLException sqlE){
			sqlE.printStackTrace();
		}
	}

	//This action doesn't return anything. The user can do anything
	@ExtendDataProvider(operationName = "action_noreturn")
	public void action_noreturn(ExtensionContext ectx) throws ODataApplicationException {
		logger.info("Inside action which does not return anything");
	}

	//This action return a primitive type
	@ExtendDataProvider(operationName = "actionprim")
	public void actionprimitive(ExtensionContext ectx) throws ODataApplicationException {
		System.out.println("in extension action_prim");
		DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
		//api to set any type
		dpCtx.setResult(new Property(null,"prop1",ValueType.PRIMITIVE,1));
	}

	//This action returns a primitive collection
	@ExtendDataProvider(operationName = "actionprimcol")
	public void actionprimitivecol(ExtensionContext ectx) throws ODataApplicationException {
		System.out.println("in extension action_primcol");
		DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
		Property p  = new  Property(null,"Prim coll",ValueType.COLLECTION_PRIMITIVE,new ArrayList<Integer>(Arrays.asList(1, 2)));
		//api to set collection
		dpCtx.setResult(p);
	}

	//This action returns a complex
	@ExtendDataProvider(operationName = "actioncomplex")
	public void actioncomplex(ExtensionContext ectx) throws ODataApplicationException {
		System.out.println("in extension action_complex");
		DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
		ComplexValue cv = new ComplexValue();
		cv.getValue().add(new Property(null,"short_description",ValueType.PRIMITIVE,"short_desc"));
		cv.getValue().add(new Property(null,"long_description",ValueType.PRIMITIVE,"long_desc"));
		Property p  = new  Property(null,"Complex",ValueType.COMPLEX,cv);
		//api to set complex
		dpCtx.setResult(p);
	}

	//This action returns a complex collection
	@ExtendDataProvider(operationName = "actioncomplexcoll")
	public void actioncomplexcoll(ExtensionContext ectx) throws ODataApplicationException {
		System.out.println("in extension action_action complex coll");
		DataProviderExtensionContext dpCtx = ectx.asDataProviderContext();
		//Complex Collection
		ArrayList<ComplexValue> complexarray = new ArrayList<ComplexValue>();
		
		//Complex 1
		ComplexValue cv1 = new ComplexValue();
		cv1.getValue().add(new Property(null,"short_description",ValueType.PRIMITIVE,"short_desc1"));
		cv1.getValue().add(new Property(null,"long_description",ValueType.PRIMITIVE,"long_desc1"));
		
		//Complex 2
		ComplexValue cv2 = new ComplexValue();
		cv2.getValue().add(new Property(null,"short_description",ValueType.PRIMITIVE,"short_desc2"));
		cv2.getValue().add(new Property(null,"long_description",ValueType.PRIMITIVE,"long_desc2"));
		
		complexarray.add(cv1);
		complexarray.add(cv2);
		
		Property p  = new  Property(null,"Complex coll",ValueType.COLLECTION_COMPLEX,complexarray);
		//api to set complex collection
		dpCtx.setResult(p);
	}

	//This is a sample method which just shows how to create an entity
	//This method just adds one entity from ResultSet.
	private Entity createEntityFromResultSet(ResultSet rs) throws SQLException {

		Entity e = new Entity();
		ResultSetMetaData meta = rs.getMetaData();
		int columnCount = meta.getColumnCount();
		List<String> columns = new ArrayList<String>();
		for(int i = 1;i<=columnCount;i++)
			columns.add(meta.getColumnLabel(i));

		for(String column : columns)
			e.addProperty(new Property(null,column,ValueType.PRIMITIVE,rs.getObject(column)));

		return e;
	}

	//This is a sample method which just shows how to create entity collection
	//This method just adds one entity to the Collection and returns.
	private EntityCollection createEntityCollectionFromResultSet(ResultSet rs) throws SQLException {

		EntityCollection coll = new EntityCollection();
		coll.getEntities().add(createEntityFromResultSet(rs));

		return coll;
	}

}
*/