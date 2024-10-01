
@isTest
public with sharing class WorkOrderLineItemControllerTest {

    @IsTest
    static void testCreateWorkOrderLineItemApexMethod() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
        WorkType workType = TestDataFactory.createWorkType();


        WorkOrderLineItemCreationParamsWrapper wrapper = new WorkOrderLineItemCreationParamsWrapper();

        wrapper.status = 'New';
        wrapper.workOrderId = workOrder.Id;
        wrapper.description = 'Building';
        wrapper.workTypeId = workType.Id;

        String paramsJSONString = JSON.serialize(wrapper);


        WorkOrderLineItem workOrderLineItem = WorkOrderLineItemController.createWorkOrderLineItemApexMethod(paramsJSONString);

        System.assertEquals(workOrderLineItem.Status, 'New');
        System.assertEquals(workOrderLineItem.Description, 'Building');

    }

    @IsTest
    static void testCreateWorkOrderLineItemApexMethodFail() {

        Test.startTest();

        try {

            WorkOrderLineItem workOrderLineItem = WorkOrderLineItemController.createWorkOrderLineItemApexMethod('vx');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'v\' (code 118)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }

    @IsTest
    static void testGetWorkOrderNumberById() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
       WorkOrder workOrderFromSOQL = [SELECT Id,WorkOrderNumber FROM WorkOrder LIMIT 1];
        SObject workOrderFromBase = WorkOrderLineItemController.getWorkOrderNumberById(workOrder.Id);

        System.assertEquals(workOrderFromSOQL, workOrderFromBase);

    }

    @IsTest
    static void testGetWorkOrderNumberByIdFail() {

        Test.startTest();

        try {

            SObject workOrderFromBase = WorkOrderLineItemController.getWorkOrderNumberById('ds');
        } catch (System.StringException ex) {

            System.assertEquals('Invalid id: ds', ex.getMessage());

        }

        Test.stopTest();
    }
}