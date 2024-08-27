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

        SObject goodLineItem;
        try {

            String query = 'SELECT Id,Name,Quantity__c,Supplier__r.Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c FROM GoodLineItem__c WHERE Id = ' + '\'' + goodLineItemId + '\' LIMIT 1';

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
                    Cart__c = cartId, RegistrationDate__c = registrationDate, Good_Line_Item__c = goodLineItemId);
            insert eshopOrder;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return eshopOrder;
    }
}