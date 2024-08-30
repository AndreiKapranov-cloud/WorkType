/**
 * Created by andrey on 8/27/24.
 */

public with sharing class GoodLineItemWrapper {

    @AuraEnabled public Id id;
    @AuraEnabled public String name;
    @AuraEnabled public Decimal quantity;
    @AuraEnabled public String supplierName;
    @AuraEnabled public String size;
    @AuraEnabled public String colour;
    @AuraEnabled public String category;
    @AuraEnabled public String subCategory;
    @AuraEnabled public Date estimatedDeliveryDate;
    @AuraEnabled public Decimal quantityToAddToCart;


}