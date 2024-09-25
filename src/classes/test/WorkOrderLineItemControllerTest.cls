/**
 * Created by andrey on 9/25/24.
 */
@isTest
public with sharing class WorkOrderLineItemControllerTest {


    @IsTest
    static void testCreateWorkOrderLineItemApexMethod() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
        WorkType workType = TestDataFactory.createWorkType();


        CreateWorkOrderLineItemParamsWrapper wrapper = new CreateWorkOrderLineItemParamsWrapper();

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
    static void testGetWorkOrderNumberById() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
        List<WorkOrder> workOrders= [SELECT Id,WorkOrderNumber FROM WorkOrder];
        SObject workOrderFromBase = WorkOrderLineItemController.getWorkOrderNumberById(workOrder.Id);

        System.assertEquals(workOrders[0], workOrderFromBase);

    }
}