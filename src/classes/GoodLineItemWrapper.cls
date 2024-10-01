
public with sharing class GoodLineItemWrapper {

    @AuraEnabled public Id id;
    @AuraEnabled public String name;
    @AuraEnabled public Integer quantity;
    @AuraEnabled public String supplierName;
    @AuraEnabled public String size;
    @AuraEnabled public String colour;
    @AuraEnabled public String category;
    @AuraEnabled public String subCategory;
    @AuraEnabled public Date estimatedDeliveryDate;
    @AuraEnabled public Integer quantityToAddToCart;
    @AuraEnabled public Boolean checked;

}