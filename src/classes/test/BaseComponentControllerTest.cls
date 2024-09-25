/**
 * Created by andrey on 9/24/24.
 */
@IsTest
public with sharing class BaseComponentControllerTest {


    @IsTest
    static void getPicklistValuesUsingApexTest() {

        GetPicklistValuesParamsWrapper wrapper = new GetPicklistValuesParamsWrapper();
        wrapper.sObjectType = 'WorkOrder';
        wrapper.field = 'Status';

        String getStatusPicklistValuesParamsJSONString = JSON.serialize(wrapper);


        List<Map<String, String>>values = BaseComponentController.getPicklistValuesUsingApex(getStatusPicklistValuesParamsJSONString);

        System.assertEquals(values.size(), 7);
    }


    @IsTest
    static void getRecordsBySOQLTest() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        String query = 'SELECT Id FROM EShopOrder__c';
        List<SObject>objects = BaseComponentController.getRecordsBySOQL(query);

        System.assertEquals(objects.size(), 4);
    }
}