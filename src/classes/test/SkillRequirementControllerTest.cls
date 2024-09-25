/**
 * Created by andrey on 9/25/24.
 */
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
    static void testgetSkills() {
        List<Skill>skills = SkillRequirementController.getSkills();
            System.assertEquals(skills[0].MasterLabel, 'Wheel replacement');
            System.assertEquals(skills.size(), 3);

        }
    }
