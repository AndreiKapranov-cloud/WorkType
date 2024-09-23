/**
 * Created by andrey on 9/23/24.
 */
@IsTest
public with sharing class EShopBaseComponentControllerTest {

    @IsTest
    static void testCreateEshopOrders() {


        /*   Cart__c cart = TestDataFactory.createCart();
           GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();


           CreateEshopOrderParamsWrapper createEshopOrderParamsWrapper = new CreateEshopOrderParamsWrapper();
           List<CreateEshopOrderParamsWrapper> createEshopOrderParamsWrappers = new List<CreateEshopOrderParamsWrapper>();

           createEshopOrderParamsWrapper.eShopOrderGoodQuantity = 5;
           createEshopOrderParamsWrapper.estimatedDeliveryDate = Date.today();
           createEshopOrderParamsWrapper.cartId = cart.Id;
           createEshopOrderParamsWrapper.registrationDate = Date.today();
           createEshopOrderParamsWrapper.goodLineItemId = goodLineItem.Id;

           createEshopOrderParamsWrappers.add(createEshopOrderParamsWrapper);

           String paramsJSONString = JSON.serialize(createEshopOrderParamsWrappers);*/


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


        GoodLineItem__c goodLineItem = [SELECT Id,Quantity__c FROM GoodLineItem__c WHERE Id =: goodLineItemId];

        System.assertEquals(goodLineItem.Quantity__c, 61);

    }
}
/*

        try {

            List<String> goodLineItemIds = new List<String>();

            for (EShopOrder__c eShopOrder : eShopOrders) {

                goodLineItemIds.add(eShopOrder.Good_Line_Item__c);

            }


            List<GoodLineItem__c> goodLineItems = [SELECT Id,Quantity__c FROM GoodLineItem__c WHERE Id IN:goodLineItemIds];

            for (GoodLineItem__c goodLineItem : goodLineItems) {

                for (EShopOrder__c eShopOrder : eShopOrders) {

                    if (eShopOrder.Good_Line_Item__c == goodLineItem.Id) {

                        goodLineItem.Quantity__c -= eShopOrder.Quantity__c;
                    }
                }

            }

            update goodLineItems;
        }*/
