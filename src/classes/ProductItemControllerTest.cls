
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

        ProductItemCreationParamsWrapper ProductItemCreationParamsWrapper = new ProductItemCreationParamsWrapper();

        ProductItemCreationParamsWrapper.product2Id = product2.Id;
        ProductItemCreationParamsWrapper.locationId = loc.Id;
        ProductItemCreationParamsWrapper.quantityOnHand = 2;
        ProductItemCreationParamsWrapper.quantityUnitOfMeasure = 'Each';
        ProductItemCreationParamsWrapper.serialNumber = '1';

        String paramsJSONString = JSON.serialize(ProductItemCreationParamsWrapper);

        ProductItem productItem = ProductItemController.createProductItemApexMethod(paramsJSONString);

        ProductItem productItemFromBase = [SELECT Id,SerialNumber,QuantityUnitOfMeasure FROM ProductItem LIMIT 1];

        System.assertEquals(productItemFromBase.SerialNumber, '1');
        System.assertEquals(productItemFromBase.QuantityUnitOfMeasure, 'Each');

    }

    @IsTest
    static void testCreateProductItemApexMethodFail() {

        Test.startTest();

        try {

            ProductItem productItem = ProductItemController.createProductItemApexMethod('sdv');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'s\' (code 115)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }
}
