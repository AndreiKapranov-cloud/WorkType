public with sharing class WorkTypeController {


    @AuraEnabled
    public static List<WorkType> getWorkTypes() {
        List<WorkType> workTypeList = new List<WorkType>();
        try {

            workTypeList = [
                    SELECT Id,Name
                    FROM WorkType
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeList;
    }





    @AuraEnabled
    public static List<WorkType> getWorkTypeNameById(Id id) {
        List<WorkType> workTypeList = new List<WorkType>();

        try {
            workTypeList = [
                    SELECT Name
                    FROM WorkType
                    WHERE Id = :id
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeList;
    }



    @AuraEnabled
    public static WorkType createWorkTypeApexMethod(String paramsJSONString) {
        WorkType workTypeRecord = new WorkType();
        try {
            CreateWorkTypeParamsWrapper wrapper = (CreateWorkTypeParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateWorkTypeParamsWrapper.class);

            String workTypeName = wrapper.workTypeName;
            String description = wrapper.description;
            Decimal estimatedDuration = wrapper.estimatedDuration;
            String durationType = wrapper.durationType;
            Boolean shouldAutoCreateSvcAppt = wrapper.shouldAutoCreateSvcAppt;

            workTypeRecord = new WorkType(Name = workTypeName, Description = description, EstimatedDuration = estimatedDuration,
                    DurationType = durationType, ShouldAutoCreateSvcAppt = shouldAutoCreateSvcAppt);
            insert workTypeRecord;
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeRecord;
    }
}