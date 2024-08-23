/**
 * Created by andrey on 8/20/24.
 */

public with sharing class EShopBaseComponentController {
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

    @AuraEnabled
    public static List<SObject> getGoodLineItemsBySubCategory(String subCategory) {
        List<SObject> goodLineItemsList = new List<SObject>();
        try {

            String query = 'SELECT Id,Name,Quantity__c,Supplier__r.Name FROM GoodLineItem__c WHERE Good__r.SubCategory__c = ' + '\'' + subCategory + '\'';
            goodLineItemsList = getRecordsBySOQL(query);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return goodLineItemsList;
    }

    @AuraEnabled
    public static List<Map<String, String>> getCategoryPicklistValuesUsingApex() {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get('Good__c')?.getDescribe()?.fields?.getMap()?.get('Category__c')?.getDescribe()?.getPickListValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry?.getLabel());
                valueMap.put('value', entry?.getValue());
                values.add(valueMap);
            }

        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }

    /* @AuraEnabled
     public static Map<String, String> getGoodRecordTypeIdsUsingApex() {

         Map<String, String>recordTypeMap = new Map<String, String>();
         try {
             String snickersRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName()?.get('Sneakers')?.getRecordTypeId();
             String hoodiesRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName()?.get('Hoodies')?.getRecordTypeId();
             String costumesRecordTypeID = Schema.SObjectType.Good__c.getRecordTypeInfosByName()?.get('Costumes')?.getRecordTypeId();

             recordTypeMap.put('Sneakers', snickersRecordTypeID);
             recordTypeMap.put('Hoodies', hoodiesRecordTypeID);
             recordTypeMap.put('Costumes', costumesRecordTypeID);
         } catch (Exception e) {

             System.debug('The following exception has occurred: ' + e.getMessage());

             throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
         }
         return recordTypeMap;
     }*/


    /* public static String getSessionIdFromVFPage() {
         String sSessionId = '';
         try {
             PageReference sessionIdPage = Page.TestSessionId;
             String vfContent = sessionIdPage?.getContent().toString();
             System.debug(vfContent);
             Integer startPosition = vfContent?.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length();
             Integer endPosition = vfContent?.indexOf('End_Of_Session_Id');
             sSessionId = vfContent?.substring(startPosition, endPosition);
         } catch (Exception e) {

             System.debug('The following exception has occurred: ' + e.getMessage());

             throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
         }
         return sSessionId;
     }

 */


    /*@AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesByRecordTypeId(Id recordTypeId) {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {

            System.debug('recordTypeId:      ' + recordTypeId);
            String baseUrl = URL.getSalesforceBaseUrl()?.toExternalForm();
            System.debug('baseUrl:' + baseUrl);
            String endpoint = baseUrl + '/services/data/v61.0/ui-api/object-info/Good__c/picklist-values/' + recordTypeId;

            HttpRequest req = new HttpRequest();
            String sessionId = getSessionIdFromVFPage();

            String sessionIdzalupa = UserInfo.getOrganizationId()?.substring(0, 15) + UserInfo.getSessionId()?.substring(15);

            System.debug('sessionId:      ' + sessionIdzalupa);
            System.debug('sessionId:      ' + Blob.valueOf(sessionIdzalupa));
            System.debug('sessionId:      ' + Blob.valueOf(sessionIdzalupa).toString());

            req?.setHeader('Authorization', 'Bearer ' + sessionId);

            System.debug('UserInfo.getOrganizationId()' + UserInfo.getOrganizationId()?.substring(0, 15));
            System.debug(UserInfo.getSessionId()?.substring(15));
            System.debug('req.getHeader : ' + req?.getHeader('Authorization'));


            req.setEndpoint(endpoint);
            req.setHeader('Content-Type', 'application/json;');
            req.setMethod('GET');
            Http http = new Http();
            HTTPResponse res = http.send(req);
            System.debug(res?.getBody());

            System.debug('res.getStatusCode' + res?.getStatusCode());


            if (res?.getStatusCode() == 200) {

                Map<String, Object> basicMap = (Map<String, Object>) JSON.deserializeUntyped(res?.getBody());

                Map<String, Object> pickListFieldValuesMap = (Map<String, Object>) basicMap?.get('picklistFieldValues');

                Map<String, Object> SubCategoryMap = (Map<String, Object>) pickListFieldValuesMap?.get('SubCategory__c');

                List<Object> valuesMapsList = (List<Object>) SubCategoryMap?.get('values');

                for (Object valuesMap : valuesMapsList) {

                    System.debug('valuesMap:      ' + valuesMap);

                    Map<String, Object> castedValuesMap = (Map<String, Object>) valuesMap;
                    System.debug('CastedValuesMap     :' + CastedValuesMap);

                    Map<String, String> valueMap = new Map<String, String>();
                    valueMap.put('label', (String) castedValuesMap?.get('value'));
                    valueMap.put('value', (String) castedValuesMap?.get('value'));
                    values?.add(valueMap);
                }
            }
            System.debug(values);
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }
*/

    public static Map<String, List <String>> getGlobalPickList() {
        String objectName = 'Good__c';
        String controllingField = 'Category__c';
        String dependentField = 'SubCategory__c';

        Map<String, List<String>> controllingInfo = new Map<String, List<String>>();

        List<Schema.PicklistEntry> controllingValues = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(controllingField).getDescribe().getPicklistValues();

        List<Schema.PicklistEntry> dependentValues
                = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(dependentField).getDescribe().getPicklistValues();

        for (Schema.PicklistEntry controllingValue : controllingValues) {
            controllingInfo.put(controllingValue.getLabel(), new List<String>());
        }

        for (Schema.PicklistEntry currDependentValue : dependentValues) {

            String jsonString = JSON.serialize(currDependentValue);

            System.debug(jsonString);
            MyPiclistInfo info = (MyPiclistInfo) JSON.deserialize(jsonString, MyPiclistInfo.class);

            System.debug(info);

            String hexString = EncodingUtil.convertToHex(EncodingUtil.base64Decode(info.validFor)).toUpperCase();

            System.debug(hexString);
            Integer baseCount = 0;
            for (Integer curr : hexString.getChars()) {

                Integer val = 0;

                if (curr >= 65) {
                    val = curr - 65 + 10;
                } else {
                    val = curr - 48;
                }
                if ((val & 8) == 8) {
                    controllingInfo.get(controllingValues[baseCount + 0].getLabel()).add(currDependentValue.getLabel());
                }
                if ((val & 4) == 4) {
                    controllingInfo.get(controllingValues[baseCount + 1].getLabel()).add(currDependentValue.getLabel());
                }
                if ((val & 2) == 2) {
                    controllingInfo.get(controllingValues[baseCount + 2].getLabel()).add(currDependentValue.getLabel());
                }
                if ((val & 1) == 1) {
                    controllingInfo.get(controllingValues[baseCount + 3].getLabel()).add(currDependentValue.getLabel());
                }
                baseCount += 4;
            }
        }
        System.debug(controllingInfo);
        return controllingInfo;
    }


    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesCategoryName(String categoryName) {

        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            Map<String, List <String>> globalPicklistValues = getGlobalPickList();
            List<String> subCategoryPicklistValues = globalPicklistValues.get(categoryName);
            for (String item : subCategoryPicklistValues) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', item);
                valueMap.put('value', item);
                values.add(valueMap);
            }

        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return values;
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForSneakersCategory() {

        return getSubCategoryPickListValuesCategoryName('Sneakers');
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForHoodiesCategory() {

        return getSubCategoryPickListValuesCategoryName('Hoodies');
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForCostumesCategory() {

        return getSubCategoryPickListValuesCategoryName('Costumes');
    }

    @AuraEnabled
    public static Sobject getGoodLineItemById(String goodLineItemId) {
        //    String idString = Id.valueOf('goodLineItemId');
        SObject goodLineItem;
        try {

            String query = 'SELECT Id,Name,Quantity__c,Supplier__r.Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c FROM GoodLineItem__c WHERE Id = ' + '\'' + goodLineItemId + '\' LIMIT 1';
            //   String query = 'SELECT Id,Name,Quantity__c,Supplier__r.Name,Good__r.Size__c,Good__r.Colour__c FROM GoodLineItem__c WHERE Good__r.SubCategory__c = ' + '\'' + goodLineItemId + '\' LIMIT 1';
            List<SObject>GoodLineItemList = getRecordsBySOQL(query);
            If (!GoodLineItemList.isEmpty()) {
                goodLineItem = GoodLineItemList[0];
            }
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return goodLineItem;
    }

    @AuraEnabled
    public static EShopOrder__c createEshopOrderMethod(String paramsJSONString) {

        EShopOrder__c eshopOrder = new EShopOrder__c();

        try {

            CreateEshopOrderParamsWrapper wrapper = (CreateEshopOrderParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateEshopOrderParamsWrapper.class);

            Decimal eShopOrderGoodQuantity = wrapper.eShopOrderGoodQuantity;
            Date estimatedDeliveryDate = wrapper.estimatedDeliveryDate;
            Id cartId = wrapper.cartId;
            Date registrationDate = Date.today();
            Id goodLineItemId = wrapper.goodLineItemId;

            eshopOrder = new EShopOrder__c(Quantity__c = eShopOrderGoodQuantity, EstimatedDeliveryDate__c = estimatedDeliveryDate,
            Cart__c = cartId, RegistrationDate__c = registrationDate,Good_Line_Item__c = goodLineItemId);
            insert eshopOrder;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return eshopOrder;
    }
}