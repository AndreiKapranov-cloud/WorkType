/**
 * Created by andrey on 9/9/24.
 */

public with sharing class ScheduledCartStatusChange implements Schedulable {


    public void execute(SchedulableContext sC) {


        try {
            List<Cart__c> carts = [
                    SELECT Id, Status__c, EstimatedDeliveryDate__c, ActualDeliveryDate__c, (SELECT Id,Status__c,ActualDeliveryDate__c,EstimatedDeliveryDate__c FROM EShop_Orders__r)
                    FROM Cart__c
                    WHERE Done__c = FALSE
                    AND EstimatedDeliveryDate__c = :Date.today()
            ];

            Integer deliveredOrdersCounter = 0;


            if (!carts.isEmpty()) {

                for (Cart__c cart : carts) {

                    if (cart.Status__c == 'Is Late') {

                        deliveredOrdersCounter = 0;

                        for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {


                            if (eShopOrder.Done__c != true) {

                                if (eShopOrder.ActualDeliveryDate__c <= Date.today()) {
                                    eShopOrder.Done__c = true;

                                }
                            }
                        }

                        for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                            if (eShopOrder.Done__c == true) {

                                deliveredOrdersCounter++;
                            }
                        }

                        if(cart.EShop_Orders__r.size() == deliveredOrdersCounter ){

                            cart.Done__c = true;

                        }
                    } else {

                        deliveredOrdersCounter = 0;

                        for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {


                            if (eShopOrder.ActualDeliveryDate__c <= eShopOrder.EstimatedDeliveryDate__c) {
                                eShopOrder.Done__c = true;
                                deliveredOrdersCounter++;
                            } else {

                                cart.Status__c = 'Is Late';

                            }
                        }
                        if (cart.EShop_Orders__r.size() == deliveredOrdersCounter) {
                            cart.Done__c = true;
                        }
                    }
                }
            }
            update carts;
        } catch (Exception e) {
            System.debug('Error occurred while deleting opportunities ' + e.getMessage());
        }
    }
}