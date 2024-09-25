/**
 * Created by andrey on 8/12/24.
 */

public with sharing class BaseComponentController {

    @AuraEnabled
    public static List<Map<String, String>> getPicklistValuesUsingApex(String getPicklistValuesParamsJSONString) {
        GetPicklistValuesParamsWrapper wrapper = (GetPicklistValuesParamsWrapper) JSON.deserialize(getPicklistValuesParamsJSONString,
                GetPicklistValuesParamsWrapper.class);

        String sObjectType = wrapper.sObjectType;
        String field = wrapper.field;

        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get(sObjectType).getDescribe().fields.getMap().get(field).getDescribe().getPickListValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry.getLabel());
                valueMap.put('value', entry.getValue());
                values.add(valueMap);
            }
            return values;
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<SObject> getRecordsBySOQL(String query) {
        List<SObject> records = new List<SObject>();
        try {
            return Database.query(query);

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

}