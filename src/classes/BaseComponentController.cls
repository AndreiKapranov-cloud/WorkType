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

    @AuraEnabled(cacheable=true)
    public static List<Skill> getSkills() {
        List<Skill> skillsList = new List<Skill>();
        try {
            skillsList = [
                    SELECT Id,MasterLabel
                    FROM Skill
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return skillsList;
    }

}