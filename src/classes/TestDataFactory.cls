
@IsTest
public with sharing class TestDataFactory {

    public static WorkType createWorkType() {
        WorkType workType = new WorkType(Name = 'Building', EstimatedDuration = 5);
        insert workType;
        return workType;
    }


    public static WorkOrder createWorkOrder() {
        WorkOrder workOrder = new WorkOrder();
        insert workOrder;
        return workOrder;
    }

    private static Cart__c createCart() {

        Buyer__c buyer = createBuyer();

        Cart__c cart = new Cart__c(Buyer__c = buyer.Id, Pickup_Point_Address__c = 'Grodno', Status__c = 'Formed', Done__c = false);

        insert cart;

        return cart;

    }

    public static Buyer__c createBuyer() {
        Buyer__c buyer = new Buyer__c(Address__c = 'LLLL', Email__c = 'akapranov8722@gmail.com');
        insert buyer;

        return buyer;
    }


    public static List<EShopOrder__c> createEShopOrders() {

        Cart__c cart = createCart();
        GoodLineItem__c goodLineItem = createGoodLineItem();


        List<EShopOrder__c> orders = new List<EShopOrder__c>();

        for (Integer i = 0; i < 4; i++) {
            EShopOrder__c eShopOrder = new EShopOrder__c(RegistrationDate__c = Date.today(), Quantity__c = 4,
                    EstimatedDeliveryDate__c = Date.today().addDays(1), Cart__c = cart.Id, Good_Line_Item__c = goodLineItem.Id, Done__c = false);
            orders.add(eShopOrder);
        }

        insert orders;

        return orders;

    }


    public static GoodLineItem__c createGoodLineItem() {

        Good__c good = new Good__c(Price__c = 5, Category__c = 'Hoodies', Name = 'Hoodie', Colour__c = 'Black', Subcategory__c = 'With cowl', Size__c = '2');
        insert good;

        GoodLineItem__c goodLineItem = new GoodLineItem__c(Name = 'Hoodie', Quantity__c = 77, Good__c = good.Id);



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


    public static Schema.Location createLocation() {
        Schema.Location loc = new Schema.Location();

        loc.Longitude = 28.635308;
        loc.Latitude = 28.635308;
        loc.Name = 'Naroch';
        loc.IsInventoryLocation = true;
        insert loc;
        return loc;
    }

    public static Product2 createProduct2() {

        Product2 product2 = new Product2(Name = 'Snickers', Description = 'Field Service');
        insert product2;
        return product2;
    }
}