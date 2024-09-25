/**
 * Created by andrey on 9/24/24.
 */
@IsTest
public with sharing class CartControllerTest {


    @IsTest
    static void createCartApexMethodTest() {


        Buyer__c buyer = TestDataFactory.createBuyer();


        CreateCartParamsWrapper cartParamsWrapper = new CreateCartParamsWrapper();
        cartParamsWrapper.buyerId = buyer.Id;
        cartParamsWrapper.estimatedDeliveryDate = Date.today();
        cartParamsWrapper.pickupPointAddress = 'Grodno';
        cartParamsWrapper.status = 'Formed';

        String paramsJSONString = JSON.serialize(cartParamsWrapper);

        Cart__c cart = CartController.createCartApexMethod(paramsJSONString);

        Cart__c cartFromSOQL = [SELECT Id,Pickup_Point_Address__c FROM Cart__c];

        System.assertEquals(cartFromSOQL.Pickup_Point_Address__c, 'Grodno');


    }

    @IsTest
    static void getBuyersTest() {

        Buyer__c buyer = TestDataFactory.createBuyer();

        List<Buyer__c> buyers = CartController.getBuyers();


        List<Buyer__c> buyersFromSOQL = [SELECT Id, Address__c, Email__c FROM Buyer__c];

        System.assertEquals(buyersFromSOQL[0].Address__c, 'LLLL');
        System.assertEquals(buyersFromSOQL[0].Email__c, 'akapranov8722@gmail.com');

    }

    @IsTest
    static void getCartStatusPicklistValuesUsingApexTest() {

        List<Map<String, String>>pickListEntries = CartController.getCartStatusPicklistValuesUsingApex();

        System.assertEquals(pickListEntries.size(), 8);
    }

}