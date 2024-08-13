/**
 * Created by andrey on 8/12/24.
 */

public with sharing class BaseComponentController {

    @AuraEnabled
    public static List<Map<String, String>> getPicklistValuesUsingApex(String sObjectType, String field) {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get(sObjectType).getDescribe().fields.getMap().get(field).getDescribe().getPickListValues();

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
    public static WorkType createWorkTypeApexMethod(String paramsJSONString) {
        WorkType workTypeRecord = new WorkType();
        try {
            CreateWorkTypeParamsWrapper wrapper = (CreateWorkTypeParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateWorkTypeParamsWrapper.class);

            String workTypeName = wrapper.workTypeName;
            String description = wrapper.description;
            Decimal estimatedDuration = wrapper.estimatedDuration;
            String durationType = wrapper.durationType;
            Boolean shouldAutoCreateSvcAppt = wrapper.shouldAutoCreateSvcAppt;

            workTypeRecord = new WorkType(Name = workTypeName, Description = description, EstimatedDuration = estimatedDuration,
                    DurationType = durationType, ShouldAutoCreateSvcAppt = shouldAutoCreateSvcAppt);
            insert workTypeRecord;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeRecord;
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecordsGenericApex(String getRecordsParamsJSONString) {

        try {
            List<SObject> records = new List<SObject>();
            getRecordsWrapper wrapper = (getRecordsWrapper) JSON.deserialize(getRecordsParamsJSONString,
                    getRecordsWrapper.class);

            String fieldToQueryWithEscapedSingleQuotes = String.escapeSingleQuotes(wrapper.fieldToQuery);
            String nameOfFieldAfterWhereClause = String.escapeSingleQuotes(wrapper.nameOfFieldAfterWhereClause);
            String valueOfFieldAfterWhereClause = wrapper.valueOfFieldAfterWhereClause;
            String sObjectName = String.escapeSingleQuotes(wrapper.sObjectName);

            String shortQuary = 'SELECT ' + fieldToQueryWithEscapedSingleQuotes + ' FROM ' + sObjectName;
            if (String.isBlank(nameOfFieldAfterWhereClause)) {
                records = Database.query(shortQuary);
                return records;
            } else {
                String query = shortQuary + ' WHERE ' + nameOfFieldAfterWhereClause + ' = \'' + valueOfFieldAfterWhereClause + '\'';
                records = Database.query(query);
                return records;
            }
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }
}