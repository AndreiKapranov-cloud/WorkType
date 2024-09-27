
@IsTest
public with sharing class WorkTypeControllerTest {

    @IsTest
    static void testCreateWorkTypeApexMethod() {


        CreateWorkTypeParamsWrapper wrapper = new CreateWorkTypeParamsWrapper();

        wrapper.workTypeName = 'handkerchief';
        wrapper.description = 'Good work';
        wrapper.estimatedDuration = 4;
        wrapper.durationType = 'Minutes';
        wrapper.shouldAutoCreateSvcAppt = true;

        String paramsJSONString = JSON.serialize(wrapper);

        WorkType workType = WorkTypeController.createWorkTypeApexMethod(paramsJSONString);
        System.assertEquals(workType.Name, 'handkerchief');
        System.assertEquals(workType.Description, 'Good work');
        System.assertEquals(workType.DurationType, 'Minutes');

    }

    @IsTest
    static void testCreateWorkTypeApexMethodFail() {

        Test.startTest();

        try {

            WorkType workType = WorkTypeController.createWorkTypeApexMethod('sdv');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'s\' (code 115)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

        }

        Test.stopTest();
    }


    @IsTest
    static void testgetWorkTypes() {

        WorkType workType = TestDataFactory.createWorkType();
        List<SObject>workTypes = WorkTypeController.getWorkTypes();

        System.assertEquals(workTypes.size(), 1);

    }


    @IsTest
    static void testGetWorkTypeNameById() {

        WorkType workType = TestDataFactory.createWorkType();

        SObject workTypeFromBase = WorkTypeController.getWorkTypeNameById(workType.Id);


        System.assertEquals(workType.Name, workTypeFromBase.get('Name'));

    }


    @IsTest
    static void testGetWorkTypeNameByIdFail() {

        Test.startTest();

        try {

            SObject workTypeFromBase = WorkTypeController.getWorkTypeNameById('dvz');
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: The following exception has occurred: invalid ID field: dvz', ex.getMessage());

        }

        Test.stopTest();
    }

}

