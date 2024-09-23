/**
 * Created by andrey on 9/23/24.
 */
@IsTest
public with sharing class TestDataFactory {

    public static Cart__c createCart() {

        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);

        insert cart;

        return cart;

    }


    public static List<EShopOrder__c> createEShopOrders() {

        Cart__c cart = createCart();
        GoodLineItem__c goodLineItem = createGoodLineItem();


        List<EShopOrder__c> orders = new List<EShopOrder__c>();

        for (Integer i = 0; i < 4; i++) {
            EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(),Quantity__c = 4, EstimatedDeliveryDate__c = Date.today().addDays(1), Cart__c = cart.Id,Good_Line_Item__c = goodLineItem.Id);
            orders.add(eShopOrder);
        }

        insert orders;

        return orders;

    }


    public static GoodLineItem__c createGoodLineItem() {

        GoodLineItem__c goodLineItem = new GoodLineItem__c(Name = 'Nike', Quantity__c = 77);

        insert goodLineItem;

        return goodLineItem;

    }


    public static String createEshopOrderParamsWrapperJSONString() {
        CreateEshopOrderParamsWrapper createEshopOrderParamsWrapper = new CreateEshopOrderParamsWrapper();
        List<CreateEshopOrderParamsWrapper> createEshopOrderParamsWrappers = new List<CreateEshopOrderParamsWrapper>();


        Cart__c cart = TestDataFactory.createCart();
        GoodLineItem__c goodLineItem = TestDataFactory.createGoodLineItem();

        createEshopOrderParamsWrapper.eShopOrderGoodQuantity = 5;
        createEshopOrderParamsWrapper.estimatedDeliveryDate = Date.today();
        createEshopOrderParamsWrapper.cartId = cart.Id;
        createEshopOrderParamsWrapper.registrationDate = Date.today();
        createEshopOrderParamsWrapper.goodLineItemId = goodLineItem.Id;

        createEshopOrderParamsWrappers.add(createEshopOrderParamsWrapper);

        return JSON.serialize(createEshopOrderParamsWrappers);
    }
}