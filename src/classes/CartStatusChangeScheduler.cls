

public with sharing class CartStatusChangeScheduler implements Schedulable {


    public void execute(SchedulableContext sC) {

        try {


            List<Cart__c> carts = [
                    SELECT Id, Status__c, Done__c, EstimatedDeliveryDate__c, ActualDeliveryDate__c, (SELECT Id,Status__c,ActualDeliveryDate__c,EstimatedDeliveryDate__c,Done__c FROM EShop_Orders__r)
                    FROM Cart__c
                    WHERE Done__c = FALSE
            ];


            if (carts.isEmpty()) {
                CartScheduler.abortScheduleCartStatusChangeJob();

            } else {


                Integer deliveredOrdersCounter = 0;
                Integer cartUpdateIndicator = 0;
                Date cartActualDeliveryDate = null;

                List<EShopOrder__c> eShopOrdersToUpdate = new List<EShopOrder__c>();
                List<Cart__c> cartsToUpdate = new List<Cart__c>();


                for (Cart__c cart : carts) {


                    deliveredOrdersCounter = 0;
                    cartUpdateIndicator = 0;
                    cartActualDeliveryDate = null;

                    for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                        if (eShopOrder.ActualDeliveryDate__c != null && eShopOrder.Done__c != true) {

                            if (eShopOrder.ActualDeliveryDate__c <= eShopOrder.EstimatedDeliveryDate__c) {

                                if (cartActualDeliveryDate == null) {

                                    cartActualDeliveryDate = eShopOrder.ActualDeliveryDate__c;
                                } else if (eShopOrder.ActualDeliveryDate__c > cartActualDeliveryDate) {

                                    cartActualDeliveryDate = eShopOrder.ActualDeliveryDate__c;
                                }

                                eShopOrder.Done__c = true;

                                eShopOrdersToUpdate.add(eShopOrder);
                            } else {
                                if (cart.Status__c != 'Is late') {

                                    cart.Status__c = 'Is Late';

                                    cartUpdateIndicator++;
                                }
                            }
                        }
                    }
                    if (cartUpdateIndicator > 0) {
                        cartsToUpdate.add(cart);
                    }


                    for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                        if (eShopOrder.Done__c == true) {

                            deliveredOrdersCounter++;
                        }
                    }

                    if (cart.EShop_Orders__r.size() == deliveredOrdersCounter) {

                        cart.ActualDeliveryDate__c = cartActualDeliveryDate;
                        cart.Done__c = true;
                        cartsToUpdate.add(cart);
                    }
                }
                update eShopOrdersToUpdate;
                update cartsToUpdate;
            }

        } catch (Exception e) {
            System.debug('Error occurred :' + e.getMessage());
        }
    }
}