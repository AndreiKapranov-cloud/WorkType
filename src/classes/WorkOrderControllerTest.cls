
@isTest
public with sharing class WorkOrderControllerTest {

    @IsTest
    static void testCreateWorkOrderApexMethod() {

        WorkType workType = TestDataFactory.createWorkType();
        CreateWorkOrderParamsWrapper wrapper = new CreateWorkOrderParamsWrapper();

        wrapper.workTypeId = workType.Id;
        wrapper.status = 'On Hold';
        wrapper.priority = 'Low';
        wrapper.subject = 'Soloduha';
        wrapper.description = 'Taburetka';


        String paramsJSONString = JSON.serialize(wrapper);

        WorkOrder workOrder = WorkOrderController.createWorkOrderApexMethod(paramsJSONString);

        System.assertEquals(workOrder.Priority, 'Low');
        System.assertEquals(workOrder.Subject, 'Soloduha');
        System.assertEquals(workOrder.Description, 'Taburetka');
    }

    @IsTest
    static void testCreateWorkOrderApexMethodFail() {

        Test.startTest();

        try {

            WorkOrder workOrder = WorkOrderController.createWorkOrderApexMethod('ss');
        } catch (AuraHandledException ex) {

            System.assertEquals('Script-thrown exception', ex.getMessage());

        }

        Test.stopTest();
    }

}