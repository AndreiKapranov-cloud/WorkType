import {LightningElement, api} from 'lwc';
import createSkillRequirementApexMethod
    from '@salesforce/apex/SkillRequirementController.createSkillRequirementApexMethod';
import getSkills from '@salesforce/apex/SkillRequirementController.getSkills';
import {genericShowToast} from "c/utils";

export default class NewSkillRequirement extends LightningElement {


    genericShowToast = genericShowToast.bind(this);
    skills = [];
    skillRequired;
    skillLevel;
    @api workTypeRecordId;
    @api workTypeObject;
    @api workTypeName;
    error;
    showNewSkillRequirementComponent = true;
    showNewProductRequiredComponent = false;
    isLoading = true;

    validateSkillLevel() {

        let skilllevelInput = this.refs?.skillLevel;

        return skilllevelInput.checkValidity();
    }


    connectedCallback() {

        getSkills()
            .then(result => {
                this.skills = result;
                this.skillRequired = this.skills[0].Id;
                console.log('this.skillRequired: ', this.skillRequired);
                console.log('this.skills: ', this.skills);
            })
            .catch(error => {
                console.log(error);
                console.log('error createWorkType');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });
        this.isLoading = false;
    }

    handleChangeSkillRequired(e) {
        this.skillRequired = e.target.value;

    }

    handleChangeSkillLevel(e) {
        this.skillLevel = e.target.value;

    }

    createSkillRequirement() {
        console.log('validate :' + this.validateSkillLevel());
        if (this.validateSkillLevel()) {
            this.isLoading = true;

            console.log('workType Id = ' + this.workTypeRecordId);
            console.log('workType Name = ' + this.workTypeName);
            console.log('List of skills for skill req = ' + this.skills);
            console.log('final skillRequired for skill req = ' + this.skillRequired);
            console.log('final skillLevel for skill req = ' + this.skillLevel);


            createSkillRequirementApexMethod({
                relatedRecordId: this.workTypeRecordId,
                skillId: this.skillRequired,
                skillLevel: this.skillLevel
            })
                .then(result => {
                    console.log(result);
                    this.isLoaded = true;
                    this.genericShowToast('Success!', 'Skill Requirement Record is created Successfully!', 'success');
                    this.showNewSkillRequirementComponent = false;
                    this.showNewProductRequiredComponent = true;
                })
                .catch(error => {
                    console.log('Error creating Skill Requirement Record');
                    console.log(error);
                    this.isLoaded = true;
                    this.genericShowToast('Error creating Skill Requirement Record', error.body.message, 'error');

                })
                .finally(() => this.isLoading = false);
        }
    }
}