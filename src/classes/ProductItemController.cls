

public with sharing class ProductItemController {

    @AuraEnabled
    public static List<Schema.Location> getLocations() {
        List<Schema.Location> locationsList = new List<Schema.Location>();

        try {
            locationsList = [
                    SELECT Id, Name
                    FROM Location
                    WHERE IsInventoryLocation = TRUE
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return locationsList;
    }

    @AuraEnabled
    public static ProductItem createProductItemApexMethod(String paramsJSONString) {

        ProductItem productItem = new ProductItem();

        try {
            CreateProductItemParamsWrapper wrapper = (CreateProductItemParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateProductItemParamsWrapper.class);

            Id product2Id = wrapper.product2Id;
            Id locationId = wrapper.locationId;
            Integer quantityOnHand = wrapper.quantityOnHand;
            String quantityUnitOfMeasure = wrapper.quantityUnitOfMeasure;
            String serialNumber = wrapper.serialNumber;

            productItem = new ProductItem(Product2Id = product2Id, LocationId = locationId, QuantityOnHand = quantityOnHand, QuantityUnitOfMeasure = quantityUnitOfMeasure,
                    SerialNumber = serialNumber);
            insert productItem;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productItem;
    }
}