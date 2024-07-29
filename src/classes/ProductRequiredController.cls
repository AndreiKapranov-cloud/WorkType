public with sharing class ProductRequiredController {
    public ProductRequiredController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProduct2s() {
        return [
            SELECT Id,Name FROM Product2 where Description = 'Field Service' LIMIT 200
       ];
    }
}