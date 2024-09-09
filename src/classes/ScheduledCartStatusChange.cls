/**
 * Created by andrey on 9/9/24.
 */

public with sharing class ScheduledCartStatusChange implements Schedulable {


    public void execute(SchedulableContext sC) {


        try {
            List<Cart__c> carts = [SELECT Id, Status__c, EstimatedDeliveryDate__c, (SELECT Id,Status__c FROM EShop_Orders__r) FROM Cart__c];

            if (carts.size() > 0) {

                for (Cart__c cart : carts) {

                    List<Boolean> delivered = new List<Boolean>();
                    for (EShopOrder__c eShopOrder : cart.EShop_Orders__r) {

                        if (eShopOrder.Status__c == 'Delivered') {
                            delivered.add(true);

                        }
                    }

                    if (cart.EShop_Orders__r.size() == delivered.size()) {

                        cart.Status__c = 'Delivered';

                    }else if(cart.EstimatedDeliveryDate__c >= Date.today()){

                        cart.Status__c = 'IsLate';

                    }
                }
            }

            update carts;
        } catch (Exception e) {
            System.debug('Error occurred while deleting opportunities ' + e.getMessage());
        }
    }
}
