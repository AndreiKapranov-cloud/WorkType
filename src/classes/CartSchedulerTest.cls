/**
 * Created by andrey on 9/26/24.
 */



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

            ScheduleRandomActualDeliveryDate scheduleRandomActualDeliveryDate = new ScheduleRandomActualDeliveryDate();

            CartScheduler.scheduleRandomActualDeliveryDate();
            scheduleRandomActualDeliveryDate.execute(null);


            List<EShopOrder__c> processedOrders = [SELECT Id, ActualDeliveryDate__c,EstimatedDeliveryDate__c FROM EShopOrder__c ORDER BY Id];

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

            List<Cart__c> modifiedCarts = [SELECT Id, Done__c,ActualDeliveryDate__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno'];


            System.assertEquals(modifiedCarts[0].Done__c, true);
            System.assertEquals(modifiedCarts[0].ActualDeliveryDate__c, Date.today().addDays(2));

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

            List<Cart__c> modifiedCarts = [SELECT Id, Done__c,ActualDeliveryDate__c,Status__c FROM Cart__c WHERE Pickup_Point_Address__c = 'Grodno'];


            System.assertEquals(modifiedCarts[0].Status__c, 'Is Late');

        }

        @IsTest
        static void testAbortScheduleCartStatusChangeJob() {

            List<EShopOrder__c> orders = TestDataFactory.createEShopOrders();


            ScheduledCartStatusChange scheduledCartStatusChange = new ScheduledCartStatusChange();

            CartScheduler.scheduleCartStatusChange();

            scheduledCartStatusChange.execute(null);

            List<AsyncApexJob> asyncApexJobsBeforeProcessing = [
                    SELECT Id, CronTriggerId
                    FROM AsyncApexJob
                    WHERE ApexClass.Name = :'ScheduledCartStatusChange' AND Status = 'Queued'
            ];
            System.debug('asyncApexJobsBeforeProcessing: ' + asyncApexJobsBeforeProcessing);

            delete [SELECT Id FROM Cart__c];

            scheduledCartStatusChange.execute(null);

            List<AsyncApexJob> asyncApexJobsAfterProcessing = [
                    SELECT Id, CronTriggerId
                    FROM AsyncApexJob
                    WHERE ApexClass.Name = :'ScheduledCartStatusChange' AND Status = 'Queued'
            ];
            System.debug('asyncApexJobsAfterProcessing: ' + asyncApexJobsAfterProcessing);

            System.assertEquals(asyncApexJobsBeforeProcessing.isEmpty(), false);
            System.assertEquals(asyncApexJobsAfterProcessing.isEmpty(), true);

        }
    }







