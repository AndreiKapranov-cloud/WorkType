
@IsTest
public with sharing class ProductRequiredControllerTest {


    @IsTest
    static void testCreateProductRequiredApexMethod() {
        WorkOrder workOrder = new WorkOrder();
        insert workOrder;


        CreateProductRequiredParamsWrapper cParamsWrapper = new CreateProductRequiredParamsWrapper();

        cParamsWrapper.parentRecordId = workOrder.Id;
        cParamsWrapper.product2Id = TestDataFactory.createProduct2().Id;
        cParamsWrapper.quantityRequired = 2;
        cParamsWrapper.quantityUnitOfMeasure = 'Each';

        String paramsJSONString = JSON.serialize(cParamsWrapper);

        ProductRequired productRequired = ProductRequiredController.createProductRequiredApexMethod(paramsJSONString);

        List<ProductRequired> productsRequiredFromBase = [SELECT Id,QuantityUnitOfMeasure,QuantityRequired FROM ProductRequired];

        System.assertEquals(productsRequiredFromBase[0].quantityRequired, 2);
        System.assertEquals(productsRequiredFromBase[0].quantityUnitOfMeasure, 'Each');

    }


    @IsTest
    static void testCreateProductRequiredApexMethodFail() {

        Test.startTest();

        try {

            ProductRequired productRequired = ProductRequiredController.createProductRequiredApexMethod('dv');
        } catch (AuraHandledException ex) {

            System.assertEquals('Script-thrown exception', ex.getMessage());

        }

        Test.stopTest();
    }

    @isTest
    public static void testGetProduct2s() {
        Product2 product2 = TestDataFactory.createProduct2();
        List<Product2>product2s = ProductRequiredController.getProduct2s();
        System.assertEquals(product2s[0].Name,'Snickers');

    }
}