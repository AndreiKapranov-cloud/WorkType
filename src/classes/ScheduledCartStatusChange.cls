/**
 * Created by andrey on 9/9/24.
 */

public with sharing class ScheduledCartStatusChange implements Schedulable {


    public void execute(SchedulableContext sC) {


        try {
            List<Cart__c> carts = [SELECT Id, Status__c, EstimatedDeliveryDate__c, (SELECT Id,Status__c FROM EShop_Orders__r) FROM Cart__c];
            Integer deliveredOrdersCounter = 0;
            Integer paidOrdersCounter = 0;

            if (carts.size() > 0) {

                for (Cart__c cart : carts) {

                    for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                        if (eShopOrder.Status__c == 'Delivered Not Paid' || eShopOrder.Status__c == 'Delivered Paid') {
                            deliveredOrdersCounter++;
                        }
                        if (eShopOrder.Status__c == 'Delivered Paid') {
                            paidOrdersCounter++;
                        }
                    }

                    if (cart.EShop_Orders__r.size() == deliveredOrdersCounter) {

                        cart.Status__c = 'Delivered Not Paid';

                    } else if (cart?.EstimatedDeliveryDate__c < Date.today()) {

                        cart.Status__c = 'Is Late';

                    }

                    if (cart.EShop_Orders__r.size() == paidOrdersCounter) {

                        cart.Status__c = 'Delivered Paid';

                    }
                }
            }
            update carts;
        } catch (Exception e) {
            System.debug('Error occurred while deleting opportunities ' + e.getMessage());
        }
    }
}