/**
 * Created by andrey on 9/25/24.
 */
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
}