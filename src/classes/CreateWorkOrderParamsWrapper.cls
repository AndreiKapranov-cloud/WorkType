/**
 * Created by andrey on 8/12/24.
 */

public with sharing class CreateWorkOrderParamsWrapper extends SamodelkinWrapper{

    public Id workTypeId;
    public String status;
    public String priority;
    public String subject;
    public String description;

}