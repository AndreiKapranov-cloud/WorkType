
@IsTest
public with sharing class SkillRequirementControllerTest {
    @IsTest
    static void testCreateSkillRequirementApexMethod() {

        WorkOrder workOrder = TestDataFactory.createWorkOrder();
        Skill skill = [SELECT Id FROM Skill LIMIT 1];

        SkillRequirementCreationParamsWrapper wrapper = new SkillRequirementCreationParamsWrapper();
        wrapper.relatedRecordId = workOrder.Id;
        wrapper.skillId = skill.Id;
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
        } catch (HandledException ex) {

            System.assertEquals('The following exception has occurred: Unexpected character (\'s\' (code 115)): expected a valid value (number, String, array, object, \'true\', \'false\' or \'null\') at input location [1,2]', ex.getMessage());

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
