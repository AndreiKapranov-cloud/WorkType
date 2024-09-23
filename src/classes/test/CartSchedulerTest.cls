/**
 * Created by andrey on 9/23/24.
 */
@IsTest
public with sharing class CartSchedulerTest {


    @IsTest static void testScheduleCartStatusChange() {
        //  public static void scheduleCartStatusChange() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);


        insert cart;

        EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(), ActualDeliveryDate__c = Date.today().addDays(2), EstimatedDeliveryDate__c = Date.today().addDays(3), Cart__c = cart.Id, Done__c = false);

        insert eShopOrder;


        Test.startTest();

        CartScheduler.scheduleCartStatusChange();

        Test.stopTest();

        List<Cart__c> modifiedCarts = [SELECT Id, Done__c,ActualDeliveryDate__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno'];


        System.assertEquals(modifiedCarts[0].Done__c, true);
        System.assertEquals(modifiedCarts[0].ActualDeliveryDate__c, Date.today().addDays(2));

    }


    @IsTest static void testScheduleCartStatusChangeToIsLate() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);


        insert cart;

        EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(), ActualDeliveryDate__c = Date.today().addDays(2), EstimatedDeliveryDate__c = Date.today().addDays(1), Cart__c = cart.Id, Done__c = false);

        insert eShopOrder;


        Test.startTest();

        CartScheduler.scheduleCartStatusChange();

        Test.stopTest();

        List<Cart__c> modifiedCarts = [SELECT Id, Done__c,ActualDeliveryDate__c,Status__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno'];


        System.assertEquals(modifiedCarts[0].Status__c, 'Is Late');

    }

}





