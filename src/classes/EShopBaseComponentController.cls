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

    /*@AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesByRecordTypeId(Id recordTypeId) {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {

            string endpoint = 'https://playful-moose-wfyi55-dev-ed.trailblaze.my.salesforce.com/services/data/v61.0/ui-api/object-info/Good__c/picklist-values/' + recordTypeId;

            HttpRequest req = new HttpRequest();

            String sessionId = UserInfo.getOrganizationId() + UserInfo.getSessionId().substring(15);
            req.setHeader('Authorization', 'Bearer ' + sessionId);
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            Http http = new Http();
            HTTPResponse res = http.send(req);
            System.debug(res.getBody());


            Map<String, Object> basicMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

            Map<String, Object> pickListFieldValuesMap = (Map<String, Object>) basicMap.get('picklistFieldValues');

            Map<String, Object> SubCategoryMap = (Map<String, Object>) pickListFieldValuesMap.get('SubCategory__c');

            List<Object> valuesMapsList = (List<Object>) SubCategoryMap.get('values');

            List<Object>valuesList = new List<Object>();

            for (Object valuesMap : valuesMapsList) {
                valuesList.add(((Map<String, Object>) valuesMap).get('value'));
            }
            System.debug(valuesList);

            for (Object value : valuesList) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', (String)value);
                valueMap.put('value', (String)value);
                values.add(valueMap);
            }
            System.debug(valuesList);

        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }

        return values;
    }
*/
    public static String getSessionIdFromVFPage()
    {
        String sSessionId = '';
        PageReference sessionIdPage = Page.TestSessionId;
        String vfContent = sessionIdPage.getContent().toString();
        System.debug(vfContent);
        Integer startPosition = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length();
        Integer endPosition = vfContent.indexOf('End_Of_Session_Id');
        sSessionId = vfContent.substring(startPosition, endPosition);
        return sSessionId;
    }


    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesByRecordTypeId(Id recordTypeId) {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {

            System.debug('recordTypeId:      ' + recordTypeId);
         //   Id recordTypeId = '012dL000002kbhlQAA';
            String baseUrl =  URL.getSalesforceBaseUrl().toExternalForm();
            System.debug('baseUrl:' + baseUrl);
         //   String baseUrl = URL.getOrgDomainUrl().toExternalForm();
            String endpoint = baseUrl + '/services/data/v61.0/ui-api/object-info/Good__c/picklist-values/' + recordTypeId;

            HttpRequest req = new HttpRequest();
         //   String sessionId = getSessionIdFromVFPage();

            String sessionId = '00DdL000007ZV7l!AQEAQLzaonsuheI4VhOS3sB.taN0jXdk1yfgDCPkgwJG7FtCqOJpGLg2XCdMrr1hZik3x4_wuSDi3MUo22X32ajubmANxumI';
     //    String sessionId = UserInfo.getOrganizationId().substring(0, 15) + ' ' + UserInfo.getSessionId().substring(15);
          //  String sessionId = UserInfo.getOrganizationId() + UserInfo.getSessionId().substring(15);

            System.debug('sessionId:      ' + sessionId);

        /*    req.setHeader('Authorization', 'Bearer ' + sessionId);//UserInfo.getSessionId());
            req.setHeader('Authorization', 'OAuth ' + sessionId);//UserInfo.getSessionId());
*/

            req.setEndpoint('callout:Vecherelo/services/data/v61.0/ui-api/object-info/Good__c/picklist-values/' + recordTypeId);
            req.setHeader('Content-Type', 'application/json;');
            req.setMethod('GET');
            Http http = new Http();
            HTTPResponse res = http.send(req);
            System.debug(res.getBody());

            System.debug('res.getStatusCode' + res.getStatusCode());


            if(res.getStatusCode()==200){}

        /*    Map<String, Object> basicMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

            Map<String, Object> pickListFieldValuesMap = (Map<String, Object>) basicMap.get('picklistFieldValues');

            Map<String, Object> SubCategoryMap = (Map<String, Object>) pickListFieldValuesMap.get('SubCategory__c');

            List<Object> valuesMapsList = (List<Object>) SubCategoryMap.get('values');

            List<Object>valuesList = new List<Object>();

            for (Object valuesMap : valuesMapsList) {

                System.debug('valuesMap:      ' + valuesMap);

                Map<String, Object> CastedValuesMap = (Map<String, Object>) valuesMap;
                System.debug('CastedValuesMap     :' + CastedValuesMap);
                valuesList.add(CastedValuesMap.get('value'));
           //     valuesList.add(((Map<String, Object>) valuesMap).get('value'));
            }
            System.debug(valuesList);

            for (Object value : valuesList) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', (String) value);
                valueMap.put('value', (String) value);
                values.add(valueMap);
            }
            System.debug(values);
*/
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }
}