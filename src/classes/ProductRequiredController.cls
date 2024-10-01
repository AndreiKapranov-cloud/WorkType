
public with sharing class ProductRequiredController {

    @AuraEnabled
    public static ProductRequired createProductRequiredApexMethod(String paramsJSONString) {

        ProductRequired productRequired = new ProductRequired();
        try {
            ProductRequiredCreationParamsWrapper wrapper = (ProductRequiredCreationParamsWrapper) JSON.deserialize(paramsJSONString,
                    ProductRequiredCreationParamsWrapper.class);

            Id parentRecordId = wrapper.parentRecordId;
            Id product2Id = wrapper.product2Id;
            Decimal quantityRequired = wrapper.quantityRequired;
            String quantityUnitOfMeasure = wrapper.quantityUnitOfMeasure;

            productRequired = new ProductRequired(ParentRecordId = parentRecordId, Product2Id = product2Id, QuantityRequired = quantityRequired, QuantityUnitOfMeasure = quantityUnitOfMeasure);
            insert productRequired;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productRequired;
    }

    @AuraEnabled
    public static List<Product2> getProduct2s() {
        List<Product2> productList = new List<Product2>();
        try {
            productList = [
                    SELECT Id,Name
                    FROM Product2
                    WHERE Description = 'Field Service'
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return productList;
    }

}