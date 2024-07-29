public with sharing class SkillController {
    public SkillController() {
    }

    @AuraEnabled(cacheable=true)
    public static List<Skill> getSkills() {
        return [
            SELECT Id,MasterLabel
            FROM Skill
            Limit 20
       ];
    }
}