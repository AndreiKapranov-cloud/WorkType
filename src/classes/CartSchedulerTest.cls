@IsTest
public with sharing class CartSchedulerTest {

    @IsTest
    static void testScheduleRandomActualDeliveryDate() {

        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();
        EShopOrder__c eShopOrderBeforeProcessing = orders[0];

        Test.startTest();
        CartScheduler.scheduleRandomActualDeliveryDate();
        Test.stopTest();

        EShopOrder__c orderAfterProcessing = [SELECT Id,ActualDeliveryDate__c FROM EShopOrder__c WHERE Id =: eShopOrderBeforeProcessing.Id ];
        System.debug(eShopOrderBeforeProcessing.ActualDeliveryDate__c);
        System.debug(orderAfterProcessing.ActualDeliveryDate__c);
        System.assertNotEquals(eShopOrderBeforeProcessing.ActualDeliveryDate__c, orderAfterProcessing.ActualDeliveryDate__c);
    }

    @IsTest
    static void testScheduleCartStatusChange() {

        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();

        System.debug(orders[0].EstimatedDeliveryDate__c);

        for (EShopOrder__c order : orders) {
            order.ActualDeliveryDate__c = Date.today().addDays(2);
            order.EstimatedDeliveryDate__c = Date.today().addDays(3);
        }

        System.debug(orders[0].EstimatedDeliveryDate__c);

        update orders;

        Test.startTest();

        CartScheduler.scheduleCartStatusChange();

        Test.stopTest();

        Cart__c modifiedCart = [SELECT Id, Done__c,ActualDeliveryDate__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno' LIMIT 1];

        System.assertEquals(modifiedCart.Done__c, true);
        System.assertEquals(modifiedCart.ActualDeliveryDate__c, Date.today().addDays(2));

    }

    @IsTest
    static void testScheduleCartStatusChangeToIsLate() {

        List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();
        EShopOrder__c order = orders[0];
        order.ActualDeliveryDate__c = Date.today().addDays(2);
        order.EstimatedDeliveryDate__c = Date.today().addDays(1);
        update order;

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







