/**
 * Created by andrey on 9/18/24.
 */

public with sharing class EshopOrderWrapper {

    @AuraEnabled public Date estimatedDeliveryDate;
    @AuraEnabled public Date registrationDate;
    @AuraEnabled public Integer cartIndex;
}