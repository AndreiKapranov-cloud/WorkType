public with sharing class WorkTypeController {
    public WorkTypeController() {

    }
    @AuraEnabled
    public static List<WorkType> getWorkTypes() {
        return [
                SELECT Id,Name
                FROM WorkType
        ];
    }

    @AuraEnabled
    public static List<WorkType> getWorkTypeNameById(Id id) {
        return [
                SELECT Name
                FROM WorkType
                WHERE Id = :id
        ];
    }

    @AuraEnabled
    public static WorkType createWorkTypeApexMethod(String workTypeName, String description, Decimal estimatedDuration, String durationType) {

        WorkType workTypeRecord = new WorkType();

        try {
            workTypeRecord = new WorkType(Name = workTypeName, Description = description, EstimatedDuration = estimatedDuration,
                    DurationType = durationType);
            insert workTypeRecord;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeRecord;
    }

    @AuraEnabled
    public static List<Map<String, String>> getDurationTypePicklistValues() {
        List<Schema.PicklistEntry> entries = WorkType.DurationType.getDescribe().getPicklistValues();
        List<Map<String, String>> values = new List<Map<String, String>>();
        for (Schema.PicklistEntry entry : entries) {
            Map<String, String> valueMap = new Map<String, String>();
            valueMap.put('label', entry.getLabel());
            valueMap.put('value', entry.getValue());
            values.add(valueMap);
        }
        return values;
    }

    @AuraEnabled
    public static List<String> getPicklistValuesUsingApex(String sObjectType, String field) {
        List<String> picklistValues = new List<String>();
        try {

            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get(sObjectType).getDescribe().fields.getMap().get(field).getDescribe().getPickListValues();

            for (Schema.PicklistEntry entry : entries) {
                picklistValues.add(entry.getValue());
            }
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return picklistValues;
    }

}