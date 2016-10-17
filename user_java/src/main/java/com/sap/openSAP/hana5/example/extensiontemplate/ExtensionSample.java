/*package com.sap.openSAP.hana5.example.extensiontemplate;


*//**
* <h1>Extension Templates!</h1>
* CDS supports only read & query operations and does not support DML operations 
* i.e we cannot insert, update, delete data using CDS data model.  
* To support DML operations, one can write custom code as shown below
* <p>
* <b>Note:</b> This code is only for reference
*
* @author  SAP
* @version 1.0
* @since   2016-08-23
*//*


import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.apache.olingo.commons.api.data.Entity;
import org.apache.olingo.commons.api.data.Property;
import org.apache.olingo.commons.api.http.HttpHeader;
import org.apache.olingo.commons.api.http.HttpMethod;
import org.apache.olingo.server.api.OData;
import org.apache.olingo.server.api.ODataApplicationException;
import org.apache.olingo.server.api.deserializer.DeserializerResult;
import org.apache.olingo.server.api.prefer.Preferences;
import org.apache.olingo.server.api.uri.UriInfo;
import org.apache.olingo.server.api.uri.UriParameter;
import org.apache.olingo.server.api.uri.UriResourceEntitySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.gateway.v4.rt.api.extensions.DataProviderExtensionContext;
import com.sap.gateway.v4.rt.api.extensions.ExtendDataProvider;
import com.sap.gateway.v4.rt.api.extensions.ExtensionContext;
import com.sap.gateway.v4.rt.api.extensions.ExtensionException;
import com.sap.gateway.v4.rt.api.extensions.RequestType;
import com.sap.gateway.v4.rt.cds.api.CDSDSParams;


public class ExtensionSample {

	
	final static Logger logr = LoggerFactory.getLogger("ExtensionSample");

	*//**
	 * This method encapsulates CREATE functionality for Customer entity.
	 * 
	 * @param ecx
	 * @throws ODataApplicationException
	 * @throws ExtensionException
	 * @throws SQLException
	 *//*
	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.CREATE)
	public void createCustomer(ExtensionContext ecx)
			throws ODataApplicationException, ExtensionException, SQLException {
		logr.debug("Entering create Customer method.");
		insertCustomer(ecx);
	}

	*//**
	 * @param ecx
	 * @throws ExtensionException
	 * @throws SQLException
	 *//*
	private void insertCustomer(ExtensionContext ecx) throws ExtensionException, SQLException {
		
		Connection conn = null;
		try {
			String Street = null, Area = null, City = null, State = null, Country = null;
			//Get the connection object for the current Database schema.
			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
			//Downcast Extension context object to DataProviderExtensionContext object in order to access data provider specific methods.
			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
			//Following 2 lines is used to get the entity object which represents the current request payload.
			DeserializerResult payload = dpCtx.getDeserializerResult();
			Entity customerEntity = payload.getEntity();
			 //Once we get the payload in the form of an Entity object we can retrieve different property values by using getProperty() method.
			//For complex properties, if we need to get the List of individual properties we need to call method sequence asComplex().getValue() as in the following
			//line.
			List<Property> custAddress = customerEntity.getProperty("CustAddress").asComplex().getValue();
			Iterator<Property> itr = custAddress.iterator();
			Property prop = new Property();
			while (itr.hasNext()) {
				prop = itr.next();
				String propName = prop.getName();
				if (propName.equals("Street")) {
					Street = String.valueOf(prop.getValue());
				} else if (propName.equals("Area")) {
					Area = String.valueOf(prop.getValue());
				} else if (propName.equals("City")) {
					City = String.valueOf(prop.getValue());
				} else if (propName.equals("State")) {
					State = String.valueOf(prop.getValue());
				} else if (propName.equals("Country")) {
					Country = String.valueOf(prop.getValue());
				}
			}

			Statement stmt = conn.createStatement();
			String sqlString = "INSERT INTO \"namespace::context.Customer\" VALUES ("
					+ customerEntity.getProperty("CustomerID").getValue() + ",'"
					+ customerEntity.getProperty("Type").getValue() + "','"
					+ customerEntity.getProperty("CustomerName").getValue() + "','" + Street + "','" + Area + "','"
					+ City + "','" + State + "','" + Country + "',"
					+ customerEntity.getProperty("CustomerID").getValue() + ",'"
					+ customerEntity.getProperty("Type").getValue() + "')";
			logr.trace("ExtensionSample  <<  {createCustomer} SQL Statement " + sqlString);
			stmt.executeUpdate(sqlString);
			logr.info(" customer created successfully ");
			conn.close();
			returnResponseIfRequestPrefers(dpCtx);

		} catch (SQLException e) {
			logr.error("ExtensionSample  << {insertCustomer}", e);
			throw new ExtensionException(e);
		} catch (Exception e) {
			logr.error("ExtensionSample  << {insertCustomer}", e);
			throw new ExtensionException(e);
		} finally {
			if (conn != null)
				// close connection. This is required to prevent connection leak.
				conn.close();
		}
	}

	*//**
	 * if the user sends Prefer return=minimal then don't read response
	 * otherwise read response i.e call setEntityToBeRead() method
	 * 
	 * @param ecx
	 *//*
	private void returnResponseIfRequestPrefers(DataProviderExtensionContext extCtx) {

		logr.debug("Entering ExtensionSample <<  {returnResponseIfRequestPrefers}");
		//The following check is done to see whether the request has the header "Prefer=return.minimal". If that is the case ,then the "read" following the create
		//or update is not required.
		final Preferences.Return returnPreference = OData.newInstance()
				.createPreferences(extCtx.getODataRequest().getHeaders(HttpHeader.PREFER)).getReturn();
		if (returnPreference == null || returnPreference == Preferences.Return.REPRESENTATION) {

			extCtx.setEntityToBeRead();
		}
	}

	*//**
	 * This method serves both PATCH and PUT requests for Customer entity.
	 * 
	 * @param ecx
	 * @throws ODataApplicationException
	 * @throws SQLException
	 * @throws ExtensionException
	 *//*
	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.UPDATE )
	public void updateCustomer(ExtensionContext ecx)
			throws ODataApplicationException, SQLException, ExtensionException {
		String custId = null, custType = null, Street = null, Area = null, City = null, State = null, Country = null;
		logr.debug("Entering ExtensionSample  << {updateCustomer}");
		Connection conn = null;
		try {
			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
			DeserializerResult payload = dpCtx.getDeserializerResult();
			Entity entity = payload.getEntity();
			HttpMethod httpMethod = ecx.getODataRequest().getMethod();
			
			//The following code gets the object "UriInfo" which is supposed to give us all the information in the current URL of the OData query. We are specially
			//interested in the "key predicates" information.
			UriInfo uri = dpCtx.getUriInfo();
			UriResourceEntitySet entitySet = (UriResourceEntitySet) uri.getUriResourceParts().get(0);
			List<UriParameter> keyPredicateList = entitySet.getKeyPredicates();
			// The above obtained List<UriParameter> is nothing but the list of key parameters specified in the Current Url. We extract each such value to form
			//the SQL to delete the correct entry.
			for (UriParameter uriParam : keyPredicateList) {
				if (uriParam.getName().equals("CustomerID")) {
					custId = uriParam.getText();
				}
				if (uriParam.getName().equals("Type")) {
					custType = uriParam.getText();
				}
			}
			try {
				List<Property> custAddress = entity.getProperty("CustAddress").asComplex().getValue();
				if (custAddress != null) {
					Iterator<Property> itr = custAddress.iterator();
					Property prop = new Property();
					while (itr.hasNext()) {
						prop = itr.next();
						String propName = prop.getName();
						if (propName.equals("Street")) {
							Street = String.valueOf(prop.getValue());
						} else if (propName.equals("Area")) {
							Area = String.valueOf(prop.getValue());
						} else if (propName.equals("City")) {
							City = String.valueOf(prop.getValue());
						} else if (propName.equals("State")) {
							State = String.valueOf(prop.getValue());
						} else if (propName.equals("Country")) {
							Country = String.valueOf(prop.getValue());
						}
					}
				}
			} catch (Exception ex) {

				logr.error("ExtensionSample  << {updateCustomer}", ex);
			}

			String sqlPatch = null;
			
			//There are 2 cases to consider before forming the Update SQL. 1 is HTTP Method PUT. The other is HTTP method PATCH. If the method is PUT we update ALL
			//properties of the entity, if a property is not specified in the payload we set it to null,But when the method is PATCH, 
			//we only update the specified properties.
			if (httpMethod.equals(HttpMethod.PUT)) {
				sqlPatch = "UPDATE \"namespace::context.Customer\"  " + "SET \"CustomerName\"='"
						+ String.valueOf(entity.getProperty("CustomerName").getValue()) + "',"
						+ " \"CustAddress.City\"='" + City + "', \"CustAddress.Country\"='" + Country + "'"
						+ ", \"CustAddress.State\"='" + State + "',\"CustAddress.Area\"='" + Area
						+ "',\"CustAddress.Street\"='" + Street + "' " + "Where \"CustomerID\"=" + custId
						+ " AND \"Type\"='" + custType + "'";
			}
			else if (httpMethod.equals(HttpMethod.PATCH)) {
				sqlPatch = "UPDATE \"namespace::context.Customer.Customer\"  " + " SET ";
				StringBuffer sbSqlPatch = new StringBuffer(sqlPatch);
				if (entity.getProperty("CustomerName").getValue() != null) {

					sbSqlPatch.append(
							" \"CustomerName\"='" + String.valueOf(entity.getProperty("CustomerName").getValue()));
				}
				if (City != null) {

					sbSqlPatch.append("'," + " \"CustAddress.City\"='" + City);
				}
				if (Country != null) {

					sbSqlPatch.append("', \"CustAddress.Country\"='" + Country + "'");
				}
				if (State != null)
					sbSqlPatch.append(", \"CustAddress.State\"='" + State);
				if (Area != null)
					sbSqlPatch.append("',\"CustAddress.Area\"='" + Area);
				if (Street != null)
					sbSqlPatch.append("',\"CustAddress.Street\"='" + Street + "' ");

				sbSqlPatch.append("Where \"CustomerID\"=" + custId);
				sbSqlPatch.append(" AND \"Type\"='" + custType + "'");
			}
			try {
				logr.trace("ExtensionSample  << {updateCustomer} SQL Statement " + sqlPatch);
				Statement stmt = conn.createStatement();
				stmt.executeUpdate(sqlPatch);
				logr.info("customer updated successfully ");
			} catch (SQLException sqlEx) {
				logr.error("ExtensionSample << {updateCustomer}", sqlEx);
				throw new ExtensionException(sqlEx);
			}
			returnResponseIfRequestPrefers(dpCtx);

		} catch (Exception ex) {
			logr.error("ExtensionSample  << {updateCustomer}", ex);
			throw new ExtensionException(ex);
		} finally {
			if (conn != null)
				conn.close();
		}
		logr.debug("Exiting ExtensionSample  << {updateCustomer}");
	}

	*//**
	 * This method is used to delete entity
	 * 
	 * @param ecx
	 * @throws ODataApplicationException
	 * @throws ExtensionException 
	 *//*
	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.DELETE)
	public void deleteCustomer(ExtensionContext ecx) throws ODataApplicationException, SQLException, ExtensionException {
		String custId = null, custType = null;
		Connection conn = null;

		logr.debug("Entering ExtensionSample  << {deleteCustomer}");

		try {
			DataProviderExtensionContext dpCtx = ecx.asDataProviderContext();
			conn = ((CDSDSParams) ecx.getDSParams()).getConnection();
			Statement stmt = conn.createStatement();
			
			//The following code gets the object "UriInfo" which is supposed to give us all the information in the current URL of the OData query. We are specially
			//interested in the "key predicates" information.
			UriInfo uri = dpCtx.getUriInfo();
			UriResourceEntitySet entity = (UriResourceEntitySet) uri.getUriResourceParts().get(0);
			List<UriParameter> keyPredicateList = entity.getKeyPredicates();
			// The above obtained List<UriParameter> is nothing but the list of key parameters specified in the Current Url. We extract each such value to form
			//the SQL to delete the correct entry.
			for (UriParameter uriParam : keyPredicateList) {
				if (uriParam.getName().equals("CustomerID")) {
					custId = uriParam.getText();
				}
				if (uriParam.getName().equals("Type")) {
					custType = uriParam.getText();
				}
			}

			String sql = "DELETE  FROM \"namespace::contextName.Customer\" "
					+ "WHERE \"CustomerID\" = " + custId + " AND \"Type\"=" + custType + "";
			logr.trace("ExtensionSample  << {deleteCustomer} SQL Statement" + sql);
			int rowAffected = stmt.executeUpdate(sql);
			if (rowAffected == 0) {
				throw new ODataApplicationException("Entity not found", 404, Locale.US, "404");
			} else {
				logr.info( " Customer deleted successfully ");
			}
			conn.close();

		} catch (SQLException sqlEx) {
			logr.error("ExtensionSample  << {deleteCustomer}", sqlEx);
			throw new ExtensionException(sqlEx);
		} catch (Exception ex) {
			logr.error("ExtensionSample  << {deleteCustomer}", ex);
			throw new ExtensionException(ex);
		} finally {
			if (conn != null)
				conn.close();
		}
	}

	*//**
	 * This method is used to perform read operation. This is optional as READ functionality is provided by default by the framework. Still it can be used,
	 * if some pre/post processing needs to be done in additional to the default implementation.
	 * @param ecx
	 * @throws ODataApplicationException
	 * @throws ExtensionException
	 *//*
	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.READ)
	public void readCustomer(ExtensionContext ecx) throws ODataApplicationException, ExtensionException {

		{
			logr.debug("Entering ExtensionSample << {readCustomer}");

			try {
				//performDefault is used to invoke the default handling for the current method(Here READ). 
				ecx.performDefault();
				logr.debug("Exiting ExtensionSample <<  {readCustomer}");
			} catch (Exception e) {
				logr.error("ExtensionSample <<  {readCustomer}", e);
				throw new ExtensionException(e);
			}
		}
	}
	
	*//**
	 * This method encapsulates CREATE functionality for Customer entity under Service2.
	 * 
	 * @param ecx
	 * @throws ODataApplicationException
	 * @throws ExtensionException
	 * @throws SQLException
	 *//*
	//Here, in addition to the entitySet and requestType parameters there is a 3rd parameter called serviceName, under which the OData service name of the current
	//entity has to be specified. This is done to resolve the ambiguity if multiple OData services expose entities under the same name.
	@ExtendDataProvider(entitySet = { "Customer" }, requestTypes = RequestType.CREATE, serviceName = "Service2")
	public void createCustomerOtherService(ExtensionContext ecx)
			throws ODataApplicationException, ExtensionException, SQLException {
		logr.debug("Entering create Customer method.");
		
		 // Insert logic . . . 
		 
	}
	
	
	
}

*/