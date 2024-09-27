
@IsTest
public with sharing class EShopBaseComponentControllerTest {

    @IsTest
    static void testCreateEshopOrders() {


        List<EShopOrder__c>eShopOrders = EShopBaseComponentController.createEshopOrders(TestDataFactory.createEshopOrderParamsWrapperJSONString());

        Integer count = [SELECT COUNT() FROM EShopOrder__c];
        System.assertEquals(1, count);

        EShopOrder__c eShopOrder = [SELECT Id,EstimatedDeliveryDate__c,RegistrationDate__c,Quantity__c FROM EShopOrder__c];
        System.assertEquals(1, count);
        System.assertEquals(eShopOrder.EstimatedDeliveryDate__c, Date.today());
        System.assertEquals(eShopOrder.RegistrationDate__c, Date.today());
        System.assertEquals(eShopOrder.Quantity__c, 5);

    }


    @IsTest
    static void testCreateEshopOrdersFail() {

        Test.startTest();

        try {

            List<EShopOrder__c>eShopOrders = EShopBaseComponentController.createEshopOrders('sdv');

        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'s\' (code 115)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }


    @IsTest
    static void testCreateOrderWrappersAndOrders() {


        List<EShopOrder__c> eShopOrders = EShopBaseComponentController.createOrderWrappersAndOrders(TestDataFactory.createEshopOrderParamsWrapperJSONString());
        EShopOrder__c eShopOrder = eShopOrders[0];
        System.assertEquals(eShopOrder.Quantity__c, 5);
        System.assertEquals(eShopOrder.EstimatedDeliveryDate__c, Date.today());
        System.assertEquals(eShopOrder.RegistrationDate__c, Date.today());
    }


    @IsTest
    static void testCreateOrderWrappersAndOrdersFail() {

        Test.startTest();

        try {

            List<EShopOrder__c> eShopOrders = EShopBaseComponentController.createOrderWrappersAndOrders('dvdv');

        } catch (HandledException ex) {

            System.assertEquals('Unexpected character (\'d\' (code 100)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }


    @IsTest
    static void testChangeCartEstimatedDeliveryDate() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        Test.startTest();
        EShopBaseComponentController.changeCartEstimatedDeliveryDate(eShopOrders);
        Test.stopTest();

       Cart__c cart = [SELECT Id,EstimatedDeliveryDate__c FROM Cart__c LIMIT 1];

        System.assertEquals(cart.EstimatedDeliveryDate__c, Date.today().addDays(1));
    }


    @IsTest
    static void testChangeGoodLineItemQuantity() {


        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();

        System.debug('TestDataFactory.createEShopOrders() : ' + orders);

        EShopBaseComponentController.changeGoodLineItemQuantity(orders);

        Id goodLineItemId = orders[0].Good_Line_Item__c;


        GoodLineItem__c goodLineItem = [SELECT Id,Quantity__c FROM GoodLineItem__c WHERE Id = :goodLineItemId];

        System.assertEquals(goodLineItem.Quantity__c, 61);

    }


   /* @IsTest
    static void testGetRecordsBySOQL() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        String query = 'SELECT Id FROM EShopOrder__c';
        List<SObject>objects = EShopBaseComponentController.getRecordsBySOQL(query);

        System.assertEquals(objects.size(), 4);
    }*/



    /*@IsTest
    static void testGetRecordsBySOQLFail() {


        Test.startTest();

        try {
            List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();
            String query = 'SELECT Id FROM ShopOrder__c';
            List<SObject>objects = EShopBaseComponentController.getRecordsBySOQL(query);
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: sObject type \'ShopOrder__c\' is not supported. If you are attempting to use a custom object, be sure to append the \'__c\' after the entity name. Please reference your WSDL or the describe call for the appropriate names.', ex.getMessage());

        }

        Test.stopTest();
    }*/


    @IsTest
    static void testGetCategoryPicklistValuesUsingApex() {

        List<Map<String, String>>pickListEntries = EShopBaseComponentController.getCategoryPicklistValuesUsingApex();

        System.assertEquals(pickListEntries.size(), 3);
    }


    @IsTest
    static void testGetGlobalPickList() {


        Map<String, List <String>> values = EShopBaseComponentController.getGlobalPickList();
        System.assertEquals(values.size(), 3);

    }


    @IsTest
    static void testGetSubCategoryPickListValuesByCategoryName() {

        String testCategoryName = 'Sneakers';
        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesByCategoryName(testCategoryName);

        System.assertEquals(values.size(), 2);
    }


    @IsTest
    static void testGetSubCategoryPickListValuesByCategoryNameFail() {


        Test.startTest();

        try {
            String testCategoryName = 'Snekers';
            List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesByCategoryName(testCategoryName);

        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Attempt to de-reference a null object', ex.getMessage());

        }

        Test.stopTest();
    }


    @IsTest
    static void testGetSubCategoryPickListValuesForSneakers() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForSneakersCategory();

        System.assertEquals(values.size(), 2);

    }


    @IsTest
    static void testGetSubCategoryPickListValuesForHoodies() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForHoodiesCategory();

        System.assertEquals(values.size(), 2);

    }


    @IsTest
    static void testGetSubCategoryPickListValuesForCostumes() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForCostumesCategory();

        System.assertEquals(values.size(), 2);

    }


    /*@IsTest
    static void testGetGoodLineItemById() {

        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        SObject item = EShopBaseComponentController.getGoodLineItemById(goodLineItem.Id);

        System.assertNotEquals(item, null);
    }*/


    /*@IsTest
    static void testGetGoodLineItemByIdFail() {

        Test.startTest();

        try {

            SObject item = EShopBaseComponentController.getGoodLineItemById('d');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: The following exception has occurred: invalid ID field: d', ex.getMessage());

        }

        Test.stopTest();
    }*/
}