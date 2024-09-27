public with sharing class WorkOrderController {

    @AuraEnabled
    public static WorkOrder createWorkOrderApexMethod(String paramsJSONString) {

        WorkOrder workOrder = new WorkOrder();

        try {

            CreateWorkOrderParamsWrapper wrapper = (CreateWorkOrderParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateWorkOrderParamsWrapper.class);

            Id workTypeId = wrapper.workTypeId;
            String status = wrapper.status;
            String priority = wrapper.priority;
            String subject = wrapper.subject;
            String description = wrapper.description;

            workOrder = new WorkOrder(WorkTypeId = workTypeId, Status = status, Priority = priority,
                    Subject = subject, Description = description);

            insert workOrder;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrder;
    }
}