/**
 * Created by andrey on 9/20/24.
 */
@isTest
public with sharing class CartManagerTest {


    @isTest
    static void testInsertCartsAndOrdersPostPositive() {


        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL',Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        List<Buyer__c> buyers = [SELECT Id, Name FROM Buyer__c ];


        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();


        List<CreateEshopOrderParamsWrapper> createEshopOrderParamsWrappers = new List<CreateEshopOrderParamsWrapper>();


        for (Integer i = 0; i < 4; i++) {
            CreateEshopOrderParamsWrapper createEshopOrderParamsWrapper = new CreateEshopOrderParamsWrapper();
            createEshopOrderParamsWrapper.registrationDate = Date.today();
            createEshopOrderParamsWrapper.estimatedDeliveryDate = Date.today();
            createEshopOrderParamsWrappers.add(createEshopOrderParamsWrapper);
        }


        CreateCartParamsWrapper createCartParamsWrapper = new CreateCartParamsWrapper();
        List<CreateCartParamsWrapper> createCartParamsWrappers = new List<CreateCartParamsWrapper>();


        createCartParamsWrapper.buyerId = buyers[0].Id;
        createCartParamsWrapper.pickupPointAddress = 'Dzerjinsky,113';
        createCartParamsWrapper.status = 'Formed';
        createCartParamsWrapper.orders = createEshopOrderParamsWrappers;
        createCartParamsWrappers.add(createCartParamsWrapper);

        CartsJSONWrapper cartsJSONWrapper = new CartsJSONWrapper();
        cartsJSONWrapper.carts = createCartParamsWrappers;


        req.requestBody = Blob.valueOf(JSON.serializePretty(cartsJSONWrapper));
        System.debug(req.requestBody);

        RestContext.request = req;
        RestContext.response = res;

        Test.startTest();
        CartManager.insertCartsAndOrders();
        Test.stopTest();


        Cart__c newCartCreated = [SELECT Id, Pickup_Point_Address__c,Status__c FROM Cart__c WHERE Status__c = 'Formed'];
        List<EShopOrder__c> newOrdersCreated = [SELECT Id, EstimatedDeliveryDate__c,RegistrationDate__c FROM EShopOrder__c WHERE Cart__c = :newCartCreated.Id];


        System.assertEquals(newCartCreated.Pickup_Point_Address__c, 'Dzerjinsky,113');

        for (EShopOrder__c order : newOrdersCreated) {

            System.assertEquals(order.RegistrationDate__c, Date.today());
            System.assertEquals(order.EstimatedDeliveryDate__c, Date.today());
        }

        System.assertEquals(201, res.statusCode);

    }
}


