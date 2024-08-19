/**
 * Created by andrey on 8/12/24.
 */

public with sharing class CreateProductRequiredParamsWrapper extends SamodelkinWrapper{

    public Id parentRecordId;
    public Id product2Id;
    public Decimal quantityRequired;
    public String quantityUnitOfMeasure;
}