/**
 * Created by andrey on 9/12/24.
 */

public with sharing class ScheduleRandomActualDeliveryDate implements Schedulable {



        public void execute(SchedulableContext sC) {

            try {
                List <EShopOrder__c> orders = [SELECT EstimatedDeliveryDate__c, ActualDeliveryDate__c FROM EShopOrder__c WHERE Done__c = FALSE];

                for(EShopOrder__c order : orders){

                    order.ActualDeliveryDate__c = order.EstimatedDeliveryDate__c.addDays(Integer.valueOf((Math.random() * 4)));
                }

                update orders;
            } catch (Exception e) {
                System.debug('Error occurred while deleting opportunities ' + e.getMessage());
            }
        }
    }
