public with sharing class WorkOrderController {
    public WorkOrderController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPriorityPicklistValues() {
        List<Schema.PicklistEntry> entries = WorkOrder.Priority.getDescribe().getPicklistValues();
        List<Map<String, String>> values = new List<Map<String, String>>();
        for (Schema.PicklistEntry entry : entries) {
            Map<String, String> valueMap = new Map<String, String>();
            valueMap.put('label', entry.getLabel());
            valueMap.put('value', entry.getValue());
            values.add(valueMap);
        }
        return values;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getStatusPicklistValues() {
        List<Schema.PicklistEntry> entries = WorkOrder.Status.getDescribe().getPicklistValues();
        List<Map<String, String>> values = new List<Map<String, String>>();
        for (Schema.PicklistEntry entry : entries) {
            Map<String, String> valueMap = new Map<String, String>();
            valueMap.put('label', entry.getLabel());
            valueMap.put('value', entry.getValue());
            values.add(valueMap);
        }
        return values;
    }

}