/**
 * Created by andrey on 9/9/24.
 */

public with sharing class ScheduledCartStatusChange implements Schedulable {


    public void execute(SchedulableContext sC) {


        try {


            List <Cart__c> cartsNotDone = [
                    SELECT Id
                    FROM Cart__c
                    WHERE Done__c = FALSE
            ];

            if (cartsNotDone.isEmpty()) {
                CartScheduler.abortScheduleCartStatusChangeJob();

            } else {

                List<Cart__c> carts = [
                        SELECT Id, Status__c, Done__c, EstimatedDeliveryDate__c, ActualDeliveryDate__c, (SELECT Id,Status__c,ActualDeliveryDate__c,EstimatedDeliveryDate__c FROM EShop_Orders__r)
                        FROM Cart__c
                        WHERE Done__c = FALSE
                        AND EstimatedDeliveryDate__c = :Date.today()
                ];

                Integer deliveredOrdersCounter = 0;
                List<EShopOrder__c> eShopOrdersToUpdate = new List<EShopOrder__c>();
                List<Cart__c> cartsToUpdate = new List<Cart__c>();


                if (!carts.isEmpty()) {

                    for (Cart__c cart : carts) {

                        if (cart.Status__c == 'Is Late') {

                            deliveredOrdersCounter = 0;

                            for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {


                                if (eShopOrder.Done__c != true) {

                                    if (eShopOrder.ActualDeliveryDate__c <= Date.today()) {
                                        eShopOrder.Done__c = true;

                                        eShopOrdersToUpdate.add(eShopOrder);
                                    }
                                }
                            }

                            for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                                if (eShopOrder.Done__c == true) {

                                    deliveredOrdersCounter++;
                                }
                            }

                            if (cart.EShop_Orders__r.size() == deliveredOrdersCounter) {

                                cart.Done__c = true;
                                cartsToUpdate.add(cart);
                            }
                        } else {

                            deliveredOrdersCounter = 0;

                            for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {


                                if (eShopOrder.ActualDeliveryDate__c <= eShopOrder.EstimatedDeliveryDate__c) {
                                    eShopOrder.Done__c = true;
                                    deliveredOrdersCounter++;

                                    eShopOrdersToUpdate.add(eShopOrder);
                                } else {

                                    cart.Status__c = 'Is Late';
                                    cartsToUpdate.add(cart);
                                }
                            }
                            if (cart.EShop_Orders__r.size() == deliveredOrdersCounter) {
                                cart.Done__c = true;
                                cartsToUpdate.add(cart);
                            }
                        }
                    }
                    update cartsToUpdate;
                    update eShopOrdersToUpdate;
                }
            }
        } catch (Exception e) {
            System.debug('Error occurred while deleting opportunities ' + e.getMessage());
        }
    }
}