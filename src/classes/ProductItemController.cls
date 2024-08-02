/**
 * Created by andrey on 8/1/24.
 */

public with sharing class ProductItemController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getQuantityUnitOfMeasurePicklistValues() {
        List<Schema.PicklistEntry> entries = ProductItem.QuantityUnitOfMeasure.getDescribe().getPicklistValues();
        List<Map<String, String>> values = new List<Map<String, String>>();
        for (Schema.PicklistEntry entry : entries) {
            Map<String, String> valueMap = new Map<String, String>();
            valueMap.put('label', entry.getLabel());
            valueMap.put('value', entry.getValue());
            values.add(valueMap);
        }
        return values;
    }
    @AuraEnabled(cacheable=true)
    public static List<Schema.Location> getLocations() {
        return [
                SELECT Id,Name FROM Location where IsInventoryLocation = true LIMIT 200
        ];
    }




    @AuraEnabled
    public static ProductItem createProductItemApexMethod(Id product2Id, Id locationId, Decimal quantityOnHand,String quantityUnitOfMeasure,String SerialNumber) {

        ProductItem productItem = new ProductItem();

        try {
            productItem = new ProductItem(Product2Id = product2Id, LocationId = locationId, QuantityOnHand = quantityOnHand,QuantityUnitOfMeasure = quantityUnitOfMeasure,
                    SerialNumber = serialNumber  );
            insert productItem;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productItem;
    }
}