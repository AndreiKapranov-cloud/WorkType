

public with sharing class CartController {


    @AuraEnabled
    public static Cart__c createCartApexMethod(String paramsJSONString) {
        Cart__c cart = new Cart__c();
        try {

            CreateCartParamsWrapper wrapper = (CreateCartParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateCartParamsWrapper.class);

            Id buyerId = wrapper.buyerId;
            Date estimatedDeliveryDate = wrapper.estimatedDeliveryDate;
            String pickupPointAddress = wrapper.pickupPointAddress;
            String status = wrapper.status;

            cart = new Cart__c(Buyer__c = buyerId, EstimatedDeliveryDate__c = estimatedDeliveryDate,
                    Status__c = status, Pickup_Point_Address__c = pickupPointAddress);
            insert cart;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
        return cart;
    }

    @AuraEnabled
    public static List<Buyer__c> getBuyers() {
        List<Buyer__c> buyersList = new List<Buyer__c>();
        try {
            buyersList = [SELECT Id, Name FROM Buyer__c];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return buyersList;
    }

    @AuraEnabled
    public static List<Map<String, String>> getCartStatusPicklistValuesUsingApex() {

        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get('Cart__c').getDescribe().fields.getMap().get('Status__c').getDescribe().getPickListValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry.getLabel());
                valueMap.put('value', entry.getValue());
                values.add(valueMap);
            }

        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }
}