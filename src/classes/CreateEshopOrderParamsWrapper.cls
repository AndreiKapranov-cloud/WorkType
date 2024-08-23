/**
 * Created by andrey on 8/23/24.
 */

public with sharing class CreateEshopOrderParamsWrapper {

    public Decimal eShopOrderGoodQuantity;
    public Date estimatedDeliveryDate;
    public Id cartId;
    public Date registrationDate;
    public Id goodLineItemId;
}