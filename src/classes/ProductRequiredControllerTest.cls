
@IsTest
public with sharing class ProductRequiredControllerTest {

    @IsTest
    static void testCreateProductRequiredApexMethod() {
        WorkOrder workOrder = new WorkOrder();
        insert workOrder;

        ProductRequiredCreationParamsWrapper cParamsWrapper = new ProductRequiredCreationParamsWrapper();

        cParamsWrapper.parentRecordId = workOrder.Id;
        cParamsWrapper.product2Id = TestDataFactory.createProduct2().Id;
        cParamsWrapper.quantityRequired = 2;
        cParamsWrapper.quantityUnitOfMeasure = 'Each';

        String paramsJSONString = JSON.serialize(cParamsWrapper);

        ProductRequired productRequired = ProductRequiredController.createProductRequiredApexMethod(paramsJSONString);

       ProductRequired productRequiredFromBase = [SELECT Id,QuantityUnitOfMeasure,QuantityRequired FROM ProductRequired LIMIT 1];

        System.assertEquals(productRequiredFromBase.quantityRequired, 2);
        System.assertEquals(productRequiredFromBase.quantityUnitOfMeasure, 'Each');

    }

    @IsTest
    static void testCreateProductRequiredApexMethodFail() {

        Test.startTest();

        try {

            ProductRequired productRequired = ProductRequiredController.createProductRequiredApexMethod('dv');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'d\' (code 100)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

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