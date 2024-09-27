
@IsTest
public with sharing class BaseComponentControllerTest {


    @IsTest
    static void testGetPicklistValuesUsingApex() {

        GetPicklistValuesParamsWrapper wrapper = new GetPicklistValuesParamsWrapper();
        wrapper.sObjectType = 'WorkOrder';
        wrapper.field = 'Status';

        String getStatusPicklistValuesParamsJSONString = JSON.serialize(wrapper);


        List<Map<String, String>>values = BaseComponentController.getPicklistValuesUsingApex(getStatusPicklistValuesParamsJSONString);

        System.assertEquals(values.size(), 7);
    }

    @IsTest
    static void testGetPicklistValuesUsingApexFail() {

        GetPicklistValuesParamsWrapper wrapper = new GetPicklistValuesParamsWrapper();
        wrapper.sObjectType = 'Fail';
        wrapper.field = 'Fail';

        String getStatusPicklistValuesParamsJSONString = JSON.serialize(wrapper);

        Test.startTest();

        try {

            List<Map<String, String>>values = BaseComponentController.getPicklistValuesUsingApex(getStatusPicklistValuesParamsJSONString);

        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Attempt to de-reference a null object', ex.getMessage());

        }

        Test.stopTest();

    }


    @IsTest
    static void testGetRecordsBySOQL() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        String query = 'SELECT Id FROM EShopOrder__c';
        List<SObject>objects = BaseComponentController.getRecordsBySOQL(query);

        System.assertEquals(objects.size(), 4);
    }

    @IsTest
    static void testGetRecordsBySOQLFail() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        String query = 'SELECw Id FROM EShopOrder__c';


        Test.startTest();

        try {

            List<SObject>objects = BaseComponentController.getRecordsBySOQL(query);
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: unexpected token: SELECw', ex.getMessage());

        }

        Test.stopTest();


    }
}