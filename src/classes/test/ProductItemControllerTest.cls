/**
 * Created by andrey on 9/25/24.
 */
@IsTest
public with sharing class ProductItemControllerTest {

    @IsTest
    static void changeGoodLineItemQuantityTest() {

        Schema.Location loc = TestDataFactory.createLocation();

        List<Schema.Location> locationsList = ProductItemController.getLocations();

        System.debug(locationsList);
        System.assertEquals(locationsList.isEmpty(), false);

    }


    @IsTest
    static void createProductItemApexMethodTest() {

        Schema.Location loc = TestDataFactory.createLocation();
        Product2 product2 = TestDataFactory.createProduct2();

        /*   loc.Longitude = 28.635308;
           loc.Latitude = 28.635308;
           loc.Name = 'Naroch';
           loc.IsInventoryLocation = true;
           insert loc;*/


        CreateProductItemParamsWrapper createProductItemParamsWrapper = new CreateProductItemParamsWrapper();

        createProductItemParamsWrapper.product2Id = product2.Id;
        createProductItemParamsWrapper.locationId = loc.Id;
        createProductItemParamsWrapper.quantityOnHand = 2;
        createProductItemParamsWrapper.quantityUnitOfMeasure = 'Each';
        createProductItemParamsWrapper.serialNumber = '1';

        String paramsJSONString = JSON.serialize(createProductItemParamsWrapper);
/*

        Id product2Id = wrapper.product2Id;
        Id locationId = wrapper.locationId;
        Decimal quantityOnHand = wrapper.quantityOnHand;
        String quantityUnitOfMeasure = wrapper.quantityUnitOfMeasure;
        String serialNumber = wrapper.serialNumber;
*/


        ProductItem productItem = ProductItemController.createProductItemApexMethod(paramsJSONString);

        List<ProductItem> productItemsFromBase = [SELECT Id,SerialNumber,QuantityUnitOfMeasure FROM ProductItem];


        System.assertEquals(productItemsFromBase[0].SerialNumber, '1');
        System.assertEquals(productItemsFromBase[0].QuantityUnitOfMeasure, 'Each');


        /*  ProductItem productItem = new ProductItem();


        ProductItemController.createProductItemApexMethod()
        try {
            CreateProductItemParamsWrapper wrapper = (CreateProductItemParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateProductItemParamsWrapper.class);

            Id product2Id = wrapper.product2Id;
            Id locationId = wrapper.locationId;
            Decimal quantityOnHand = wrapper.quantityOnHand;
            String quantityUnitOfMeasure = wrapper.quantityUnitOfMeasure;
            String serialNumber = wrapper.serialNumber;

            productItem = new ProductItem(Product2Id = product2Id, LocationId = locationId, QuantityOnHand = quantityOnHand, QuantityUnitOfMeasure = quantityUnitOfMeasure,
                    SerialNumber = serialNumber);
            insert productItem;
*/
    }
}
