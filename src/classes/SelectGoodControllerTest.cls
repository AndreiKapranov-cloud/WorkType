
@IsTest
public with sharing class SelectGoodControllerTest {

    @IsTest
    static void testFetchGoodLineItems() {

        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        Good__c good = [SELECT Id,Name,Category__c, Colour__c FROM Good__c WHERE Id = :goodLineItem.Good__c];
        System.debug('goodLineItem : ' + goodLineItem);

        List<GoodLineItemWrapper> goodLineItemWrappers = SelectGoodController.fetchGoodLineItems();
        System.debug('goodLineItemWrappers : ' + goodLineItemWrappers);

        GoodLineItemWrapper goodLineItemWrapper = goodLineItemWrappers[0];


        System.assertEquals(good.Name, goodLineItemWrapper.name);
        System.assertEquals(good.Category__c, goodLineItemWrapper.category);
        System.assertEquals(good.Colour__c, goodLineItemWrapper.colour);

    }

    @IsTest
    static void testFetchGoodLineItemsInGlobalSearch() {
        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        List<GoodLineItemWrapper>goodLineItemWrappers = SelectGoodController.fetchGoodLineItemsInGlobalSearch('oo');
        System.assertEquals(goodLineItemWrappers[0].name, 'Hoodie');
        List<GoodLineItemWrapper>goodLineItemWrappersEmpty = SelectGoodController.fetchGoodLineItemsInGlobalSearch('k');
        System.assertEquals(goodLineItemWrappersEmpty.isEmpty(), true);
    }

    @IsTest
    static void testFetchGoodLineItemsInCategory() {
        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        List<GoodLineItemWrapper>goodLineItemWrappers = SelectGoodController.fetchGoodLineItemsInCategory('oo', 'Hoodies');
        GoodLineItemWrapper goodLineItemWrapper = goodLineItemWrappers[0];
        System.assertEquals(goodLineItemWrapper.name, 'Hoodie');
        System.assertEquals(goodLineItemWrapper.quantity, 77);

    }

    @IsTest
    static void testFetchGoodLineItemsInSubCategory() {
        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        List<GoodLineItemWrapper>goodLineItemWrappers = SelectGoodController.fetchGoodLineItemsInSubCategory('oo', 'With cowl');
        GoodLineItemWrapper goodLineItemWrapper = goodLineItemWrappers[0];
        System.assertEquals(goodLineItemWrapper.name, 'Hoodie');
        System.assertEquals(goodLineItemWrapper.quantity, 77);

    }

    @IsTest
    static void testGetGoodLineItemWrapperList() {
        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();
        List<GoodLineItem__c> goodLineItems = new List<GoodLineItem__c>();
        goodLineItems.add(goodLineItem);

        List<GoodLineItemWrapper> goodLineItemWrappers = SelectGoodController.getGoodLineItemWrapperList(goodLineItems);
        System.debug(goodLineItemWrappers);

        GoodLineItemWrapper goodLineItemWrapper = goodLineItemWrappers[0];
        System.assertEquals(goodLineItemWrapper.quantity, 77);
    }
}












