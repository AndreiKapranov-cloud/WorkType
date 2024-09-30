
public with sharing class SelectGoodController {


    @AuraEnabled
    public static List<GoodLineItemWrapper> fetchGoodLineItems() {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();

        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name,Good__r.Category__c,Good__r.Subcategory__c
                            FROM GoodLineItem__c WHERE Quantity__c > 0
                    ]);
            return goodLineItemWrappers;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }


    @AuraEnabled
    public static List<GoodLineItemWrapper> fetchGoodLineItemsInGlobalSearch(String searchText) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name,Good__r.Category__c,Good__r.Subcategory__c
                            FROM GoodLineItem__c
                            WHERE Good__r.Name LIKE:searchKey
                    ]);
            return goodLineItemWrappers;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper>fetchGoodLineItemsInCategory(String searchText, String category) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name,Good__r.Category__c,Good__r.Subcategory__c
                            FROM GoodLineItem__c
                            WHERE Good__r.Category__c = :category AND Good__r.Name LIKE:searchKey
                    ]);
            return goodLineItemWrappers;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<GoodLineItemWrapper> fetchGoodLineItemsInSubCategory(String searchText, String subCategory) {
        List<GoodLineItemWrapper> goodLineItemWrappers = new List<GoodLineItemWrapper>();
        String searchKey = '%' + searchText + '%';
        try {
            goodLineItemWrappers =
                    getGoodLineItemWrapperList([
                            SELECT Id,Name,Good__r.Size__c,Good__r.Name,Good__r.Colour__c,Quantity__c,Supplier__r.Name,Good__r.Category__c,Good__r.Subcategory__c
                            FROM GoodLineItem__c
                            WHERE Good__r.Subcategory__c = :subCategory AND Good__r.Name LIKE:searchKey
                    ]);
            return goodLineItemWrappers;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @TestVisible
    private static List<GoodLineItemWrapper> getGoodLineItemWrapperList(List<GoodLineItem__c>goodLineItems) {
        List<GoodLineItemWrapper> wrapperList = new List<GoodLineItemWrapper>();
        try {
            for (GoodLineItem__c goodLineItem : goodLineItems) {
                GoodLineItemWrapper goodLineItemWrapper = new GoodLineItemWrapper();

                goodLineItemWrapper.id = goodLineItem.Id;
                goodLineItemWrapper.name = goodLineItem.Good__r.Name;
                goodLineItemWrapper.quantity = (Integer) goodLineItem.Quantity__c;
                goodLineItemWrapper.supplierName = goodLineItem.Supplier__r.Name;
                goodLineItemWrapper.size = goodLineItem.Good__r.Size__c;
                goodLineItemWrapper.colour = goodLineItem.Good__r.Colour__c;
                goodLineItemWrapper.category = goodLineItem.Good__r.Category__c;
                goodLineItemWrapper.subCategory = goodLineItem.Good__r.Subcategory__c;
                goodLineItemWrapper.checked = false;


                wrapperList.add(goodLineItemWrapper);

            }
            return wrapperList;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }
}