/**
 * Created by andrey on 9/18/24.
 */

@RestResource(urlMapping='/EShopOrders/*')
global with sharing class EShopOrderManager {

    @HttpPost
    global static Id createEShopOrder(Date estimatedDeliveryDate, Date registrationDate,
            String cart) {
        EShopOrder__c order = new EShopOrder__c(
                EstimatedDeliveryDate__c = estimatedDeliveryDate,
                RegistrationDate__c = registrationDate,
                Cart__c = cart);
        insert order;
        return order.Id;
    }
}

