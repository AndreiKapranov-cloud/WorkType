/**
 * Created by andrey on 8/5/24.
 */

public with sharing class WorkOrderLineItemController {

    @AuraEnabled
    public static WorkOrderLineItem createWorkOrderLineItemApexMethod(String status, Id workOrderId, Id workTypeId, String description) {

        WorkOrderLineItem workOrderLineItem = new WorkOrderLineItem();

        try {
            workOrderLineItem = new WorkOrderLineItem(Status = status, WorkOrderId = workOrderId, WorkTypeId = workTypeId,
                    Description = description);
            insert workOrderLineItem;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrderLineItem;
    }

    @AuraEnabled
    public static WorkOrder getWorkOrderNumberById(Id workOrderId) {
        WorkOrder workOrder = new WorkOrder();
        try {
            workOrder = [
                    SELECT WorkOrderNumber
                    FROM WorkOrder
                    WHERE Id = :workOrderId
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workOrder;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getStatusPicklistValues() {

        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = WorkOrderLineItem.Status.getDescribe().getPicklistValues();

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
}