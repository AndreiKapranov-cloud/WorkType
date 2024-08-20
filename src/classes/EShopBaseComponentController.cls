/**
 * Created by andrey on 8/20/24.
 */

public with sharing class EShopBaseComponentController {

    @AuraEnabled
    public static List<Map<String, String>> getPicklistValuesUsingApex(String fieldName) {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get('Good__c').getDescribe().fields.getMap().get(fieldName).getDescribe().getPickListValues();

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
    public static Map<String, String> getGoodRecordTypeIdsUsingApex() {

        Map<String, String>recordTypeMap = new Map<String, String>();
        try {
            String snickersRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName().get('Sneakers').getRecordTypeId();
            String hoodiesRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName().get('Hoodies').getRecordTypeId();
            String costumesRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName().get('Costumes').getRecordTypeId();

            recordTypeMap.put('Sneakers', snickersRecordTypeID);
            recordTypeMap.put('Hoodies', hoodiesRecordTypeID);
            recordTypeMap.put('Costumes', costumesRecordTypeID);
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return recordTypeMap;
    }


}