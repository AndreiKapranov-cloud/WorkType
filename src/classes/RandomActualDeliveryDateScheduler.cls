
public with sharing class RandomActualDeliveryDateScheduler implements Schedulable {


        public void execute(SchedulableContext sC) {

            try {
                List <EShopOrder__c> orders = [SELECT EstimatedDeliveryDate__c, ActualDeliveryDate__c FROM EShopOrder__c WHERE Done__c = FALSE];
                System.debug('orders before : ' + orders);
                for(EShopOrder__c order : orders){

                    order.ActualDeliveryDate__c = order.EstimatedDeliveryDate__c.addDays(Integer.valueOf((Math.random() * 4)));
                }

                System.debug('orders after : ' + orders);
                update orders;
            } catch (Exception e) {
                System.debug('Error occurred while deleting opportunities ' + e.getMessage());
            }
        }
    }
