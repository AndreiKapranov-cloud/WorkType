/**
 * Created by andrey on 8/12/24.
 */

public with sharing class CreateWorkOrderLineItemParamsWrapper extends SamodelkinWrapper{

    public String status;
    public Id workOrderId;
    public Id workTypeId;
    public String description;
}