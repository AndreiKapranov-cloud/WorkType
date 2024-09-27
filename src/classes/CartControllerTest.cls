
@IsTest
public with sharing class CartControllerTest {


    @IsTest
    static void testCreateCartApexMethod() {


        Buyer__c buyer = TestDataFactory.createBuyer();


        CreateCartParamsWrapper cartParamsWrapper = new CreateCartParamsWrapper();
        cartParamsWrapper.buyerId = buyer.Id;
        cartParamsWrapper.estimatedDeliveryDate = Date.today();
        cartParamsWrapper.pickupPointAddress = 'Grodno';
        cartParamsWrapper.status = 'Formed';

        String paramsJSONString = JSON.serialize(cartParamsWrapper);

        Cart__c cart = CartController.createCartApexMethod(paramsJSONString);

        Cart__c cartFromSOQL = [SELECT Id,Pickup_Point_Address__c FROM Cart__c LIMIT 1];

        System.assertEquals(cartFromSOQL.Pickup_Point_Address__c, 'Grodno');


    }

    @IsTest
    static void testCreateCartApexMethodFail() {

        Test.startTest();

        try {

            Buyer__c buyer = TestDataFactory.createBuyer();


            CreateCartParamsWrapper cartParamsWrapper = new CreateCartParamsWrapper();
            cartParamsWrapper.buyerId = buyer.Id;
            cartParamsWrapper.estimatedDeliveryDate = Date.today();
            cartParamsWrapper.pickupPointAddress = 'Grodno';
            cartParamsWrapper.status = 'Foormed';

            String paramsJSONString = JSON.serialize(cartParamsWrapper);

            Cart__c cart = CartController.createCartApexMethod(paramsJSONString);
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Insert failed. First exception on row 0; first error: INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST, Status: bad value for restricted picklist field: Foormed: [Status__c]', ex.getMessage());

        }

        Test.stopTest();

    }

        @IsTest
    static void testGetBuyers() {

        Buyer__c buyer = TestDataFactory.createBuyer();

        List<Buyer__c> buyers = CartController.getBuyers();


        Buyer__c buyersFromSOQL = [SELECT Id, Address__c, Email__c FROM Buyer__c LIMIT 1];

        System.assertEquals(buyersFromSOQL.Address__c, 'LLLL');
        System.assertEquals(buyersFromSOQL.Email__c, 'akapranov8722@gmail.com');

    }

    @IsTest
    static void testGetCartStatusPicklistValuesUsingApex() {

        List<Map<String, String>>pickListEntries = CartController.getCartStatusPicklistValuesUsingApex();

        System.assertEquals(pickListEntries.size(), 8);
    }

}