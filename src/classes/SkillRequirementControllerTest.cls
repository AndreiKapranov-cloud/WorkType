
@IsTest
public with sharing class SkillRequirementControllerTest {
    @IsTest
    static void testCreateSkillRequirementApexMethod() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
        List<Skill>skills = [SELECT Id FROM Skill];


        CreateSkillRequirementParamsWrapper wrapper = new CreateSkillRequirementParamsWrapper();
        wrapper.relatedRecordId = workOrder.Id;
        wrapper.skillId = skills[0].Id;
        wrapper.skillLevel = 5;
        String paramsJSONString = JSON.serialize(wrapper);


        SkillRequirement skillRequirement = SkillRequirementController.createSkillRequirementApexMethod(paramsJSONString);
        System.assertEquals(skillRequirement.SkillLevel, 5);

    }


    @IsTest
    static void testCreateSkillRequirementApexMethodFail() {

        Test.startTest();

        try {

            SkillRequirement skillRequirement = SkillRequirementController.createSkillRequirementApexMethod('sc');
        } catch (AuraHandledException ex) {

            System.assertEquals('Script-thrown exception', ex.getMessage());

        }

        Test.stopTest();
    }


    @IsTest
    static void testGetSkills() {
        List<Skill>skills = SkillRequirementController.getSkills();
            System.assertEquals(skills[0].MasterLabel, 'Wheel replacement');
            System.assertEquals(skills.size(), 3);

        }
    }
