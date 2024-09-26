
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
    global static void insertCartsAndOrders() {
        System.debug('insertCartsAndOrders zalupa');
        try {
            List<Id> insertedCartRecordsIds = new List<Id>();
            List<Id> insertedOrderRecordsIds = new List<Id>();

            List<Cart__c> cartsToInsert = new List<Cart__c>();
            List<EShopOrder__c> ordersToInsert = new List<EShopOrder__c>();
            List<SObject> cartsAndOrdersToInsert = new List<SObject>();


            CartsJSONWrapper cartsJSONWrapper = (CartsJSONWrapper) JSON.deserialize(RestContext.request?.requestBody?.toString(), CartsJSONWrapper.class);


            for (CreateCartParamsWrapper cartWrapper : cartsJSONWrapper?.carts) {

                Blob key = Crypto.generateAesKey(128);
                String keyHex = EncodingUtil.convertToHex(key);
                String guid = keyHex.substring(0, 8) + '-' + keyHex.substring(8, 12) + '-' + keyHex.substring(12, 16) + '-' + keyHex.substring(16, 20) + '-' + keyHex.substring(20);


                Cart__c cartReference = new Cart__c(
                        ExtId__c = guid);


                List <CreateEshopOrderParamsWrapper> orderWrappers = cartWrapper?.orders;


                for (CreateEshopOrderParamsWrapper eshopOrderWrapper : orderWrappers) {

                    EShopOrder__c eShopOrder = new EShopOrder__c();
                    eShopOrder.EstimatedDeliveryDate__c = eshopOrderWrapper.estimatedDeliveryDate;
                    eShopOrder.RegistrationDate__c = eshopOrderWrapper.registrationDate;
                    eShopOrder.Cart__r = cartReference;
                    ordersToInsert.add(eShopOrder);

                }


                Cart__c cart = new Cart__c(
                        ExtId__c = guid,
                        Buyer__c = cartWrapper.buyerId,
                        Pickup_Point_Address__c = cartWrapper.pickupPointAddress,
                        Status__c = cartWrapper.status);

                cartsToInsert.add(cart);

            }

            cartsAndOrdersToInsert.addAll(cartsToInsert);
            cartsAndOrdersToInsert.addAll(ordersToInsert);

            insert cartsAndOrdersToInsert;

            for (Cart__c cart : cartsToInsert) {


                insertedCartRecordsIds.add(cart.Id);

            }


            for (EShopOrder__c eShopOrder : ordersToInsert) {


                insertedOrderRecordsIds.add(eShopOrder.Id);

            }


            RestResponse res = RestContext.response;
            res.responseBody = Blob.valueOf('Success. Inserted Carts, having Ids: ' + insertedCartRecordsIds + '  Inserted Orders, having Ids: ' + insertedOrderRecordsIds);
            res.statusCode = 201;

        //    return  Blob.valueOf('Success. Inserted Carts, having Ids: ' + insertedCartRecordsIds + '  Inserted Orders, having Ids: ' + insertedOrderRecordsIds);


        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());
            System.debug('Stack trace ' + e.getStackTraceString());

            throw new HandledException('The following exception has occurred: ' + e.getMessage() + e.getStackTraceString());
        }
    }
}

