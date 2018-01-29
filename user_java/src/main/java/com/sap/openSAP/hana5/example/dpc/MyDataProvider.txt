package com.sap.openSAP.hana5.example.dpc;

import org.apache.olingo.commons.api.edm.provider.CsdlEdmProvider;
import org.apache.olingo.server.api.uri.UriInfo;

import com.sap.gateway.v4.rt.cds.CDSDataProvider;
import com.sap.gateway.v4.rt.cds.ODataToCDSProcessor;

public class MyDataProvider extends CDSDataProvider {
	
	

	public MyDataProvider(ODataToCDSProcessor jdbcProcessor, CsdlEdmProvider edmProvider) {
		super(jdbcProcessor, edmProvider);
	}
	
	public MyDataProvider(CsdlEdmProvider edmProvider) {
		super(edmProvider);
	}
	
	@Override
	public Long getPageSize(UriInfo uriInfo) {
		return (long)1000;
	}
}
