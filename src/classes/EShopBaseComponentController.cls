

public with sharing class EShopBaseComponentController {

    @AuraEnabled
    public static List<Map<String, String>> getCategoryPicklistValuesUsingApex() {
        List<Map<String, String>> values = new List<Map<String, String>>();
        try {
            List<Schema.PicklistEntry> entries = Schema.getGlobalDescribe().get('Good__c')?.getDescribe()?.fields?.getMap()?.get('Category__c')?.getDescribe()?.getPicklistValues();

            for (Schema.PicklistEntry entry : entries) {
                Map<String, String> valueMap = new Map<String, String>();
                valueMap.put('label', entry?.getLabel());
                valueMap.put('value', entry?.getValue());
                values.add(valueMap);
            }
            return values;
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @TestVisible
    private static Map<String, List <String>> getGlobalPickList() {

        try {
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

            String jsonString2 = JSON.serialize(dependentValues);
            System.debug(jsonString2);

            List<MyPiclistInfo> infos = (List<MyPiclistInfo>) JSON.deserialize(jsonString2, List<MyPiclistInfo>.class);

            System.debug('infos:' + infos);
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
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }


    @TestVisible
    private static List<Map<String, String>> getSubCategoryPickListValuesByCategoryName(String categoryName) {

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
            return values;
        } catch (Exception e) {

            System.debug('The following exception has occurred: ' + e.getMessage());

            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForSneakersCategory() {

        return getSubCategoryPickListValuesByCategoryName('Sneakers');
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForHoodiesCategory() {

        return getSubCategoryPickListValuesByCategoryName('Hoodies');
    }

    @AuraEnabled
    public static List<Map<String, String>> getSubCategoryPickListValuesForCostumesCategory() {

        return getSubCategoryPickListValuesByCategoryName('Costumes');
    }

    @TestVisible
    private static void changeCartEstimatedDeliveryDate(List<EShopOrder__c> eShopOrders) {
        try {

            if (eShopOrders.size() > 0) {
                Cart__c cart = [
                        SELECT Id,EstimatedDeliveryDate__c
                        FROM Cart__c
                        WHERE Id = :eShopOrders[0].Cart__c
                ];


                for (EShopOrder__c eShopOrder : eShopOrders) {

                    if (cart.EstimatedDeliveryDate__c == null || cart.EstimatedDeliveryDate__c < eShopOrder.EstimatedDeliveryDate__c) {

                        cart.EstimatedDeliveryDate__c = eShopOrder.EstimatedDeliveryDate__c;
                    }
                }

                update cart;
            }
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException(e.getMessage());
        }

    }

    @TestVisible
    private static void changeGoodLineItemQuantity(List<EShopOrder__c> eShopOrders) {

        try {
            List<String> goodLineItemIds = new List<String>();
            for (EShopOrder__c eShopOrder : eShopOrders) {
                goodLineItemIds.add(eShopOrder.Good_Line_Item__c);
            }

            List<GoodLineItem__c> goodLineItems = [SELECT Id,Quantity__c FROM GoodLineItem__c WHERE Id IN:goodLineItemIds];

            for (GoodLineItem__c goodLineItem : goodLineItems) {

                for (EShopOrder__c eShopOrder : eShopOrders) {
                    System.debug('eShopOrder :' + eShopOrder);
                    if (eShopOrder.Good_Line_Item__c == goodLineItem.Id) {
                        goodLineItem.Quantity__c -= eShopOrder.Quantity__c;
                        System.debug('eShopOrder.Quantity__c :' + eShopOrder.Quantity__c);
                        System.debug('goodLineItem.Quantity__c  :' + goodLineItem.Quantity__c);
                    }
                }
            }

            update goodLineItems;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException(e.getMessage());
        }
    }

    @TestVisible
    private static List<EShopOrder__c> createOrderWrappersAndOrders(String paramsJSONString) {
        try {
            List<CreateEshopOrderParamsWrapper> wrappers = (List<CreateEshopOrderParamsWrapper>) JSON.deserialize(paramsJSONString,
                    List<CreateEshopOrderParamsWrapper>.class);


            List<EShopOrder__c> eshopOrders = new List<EShopOrder__c>();

            for (CreateEshopOrderParamsWrapper wrapper : wrappers) {

                Integer eShopOrderGoodQuantity = wrapper.eShopOrderGoodQuantity;
                Date estimatedDeliveryDate = wrapper.estimatedDeliveryDate;
                Id cartId = wrapper.cartId;
                Date registrationDate = Date.today();
                Id goodLineItemId = wrapper.goodLineItemId;

                EShopOrder__c eshopOrder = new EShopOrder__c(Quantity__c = eShopOrderGoodQuantity, EstimatedDeliveryDate__c = estimatedDeliveryDate,
                        Cart__c = cartId, RegistrationDate__c = registrationDate, Good_Line_Item__c = goodLineItemId);

                eshopOrders.add(eshopOrder);
            }


            return eshopOrders;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static List<EShopOrder__c> createEshopOrders(String paramsJSONString) {

        try {

            List<EShopOrder__c> eShopOrders = createOrderWrappersAndOrders(paramsJSONString);

            insert eShopOrders;

            List<AsyncApexJob> asyncApexJobs = [
                    SELECT Id, CronTriggerId
                    FROM AsyncApexJob
                    WHERE ApexClass.Name = :'CartStatusChangeScheduler' AND Status = 'Queued'
            ];

            if (asyncApexJobs.isEmpty()) {
                CartScheduler.scheduleCartStatusChange();
            }

            if (eShopOrders.size() > 0) {
                changeCartEstimatedDeliveryDate(eShopOrders);
                changeGoodLineItemQuantity(eShopOrders);
            }
            return eShopOrders;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
    }
}