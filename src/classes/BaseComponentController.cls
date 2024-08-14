/**
 * Created by andrey on 8/12/24.
 */

public with sharing class BaseComponentController {

    @AuraEnabled
    public static List<Map<String, String>> getPicklistValuesUsingApex(String getPicklistValuesParamsJSONString) {
        getPicklistValuesParamsWrapper wrapper = (getPicklistValuesParamsWrapper) JSON.deserialize(getPicklistValuesParamsJSONString,
                getPicklistValuesParamsWrapper.class);

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

        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }

    public static List<SObject> getRecordsBySOQL(String query) {
        List<SObject> records = new List<SObject>();
        try {
            records = Database.query(query);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
        return records;
    }

    /*@AuraEnabled
   public static List<SObject> getRecordsGenericApex(String getRecordsParamsJSONString) {

       try {
           getRecordsWrapper wrapper = (getRecordsWrapper) JSON.deserialize(getRecordsParamsJSONString,
                   getRecordsWrapper.class);

           String fieldToQueryWithEscapedSingleQuotes = String.escapeSingleQuotes(wrapper.fieldToQuery);
           String nameOfFieldAfterWhereClause = String.escapeSingleQuotes(wrapper.nameOfFieldAfterWhereClause);
           String valueOfFieldAfterWhereClause = wrapper.valueOfFieldAfterWhereClause;
           String sObjectName = String.escapeSingleQuotes(wrapper.sObjectName);

            *//* String query = 'SELECT ' + fieldToQueryWithEscapedSingleQuotes + ' FROM ' + sObjectName;
               if (String.isBlank(nameOfFieldAfterWhereClause)) {

                   records = Database.query(shortQuary);
                   return records;
               } else {
                   String query = shortQuary + ' WHERE ' + nameOfFieldAfterWhereClause + ' = \'' + valueOfFieldAfterWhereClause + '\'';

                   records = Database.query(query);
                   return records;
               }*//*
            String query = 'SELECT ' + fieldToQueryWithEscapedSingleQuotes + ' FROM ' + sObjectName;

            if (!String.isBlank(nameOfFieldAfterWhereClause)) {
                query += ' WHERE ' + nameOfFieldAfterWhereClause + ' = \'' + valueOfFieldAfterWhereClause + '\'';
            }
            return Database.query(query);


        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }*/

}