public with sharing class SkillRequirementController {
    public SkillRequirementController() {
    }

    @AuraEnabled(cacheable=true)
    public static List<Skill> getSkills() {
        return [
                SELECT Id,MasterLabel
                FROM Skill
                Limit 20
        ];
    }
    @AuraEnabled
    public static SkillRequirement createSkillRequirementApexMethod(Id relatedRecordId, Id skillId, Decimal skillLevel) {


        SkillRequirement skillRequirement = new SkillRequirement();

        try {
            skillRequirement = new SkillRequirement(RelatedRecordId = relatedRecordId, SkillId = skillId, SkillLevel = skillLevel);
            insert skillRequirement;

        } catch (Exception e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
        return skillRequirement;
    }
}