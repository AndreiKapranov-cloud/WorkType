public with sharing class WorkTypeController {

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

    @AuraEnabled
    public static List<SObject> getWorkTypes() {
        List<SObject> workTypeList = new List<SObject>();
        try {

            String query = 'SELECT Id,Name FROM WorkType';
            workTypeList = BaseComponentController.getRecordsBySOQL(query);
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workTypeList;
    }

    @AuraEnabled
    public static SObject getWorkTypeNameById(Id id) {
        SObject workType = new WorkType();
        String workTypeIdString = id.to15();
        System.debug('Id from getWorkTypeNameById :' + id);
        try {
            String query =
                    'SELECT Name FROM WorkType WHERE Id = ' + '\'' + workTypeIdString + '\'';

            workType = (BaseComponentController.getRecordsBySOQL(query))[0];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return workType;
    }

}