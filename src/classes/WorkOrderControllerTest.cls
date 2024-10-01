
@isTest
public with sharing class WorkOrderControllerTest {

    @IsTest
    static void testCreateWorkOrderApexMethod() {

        WorkType workType = TestDataFactory.createWorkType();
        WorkOrderCreationParamsWrapper wrapper = new WorkOrderCreationParamsWrapper();

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
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'s\' (code 115)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }

}