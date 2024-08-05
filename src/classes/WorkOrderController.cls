public with sharing class WorkOrderController {
    public WorkOrderController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPriorityPicklistValues() {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = WorkOrder.Priority.getDescribe().getPicklistValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry.getLabel());
                valueMap.put('value', entry.getValue());
                values.add(valueMap);
            }
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getStatusPicklistValues() {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = WorkOrder.Status.getDescribe().getPicklistValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry.getLabel());
                valueMap.put('value', entry.getValue());
                values.add(valueMap);
            }
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }

    @AuraEnabled
    public static WorkOrder createWorkOrderApexMethod(Id workTypeId, String status, String priority, String subject, String description) {

        WorkOrder workOrder = new WorkOrder();

        try {
            workOrder = new WorkOrder(WorkTypeId = workTypeId, Status = status, Priority = priority,
                    Subject = subject, Description = description);
            insert workOrder;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrder;
    }

}