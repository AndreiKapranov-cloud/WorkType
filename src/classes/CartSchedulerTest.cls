@IsTest
public with sharing class CartSchedulerTest {

    @IsTest
    static void testScheduleRandomActualDeliveryDate() {

        List<Date> actualDeliveryDates = new List<Date>();
        List<Date> actualDeliveryDatesAfterProcessing = new List<Date>();

        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();

        List<EShopOrder__c> createdOrders = [SELECT Id, ActualDeliveryDate__c,EstimatedDeliveryDate__c FROM EShopOrder__c ORDER BY Id];

        for (EShopOrder__c eShopOrder : createdOrders) {
            actualDeliveryDates.add(eShopOrder.ActualDeliveryDate__c);
        }

//        RandomActualDeliveryDateScheduler randomActualDeliveryDateScheduler = new RandomActualDeliveryDateScheduler();

        Test.startTest();
        CartScheduler.scheduleRandomActualDeliveryDate();
        Test.stopTest();
        //   scheduleRandomActualDeliveryDate.execute(null);


        List<EShopOrder__c> processedOrders = [SELECT Id, ActualDeliveryDate__c, EstimatedDeliveryDate__c FROM EShopOrder__c ORDER BY Id];

        for (EShopOrder__c eShopOrder : processedOrders) {
            actualDeliveryDatesAfterProcessing.add(eShopOrder.ActualDeliveryDate__c);
        }

        System.debug(actualDeliveryDates);
        System.debug(actualDeliveryDatesAfterProcessing);
        System.assertNotEquals(actualDeliveryDates, actualDeliveryDatesAfterProcessing);
    }
    @IsTest
    static void testScheduleCartStatusChange() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);


        insert cart;

        EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(), ActualDeliveryDate__c = Date.today().addDays(2), EstimatedDeliveryDate__c = Date.today().addDays(3), Cart__c = cart.Id, Done__c = false);

        insert eShopOrder;


        Test.startTest();

        CartScheduler.scheduleCartStatusChange();

        Test.stopTest();

        Cart__c modifiedCart = [SELECT Id, Done__c,ActualDeliveryDate__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno' LIMIT 1];


        System.assertEquals(modifiedCart.Done__c, true);
        System.assertEquals(modifiedCart.ActualDeliveryDate__c, Date.today().addDays(2));

    }

    @IsTest
    static void testScheduleCartStatusChangeToIsLate() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);


        insert cart;

        EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(), ActualDeliveryDate__c = Date.today().addDays(2), EstimatedDeliveryDate__c = Date.today().addDays(1), Cart__c = cart.Id, Done__c = false);

        insert eShopOrder;


        Test.startTest();

        CartScheduler.scheduleCartStatusChange();

        Test.stopTest();

        Cart__c modifiedCart = [SELECT Id, Done__c,ActualDeliveryDate__c,Status__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno' LIMIT 1];


        System.assertEquals(modifiedCart.Status__c, 'Is Late');

    }

    @IsTest
    static void testAbortScheduleCartStatusChangeJob() {

        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();


        CartStatusChangeScheduler scheduledCartStatusChange = new CartStatusChangeScheduler();

        CartScheduler.scheduleCartStatusChange();

        scheduledCartStatusChange.execute(null);

        List<AsyncApexJob> asyncApexJobsBeforeProcessing = [
                SELECT Id, CronTriggerId
                FROM AsyncApexJob
                WHERE ApexClass.Name = :'CartStatusChangeScheduler' AND Status = 'Queued'
        ];
        System.debug('asyncApexJobsBeforeProcessing: ' + asyncApexJobsBeforeProcessing);

        delete [SELECT Id FROM Cart__c];

        scheduledCartStatusChange.execute(null);

        List<AsyncApexJob> asyncApexJobsAfterProcessing = [
                SELECT Id, CronTriggerId
                FROM AsyncApexJob
                WHERE ApexClass.Name = :'CartStatusChangeScheduler' AND Status = 'Queued'
        ];
        System.debug('asyncApexJobsAfterProcessing: ' + asyncApexJobsAfterProcessing);

        System.assertEquals(asyncApexJobsBeforeProcessing.isEmpty(), false);
        System.assertEquals(asyncApexJobsAfterProcessing.isEmpty(), true);

    }
}







