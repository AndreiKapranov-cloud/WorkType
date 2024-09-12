/**
 * Created by andrey on 9/12/24.
 */

public with sharing class ScheduleRandomDelivery implements Schedulable {



        public void execute(SchedulableContext sC) {


            try {

                List<Cart__c> carts = [SELECT Id, Status__c, EstimatedDeliveryDate__c, (SELECT Id,Status__c FROM EShop_Orders__r) FROM Cart__c WHERE Done__c = FALSE];





            } catch (Exception e) {
                System.debug('Error occurred while deleting opportunities ' + e.getMessage());
            }
        }
    }
