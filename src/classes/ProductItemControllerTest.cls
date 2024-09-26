
@IsTest
public with sharing class ProductItemControllerTest {

    @IsTest
    static void testChangeGoodLineItemQuantity() {

        Schema.Location loc = TestDataFactory.createLocation();

        List<Schema.Location> locationsList = ProductItemController.getLocations();

        System.debug(locationsList);
        System.assertEquals(locationsList.isEmpty(), false);

    }


    @IsTest
    static void testCreateProductItemApexMethod() {

        Schema.Location loc = TestDataFactory.createLocation();
        Product2 product2 = TestDataFactory.createProduct2();

        CreateProductItemParamsWrapper createProductItemParamsWrapper = new CreateProductItemParamsWrapper();

        createProductItemParamsWrapper.product2Id = product2.Id;
        createProductItemParamsWrapper.locationId = loc.Id;
        createProductItemParamsWrapper.quantityOnHand = 2;
        createProductItemParamsWrapper.quantityUnitOfMeasure = 'Each';
        createProductItemParamsWrapper.serialNumber = '1';

        String paramsJSONString = JSON.serialize(createProductItemParamsWrapper);


        ProductItem productItem = ProductItemController.createProductItemApexMethod(paramsJSONString);

        List<ProductItem> productItemsFromBase = [SELECT Id,SerialNumber,QuantityUnitOfMeasure FROM ProductItem];


        System.assertEquals(productItemsFromBase[0].SerialNumber, '1');
        System.assertEquals(productItemsFromBase[0].QuantityUnitOfMeasure, 'Each');

    }


    @IsTest
    static void testCreateProductItemApexMethodFail() {

        Test.startTest();

        try {

            ProductItem productItem = ProductItemController.createProductItemApexMethod('sdv');
        } catch (AuraHandledException ex) {

            System.assertEquals('Script-thrown exception', ex.getMessage());

        }

        Test.stopTest();
    }
}
