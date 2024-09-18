/**
 * Created by andrey on 9/18/24.
 */

public with sharing class CartWrapper {
    @AuraEnabled public Id buyer;
    @AuraEnabled public String pickupPointAddress;
    @AuraEnabled public String status;
    @AuraEnabled public List<EshopOrderWrapper> orders;

}