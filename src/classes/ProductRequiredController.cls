public with sharing class ProductRequiredController {
    public ProductRequiredController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProduct2s() {
        List<Product2> productList = new List<Product2>();
        try {
            productList = [
                    SELECT Id,Name
                    FROM Product2
                    where Description = 'Field Service'
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getQuantityUnitOfMeasurePicklistValues() {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = ProductRequired.QuantityUnitOfMeasure.getDescribe().getPicklistValues();

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


    @AuraEnabled
    public static ProductRequired createProductRequiredApexMethod(Id parentRecordId, Id product2Id, Decimal quantityRequired, String quantityUnitOfMeasure) {

        ProductRequired productRequired = new ProductRequired();
        try {
            productRequired = new ProductRequired(ParentRecordId = parentRecordId, Product2Id = product2Id, QuantityRequired = quantityRequired, QuantityUnitOfMeasure = quantityUnitOfMeasure);
            insert productRequired;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productRequired;
    }
}