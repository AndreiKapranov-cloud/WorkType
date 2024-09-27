public with sharing class SkillRequirementController {

    @AuraEnabled
    public static SkillRequirement createSkillRequirementApexMethod(String paramsJSONString) {

        SkillRequirement skillRequirement = new SkillRequirement();

        try {
            CreateSkillRequirementParamsWrapper wrapper = (CreateSkillRequirementParamsWrapper) JSON.deserialize(paramsJSONString,
                    CreateSkillRequirementParamsWrapper.class);

            Id relatedRecordId = wrapper.relatedRecordId;
            Id skillId = wrapper.skillId;
            Decimal skillLevel = wrapper.skillLevel;

            skillRequirement = new SkillRequirement(RelatedRecordId = relatedRecordId, SkillId = skillId, SkillLevel = skillLevel);
            insert skillRequirement;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new HandledException('The following exception has occurred: ' + e.getMessage());
        }
        return skillRequirement;
    }

    @AuraEnabled
    public static List<Skill> getSkills() {
        List<Skill> skillsList = new List<Skill>();
        try {
            skillsList = [
                    SELECT Id,MasterLabel
                    FROM Skill
            ];
        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return skillsList;
    }
}