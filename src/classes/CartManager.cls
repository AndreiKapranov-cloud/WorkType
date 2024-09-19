/**
 * Created by andrey on 9/17/24.
 */
@RestResource(urlMapping='/Carts/*')
global with sharing class CartManager {

    /*@HttpPost
    global static Id createCart(String buyer, String pickupPointAddress,
            String status, Boolean done) {
        Cart__c cart = new Cart__c(
                Buyer__c = buyer,
                Pickup_Point_Address__c = pickupPointAddress,
                Status__c = status,
                Done__c = done);
        insert cart;

        return cart.Id;

    }*/

    @HttpPost
    global static List<Cart__c> jSONParser() {

        try {

            List<Cart__c> cartsToInsert = new List<Cart__c>();
            List<EShopOrder__c> ordersToInsert = new List<EShopOrder__c>();
            List<SObject> cartsAndOrdersToInsert = new List<SObject>();


            CartsJSONWrapper cartsJSONWrapper = (CartsJSONWrapper) JSON.deserialize(RestContext.request?.requestBody?.toString(), CartsJSONWrapper.class);


            for (CartWrapper cartWrapper : cartsJSONWrapper?.carts) {

                Blob key = Crypto.generateAesKey(128);
                String ketHex = EncodingUtil.convertToHex(key);
                String guid = ketHex.substring(0, 8) + '-' + ketHex.substring(8, 12) + '-' + ketHex.substring(12, 16) + '-' + ketHex.substring(16, 20) + '-' + ketHex.substring(20);


                Cart__c cartReference = new Cart__c(
                        ExtId__c = guid);


                List <EshopOrderWrapper> orderWrappers = cartWrapper?.orders;


                for (EshopOrderWrapper eshopOrderWrapper : orderWrappers) {

                    EShopOrder__c eShopOrder = new EShopOrder__c();
                    eShopOrder.EstimatedDeliveryDate__c = eshopOrderWrapper.estimatedDeliveryDate;
                    eShopOrder.RegistrationDate__c = eshopOrderWrapper.registrationDate;
                    eShopOrder.Cart__r = cartReference;
                    ordersToInsert.add(eShopOrder);

                }


                Cart__c cart = new Cart__c(
                        ExtId__c = guid,
                        Buyer__c = cartWrapper.buyer,
                        Pickup_Point_Address__c = cartWrapper.pickupPointAddress,
                        Status__c = cartWrapper.status);

                cartsToInsert.add(cart);

            }

            cartsAndOrdersToInsert.addAll(cartsToInsert);
            cartsAndOrdersToInsert.addAll(ordersToInsert);

            insert cartsAndOrdersToInsert;


            return cartsAndOrdersToInsert;
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }
}

