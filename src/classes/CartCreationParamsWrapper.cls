

public with sharing class CartCreationParamsWrapper {

    public Id buyerId;
    public Date estimatedDeliveryDate;
    public String pickupPointAddress;
    public String status;
    public List<EshopOrderCreationParamsWrapper> orders;
}