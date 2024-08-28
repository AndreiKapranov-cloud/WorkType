/**
 * Created by andrey on 8/27/24.
 */

public with sharing class SelectGoodController {



   /* @AuraEnabled(cacheable=true)
    public static List<GoodLineItemWrapper>fetchGoodLineItems(String searchText, String subCategory) {*/
        @AuraEnabled(cacheable=true)
        public static List<GoodLineItemWrapper>fetchGoodLineItems(String searchText) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name
                            FROM GoodLineItem__c
                            WHERE Good__r.Name LIKE:searchKey
                    ]);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return goodLineItemWrappers;
    }

    @AuraEnabled(cacheable=true)
    public static List<GoodLineItemWrapper>fetchGoodLineItemsInCategory(String searchText, String category) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name
                            FROM GoodLineItem__c
                            WHERE Good__r.Category__c =: category AND Good__r.Name LIKE:searchKey
                    ]);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return goodLineItemWrappers;
    }

    @AuraEnabled(cacheable=true)
    public static List<GoodLineItemWrapper>fetchGoodLineItemsInSubCategory(String searchText, String subCategory) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name
                            FROM GoodLineItem__c
                            WHERE Good__r.Subcategory__c =: subCategory AND Good__r.Name LIKE:searchKey
                    ]);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return goodLineItemWrappers;
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper> getGoodLineItemWrapperObjectsBySubCategory(String subCategory) {
        List<SObject> goodLineItems = new List<SObject>();
        try {

            String query = 'SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name FROM GoodLineItem__c WHERE Good__r.SubCategory__c = ' + '\'' + subCategory + '\'';
            goodLineItems = EShopBaseComponentController.getRecordsBySOQL(query);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return getGoodLineItemWrapperList(goodLineItems);
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper> getGoodLineItemWrapperObjectsByCategory(String category) {
        List<SObject> goodLineItems = new List<SObject>();
        try {

            String query = 'SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name FROM GoodLineItem__c WHERE Good__r.Category__c = ' + '\'' + category + '\'';
            goodLineItems = EShopBaseComponentController.getRecordsBySOQL(query);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return getGoodLineItemWrapperList(goodLineItems);
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper> getGoodLineItemWrapperList(List<GoodLineItem__c>goodLineItems) {
        List<GoodLineItemWrapper> wrapperList = new List<GoodLineItemWrapper>();
        for (GoodLineItem__c goodLineItem : goodLineItems) {
            GoodLineItemWrapper goodLineItemWrapper = new GoodLineItemWrapper();

            goodLineItemWrapper.id = goodLineItem.Id;
            goodLineItemWrapper.name = goodLineItem.Good__r.Name;
            goodLineItemWrapper.quantity = goodLineItem.Quantity__c;
            goodLineItemWrapper.supplierName = goodLineItem.Supplier__r.Name;
            goodLineItemWrapper.size = goodLineItem.Good__r.Size__c;
            goodLineItemWrapper.colour = goodLineItem.Good__r.Colour__c;

            wrapperList.add(goodLineItemWrapper);
        }

        return wrapperList;
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper> getGoodLineItemWrappersByIds(List<String> goodLineItemsIds) {

        List<GoodLineItem__c> goodLineItems;
        try {

            // String query = 'SELECT Id,Name,Quantity__c,Supplier__r.Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c FROM GoodLineItem__c WHERE Id IN: ' + '\'' + goodLineItemsIds + '\' LIMIT 1';
            goodLineItems = [SELECT Id,Name,Quantity__c,Supplier__r.Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c FROM GoodLineItem__c WHERE Id IN:goodLineItemsIds];


        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return getGoodLineItemWrapperList(goodLineItems);
    }
}