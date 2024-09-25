/**
 * Created by andrey on 9/25/24.
 */
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
}

