

public with sharing class CreateCartParamsWrapper {

    public Id buyerId;
    public Date estimatedDeliveryDate;
    public String pickupPointAddress;
    public String status;
    public List<CreateEshopOrderParamsWrapper> orders;
}