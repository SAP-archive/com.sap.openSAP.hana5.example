package com.sap.openSAP.hana5.example.extensiontemplate;

/*
/**
* <h1>Extension Templates!</h1>
* CDS supports only read & query operations but CDS does not support DML operations 
* i.e we cannot insert, update, delete data using CDS data model.  
* To support DML operations, one can write custom code as shown below
* <p>
* <b>Note:</b> This code is only for reference
*
* @author  SAP
* @version 1.0
* @since   2016-08-23
*/

//import java.sql.Connection;
//import java.sql.SQLException;
//import java.sql.Statement;
//import java.util.Iterator;
//import java.util.List;
//import java.util.Locale;
//
//import org.apache.olingo.commons.api.data.Entity;
//import org.apache.olingo.commons.api.data.Property;
//import org.apache.olingo.commons.api.edm.EdmKeyPropertyRef;
//import org.apache.olingo.commons.api.http.HttpHeader;
//import org.apache.olingo.commons.api.http.HttpMethod;
//import org.apache.olingo.server.api.OData;
//import org.apache.olingo.server.api.ODataApplicationException;
//import org.apache.olingo.server.api.deserializer.DeserializerResult;
//import org.apache.olingo.server.api.prefer.Preferences;
//import org.apache.olingo.server.api.uri.UriInfo;
//import org.apache.olingo.server.api.uri.UriParameter;
//import org.apache.olingo.server.api.uri.UriResourceEntitySet;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import com.sap.gateway.v4.rt.api.extensions.DataProviderExtensionContext;
//import com.sap.gateway.v4.rt.api.extensions.ExtendDataProvider;
//import com.sap.gateway.v4.rt.api.extensions.ExtensionContext;
//import com.sap.gateway.v4.rt.api.extensions.ExtensionException;
//import com.sap.gateway.v4.rt.api.extensions.RequestType;
//import com.sap.gateway.v4.rt.cds.api.CDSDSParams;

public class ExtensionSample {

//	final static Logger logr = LoggerFactory.getLogger("ExtensionSample");
//     String contextName=null;
//     
//     
//	/**
//	 * This method is used to create entity of contextName
//	 * 
//	 * @param ecx
//	 * @throws ODataApplicationException
//	 * @throws ExtensionException
//	 * @throws SQLException
//	 */
//	// Provide entity name , request type ,context name to ExtendDataProvider
//	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.CREATE,servicename="xsaapptest.hdinamespace._.contextName")
//	public void createCustomer(ExtensionContext ecx)
//			throws ODataApplicationException, ExtensionException, SQLException {
//		//initialize contextName
//		contextName="contextName";
//		insertCustomer(ecx);
//	}
//	/**
//	 * This method is used to create entity of contextName2
//	 * 
//	 * @param ecx
//	 * @throws ODataApplicationException
//	 * @throws ExtensionException
//	 * @throws SQLException
//	 */
//	// Provide entity name , request type ,context name to ExtendDataProvider
//	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.CREATE,servicename="xsaapptest.hdinamespace._.contextName2")
//	public void createCustomerOtherContext(ExtensionContext ecx)
//			throws ODataApplicationException, ExtensionException, SQLException {
//		//initialize contextName-currently this is way to know contextName
//		contextName="contextName2";
//		insertCustomer(ecx); 
//	}
//	/**
//	 * @param ecx
//	 * @throws ExtensionException
//	 * @throws SQLException
//	 */
//	private void insertCustomer(ExtensionContext ecx) throws ExtensionException, SQLException {
//		logr.debug("Entering ExtensionSample << "+ contextName +" << {insertCustomer}" );
//		Connection conn = null;
//		try {
//			String Street = null, Area = null, City = null, State = null, Country = null;
//			// Convert ExtensionContext object to DataProviderExtensionContext
//			// object & getting connection object
//			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
//			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
//			// get pay load
//			DeserializerResult payload = dpCtx.getDeserializerResult();
//			// get customer entity
//			Entity customerEntity = payload.getEntity();
//			// get customer address
//			List<Property> custAddress = customerEntity.getProperty("CustAddress").asComplex().getValue();
//			// read complex property address in customer entity
//			Iterator<Property> itr = custAddress.iterator();
//			Property prop = new Property();
//			while (itr.hasNext()) {
//				prop = itr.next();
//				String propName = prop.getName();
//				if (propName.equals("Street")) {
//					Street = String.valueOf(prop.getValue());
//				} else if (propName.equals("Area")) {
//					Area = String.valueOf(prop.getValue());
//				} else if (propName.equals("City")) {
//					City = String.valueOf(prop.getValue());
//				} else if (propName.equals("State")) {
//					State = String.valueOf(prop.getValue());
//				} else if (propName.equals("Country")) {
//					Country = String.valueOf(prop.getValue());
//				}
//			}
//
//			// preparing sql statement and execute
//			Statement stmt = conn.createStatement();
//			String sqlString = "INSERT INTO \"xsaapptest.hdinamespace::"+contextName+".Customer\" VALUES ("
//					+ customerEntity.getProperty("CustomerID").getValue() + ",'"
//					+ customerEntity.getProperty("Type").getValue() + "','"
//					+ customerEntity.getProperty("CustomerName").getValue() + "','" + Street + "','" + Area + "','"
//					+ City + "','" + State + "','" + Country + "',"
//					+ customerEntity.getProperty("CustomerID").getValue() + ",'"
//					+ customerEntity.getProperty("Type").getValue() + "')";
//			logr.trace("ExtensionSample  << "+ contextName +" <<  {createCustomer} SQL Statement " + sqlString);
//			stmt.executeUpdate(sqlString);
//			logr.info(contextName +" <<customer created successfully ");
//			returnResponseIfRequestPrefers(ecx, dpCtx);
//
//		} catch (SQLException e) {
//			logr.error("ExtensionSample  << "+ contextName +" << {insertCustomer}", e);
//			throw new ExtensionException(e);
//		} catch (Exception e) {
//			logr.error("ExtensionSample  << "+ contextName +" <<  {insertCustomer}", e);
//			throw new ExtensionException(e);
//		} finally {
//			if (conn != null)
//				// close connection
//				conn.close();
//		}
//		logr.debug("Exiting ExtensionSample  << "+ contextName +" <<  {insertCustomer}");
//	}
//
//	/**
//	 * if the user sends Prefer return=minimal then don't read response
//	 * otherwise read response i.e call setEntityToBeRead() method
//	 * 
//	 * @param ecx
//	 */
//	private void returnResponseIfRequestPrefers(ExtensionContext ecx, DataProviderExtensionContext extCtx) {
//
//		logr.debug("Entering ExtensionSample  << "+ contextName +" <<  {returnResponseIfRequestPrefers}");
//		final Preferences.Return returnPreference = OData.newInstance()
//				.createPreferences(ecx.getODataRequest().getHeaders(HttpHeader.PREFER)).getReturn();
//		if (returnPreference == null || returnPreference == Preferences.Return.REPRESENTATION) {
//
//			extCtx.setEntityToBeRead();
//		}
//		logr.debug("Exiting ExtensionSample  << "+ contextName +" <<  {returnResponseIfRequestPrefers}");
//	}
//
//	/**
//	 * This method is used to update entity
//	 * 
//	 * @param ecx
//	 * @throws ODataApplicationException
//	 * @throws SQLException
//	 * @throws ExtensionException
//	 */
//	// Provide entity name and request type to ExtendDataProvider
//	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.UPDATE )
//	public void updateCustomer(ExtensionContext ecx)
//			throws ODataApplicationException, SQLException, ExtensionException {
//		String custId = null, custType = null, Street = null, Area = null, City = null, State = null, Country = null;
//		logr.debug("Entering ExtensionSample  << "+ contextName +" <<  {updateCustomer}");
//		Connection conn = null;
//		try {
//			// Convert ExtensionContext object to DataProviderExtensionContext
//			// object & getting connection object
//			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
//			// getting connection object
//			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
//			// get the deserialized payload
//			DeserializerResult payload = dpCtx.getDeserializerResult();
//			// read entity
//			Entity entity = payload.getEntity();
//			// read url information
//			UriInfo uri = ecx.getUriInfo();
//			UriResourceEntitySet eSet = ((UriResourceEntitySet) uri.getUriResourceParts().get(0));
//			// read key properties of entity
//			List<EdmKeyPropertyRef> keyList = eSet.getEntityType().getKeyPropertyRefs();
//			Iterator<EdmKeyPropertyRef> keyItr = keyList.iterator();
//			HttpMethod httpMethod = ecx.getODataRequest().getMethod();
//			// read key properties values
//			while (keyItr.hasNext()) {
//				EdmKeyPropertyRef key = keyItr.next();
//				String keyName = key.getName();
//				if (keyName.equals("CustomerID"))
//					custId = String.valueOf(entity.getProperty(keyName).getValue());
//				if (keyName.equals("Type"))
//					custType = String.valueOf(entity.getProperty(keyName).getValue());
//			}
//			// Get the values of complex type address
//			try {
//				List<Property> custAddress = entity.getProperty("CustAddress").asComplex().getValue();
//				if (custAddress != null) {
//					Iterator<Property> itr = custAddress.iterator();
//					Property prop = new Property();
//					while (itr.hasNext()) {
//						prop = itr.next();
//						String propName = prop.getName();
//						if (propName.equals("Street")) {
//							Street = String.valueOf(prop.getValue());
//						} else if (propName.equals("Area")) {
//							Area = String.valueOf(prop.getValue());
//						} else if (propName.equals("City")) {
//							City = String.valueOf(prop.getValue());
//						} else if (propName.equals("State")) {
//							State = String.valueOf(prop.getValue());
//						} else if (propName.equals("Country")) {
//							Country = String.valueOf(prop.getValue());
//						}
//					}
//				}
//			} catch (Exception ex) {
//
//				logr.error("ExtensionSample  << "+ contextName +" <<  {updateCustomer}", ex);
//			}
//
//			String sqlPatch = null;
//			if (httpMethod.equals(HttpMethod.PUT)) {
//				sqlPatch = "UPDATE \"xsaapptest.hdinamespace::contextName.Customer\"  " + "SET \"CustomerName\"='"
//						+ String.valueOf(entity.getProperty("CustomerName").getValue()) + "',"
//						+ " \"CustAddress.City\"='" + City + "', \"CustAddress.Country\"='" + Country + "'"
//						+ ", \"CustAddress.State\"='" + State + "',\"CustAddress.Area\"='" + Area
//						+ "',\"CustAddress.Street\"='" + Street + "' " + "Where \"CustomerID\"=" + custId
//						+ " AND \"Type\"='" + custType + "'";
//			}
//
//			else if (httpMethod.equals(HttpMethod.PATCH)) {
//				sqlPatch = "UPDATE \"xsaapptest.hdinamespace::contextName.Customer\"  " + " SET ";
//				StringBuffer sbSqlPatch = new StringBuffer(sqlPatch);
//				if (entity.getProperty("CustomerName").getValue() != null) {
//
//					sbSqlPatch.append(
//							" \"CustomerName\"='" + String.valueOf(entity.getProperty("CustomerName").getValue()));
//				}
//				if (City != null) {
//
//					sbSqlPatch.append("'," + " \"CustAddress.City\"='" + City);
//				}
//				if (Country != null) {
//
//					sbSqlPatch.append("', \"CustAddress.Country\"='" + Country + "'");
//				}
//				if (State != null)
//					sbSqlPatch.append(", \"CustAddress.State\"='" + State);
//				if (Area != null)
//					sbSqlPatch.append("',\"CustAddress.Area\"='" + Area);
//				if (Street != null)
//					sbSqlPatch.append("',\"CustAddress.Street\"='" + Street + "' ");
//
//				sbSqlPatch.append("Where \"CustomerID\"=" + custId);
//				sbSqlPatch.append(" AND \"Type\"='" + custType + "'");
//			}
//			try {
//				logr.trace("ExtensionSample  << "+ contextName +" <<  {updateCustomer} SQL Statement " + sqlPatch);
//				Statement stmt = conn.createStatement();
//				stmt.executeUpdate(sqlPatch);
//				logr.info("customer updated successfully ");
//			} catch (SQLException sqlEx) {
//				logr.error("ExtensionSample << {updateCustomer}", sqlEx);
//				throw new ExtensionException(sqlEx);
//			}
//			returnResponseIfRequestPrefers(ecx, dpCtx);
//
//		} catch (Exception ex) {
//			logr.error("ExtensionSample  << "+ contextName +" <<  {updateCustomer}", ex);
//			throw new ExtensionException(ex);
//		} finally {
//			if (conn != null)
//				// close connection
//				conn.close();
//		}
//		logr.debug("Exiting ExtensionSample  << "+ contextName +" <<  {updateCustomer}");
//	}
//
//	/**
//	 * This method is used to delete entity
//	 * 
//	 * @param ecx
//	 * @throws ODataApplicationException
//	 * @throws ExtensionException 
//	 */
//	// Provide entity name and request type to ExtendDataProvider
//	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.DELETE)
//	public void deleteCustomer(ExtensionContext ecx) throws ODataApplicationException, SQLException, ExtensionException {
//		String custId = null, custType = null;
//		Connection conn = null;
//
//		logr.debug("Entering ExtensionSample  << "+ contextName +" <<  {deleteCustomer}");
//
//		try {
//			// get connection object
//			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
//			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
//			// prepare sql statement
//			Statement stmt = conn.createStatement();
//			// get url information to read parameters
//			UriInfo uri = dpCtx.getUriInfo();
//
//			UriResourceEntitySet entity = (UriResourceEntitySet) uri.getUriResourceParts().get(0);
//			List<UriParameter> kp = entity.getKeyPredicates();
//			// read key properties
//			for (UriParameter uriParam : kp) {
//				if (uriParam.getName().equals("CustomerID")) {
//					custId = uriParam.getText();
//				}
//				if (uriParam.getName().equals("Type")) {
//					custType = uriParam.getText();
//				}
//			}
//
//			String sql = "DELETE  FROM \"xsaapptest.hdinamespace::contextName.Customer\" "
//					+ "WHERE \"CustomerID\" = " + custId + " AND \"Type\"=" + custType + "";
//			logr.trace("ExtensionSample  << "+ contextName +" <<  {deleteCustomer} SQL Statement" + sql);
//			int rowAffected = stmt.executeUpdate(sql);
//			if (rowAffected == 0) {
//
//				// prepare & throw customer exception message to customer
//				throw new ODataApplicationException("Entity not found", 404, Locale.US, "ErrCode");
//			} else {
//				logr.info( contextName +" Customer deleted successfully ");
//			}
//
//		} catch (SQLException sqlEx) {
//			logr.error("ExtensionSample  << "+ contextName +" <<  {deleteCustomer}", sqlEx);
//			throw new ExtensionException(sqlEx);
//		} catch (Exception ex) {
//			logr.error("ExtensionSample  << "+ contextName +" <<  {deleteCustomer}", ex);
//			throw new ExtensionException(ex);
//		} finally {
//			if (conn != null)
//				// close connection
//				conn.close();
//		}
//		logr.debug("Exiting ExtensionSample  << "+ contextName +" <<  {deleteCustomer}");
//
//	}
//
//	/**
//	 * This method is used to perform read operation.This method optional .
//	 * This method will demonstrate code of how to make framework  to execute default read implementation.
//	 * @param ecx
//	 * @throws ODataApplicationException
//	 * @throws ExtensionException
//	 */
//	// Provide entity name and request type to ExtendDataProvider
//	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.READ)
//	public void readCustomer(ExtensionContext ecx) throws ODataApplicationException, ExtensionException {
//
//		{
//			logr.debug("Entering ExtensionSample << {readCustomer}");
//
//			try {
//
//				// perform default read operation
//				ecx.performDefault();
//				logr.info("read customer execution completed ");
//				logr.debug("Exiting ExtensionSample <<  {readCustomer}");
//			} catch (Exception e) {
//				logr.error("ExtensionSample <<  {readCustomer}", e);
//				throw new ExtensionException(e);
//			}
//		}
//	}
	
}

