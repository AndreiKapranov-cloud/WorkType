
@isTest
public with sharing class CartManagerTest {

    @isTest
    static void testInsertCartsAndOrdersPostPositive() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        List<Buyer__c> buyers = [SELECT Id, Name FROM Buyer__c];

        CartCreationParamsWrapper CartCreationParamsWrapper = new CartCreationParamsWrapper();
        List<CartCreationParamsWrapper> CartCreationParamsWrappers = new List<CartCreationParamsWrapper>();
        List<EshopOrderCreationParamsWrapper> EshopOrderCreationParamsWrappers = new List<EshopOrderCreationParamsWrapper>();

        for (Integer i = 0; i < 4; i++) {
            EshopOrderCreationParamsWrapper EshopOrderCreationParamsWrapper = new EshopOrderCreationParamsWrapper();
            EshopOrderCreationParamsWrapper.registrationDate = Date.today();
            EshopOrderCreationParamsWrapper.estimatedDeliveryDate = Date.today();
            EshopOrderCreationParamsWrappers.add(EshopOrderCreationParamsWrapper);
        }

        CartCreationParamsWrapper.buyerId = buyers[0].Id;
        CartCreationParamsWrapper.pickupPointAddress = 'Dzerjinsky,113';
        CartCreationParamsWrapper.status = 'Formed';
        CartCreationParamsWrapper.orders = EshopOrderCreationParamsWrappers;
        CartCreationParamsWrappers.add(CartCreationParamsWrapper);

        CartsJSONWrapper cartsJSONWrapper = new CartsJSONWrapper();
        cartsJSONWrapper.carts = CartCreationParamsWrappers;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        RestContext.request = req;
        RestContext.response = res;

        req.requestBody = Blob.valueOf(JSON.serializePretty(cartsJSONWrapper));
        System.debug(req.requestBody);

        Test.startTest();
        CartManager.insertCartsAndOrders();
        Test.stopTest();

        Cart__c newCartCreated = [SELECT Id, Pickup_Point_Address__c,Status__c FROM Cart__c WHERE Status__c = 'Formed' LIMIT 1];
        List<EShopOrder__c> newOrdersCreated = [SELECT Id, EstimatedDeliveryDate__c,RegistrationDate__c FROM EShopOrder__c WHERE Cart__c = :newCartCreated.Id];

        System.assertEquals(newCartCreated.Pickup_Point_Address__c, 'Dzerjinsky,113');

        for (EShopOrder__c order : newOrdersCreated) {

            System.assertEquals(order.RegistrationDate__c, Date.today());
            System.assertEquals(order.EstimatedDeliveryDate__c, Date.today());
        }

        System.debug('LOG');
        System.debug(JSON.serializePretty(res));
        System.debug(res);
        System.debug(res.responseBody.toString());
        System.debug('LOG');
        System.assertEquals(201, res.statusCode);

    }
}


