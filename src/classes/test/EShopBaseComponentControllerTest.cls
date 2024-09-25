/**
 * Created by andrey on 9/23/24.
 */
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
    static void testCreateOrderWrappersAndOrders() {


        List<EShopOrder__c> eShopOrders = EShopBaseComponentController.createOrderWrappersAndOrders(TestDataFactory.createEshopOrderParamsWrapperJSONString());

        System.assertEquals(eShopOrders[0].Quantity__c, 5);
        System.assertEquals(eShopOrders[0].EstimatedDeliveryDate__c, Date.today());
        System.assertEquals(eShopOrders[0].RegistrationDate__c, Date.today());
    }


    @IsTest
    static void changeCartEstimatedDeliveryDateTest() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        Test.startTest();
        EShopBaseComponentController.changeCartEstimatedDeliveryDate(eShopOrders);
        Test.stopTest();

        List<Cart__c>carts = [SELECT Id,EstimatedDeliveryDate__c FROM Cart__c];

        System.assertEquals(carts[0].EstimatedDeliveryDate__c, Date.today().addDays(1));
    }


    @IsTest
    static void changeGoodLineItemQuantityTest() {


        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();

        System.debug('TestDataFactory.createEShopOrders() : ' + orders);

        EShopBaseComponentController.changeGoodLineItemQuantity(orders);

        Id goodLineItemId = orders[0].Good_Line_Item__c;


        GoodLineItem__c goodLineItem = [SELECT Id,Quantity__c FROM GoodLineItem__c WHERE Id = :goodLineItemId];

        System.assertEquals(goodLineItem.Quantity__c, 61);

    }


    @IsTest
    static void getRecordsBySOQLTest() {

        List<EShopOrder__c>eShopOrders = TestDataFactory.createEShopOrders();

        String query = 'SELECT Id FROM EShopOrder__c';
        List<SObject>objects = EShopBaseComponentController.getRecordsBySOQL(query);

        System.assertEquals(objects.size(), 4);
    }


    @IsTest
    static void getCategoryPicklistValuesUsingApexTest() {

        List<Map<String, String>>pickListEntries = EShopBaseComponentController.getCategoryPicklistValuesUsingApex();

        System.assertEquals(pickListEntries.size(), 3);
    }


    @IsTest
    static void getGlobalPickListTest() {


        Map<String, List <String>> values = EShopBaseComponentController.getGlobalPickList();
        System.assertEquals(values.size(), 3);

    }


    @IsTest
    static void getSubCategoryPickListValuesByCategoryNameTest() {

        String testCategoryName = 'Sneakers';
        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesByCategoryName(testCategoryName);

        System.assertEquals(values.size(), 2);
    }


    @IsTest
    static void getSubCategoryPickListValuesForSneakersTest() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForSneakersCategory();

        System.assertEquals(values.size(), 2);

    }


    @IsTest
    static void getSubCategoryPickListValuesForHoodiesTest() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForHoodiesCategory();

        System.assertEquals(values.size(), 2);

    }


    @IsTest
    static void getSubCategoryPickListValuesForCostumesTest() {

        List<Map<String, String>>values = EShopBaseComponentController.getSubCategoryPickListValuesForCostumesCategory();

        System.assertEquals(values.size(), 2);

    }


    @IsTest
    static void getGoodLineItemByIdTest() {

        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        SObject item = EShopBaseComponentController.getGoodLineItemById(goodLineItem.Id);

        System.assertNotEquals(item, null);
    }
}