import {LightningElement, wire, api, track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
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
    showParentComponent = true;
    showChildComponent = false;
    isLoaded = false;
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
                this.error = error.message;
                console.log('error createWorkType');
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error getting PickList values',
                        message: error,
                        variant: 'error'
                    })
                );
            });
        this.isLoaded = true;
    }

    handleChange(e) {

        if (e.target.name === "skillRequired") {
            this.skillRequired = e.target.value;
        } else if (e.target.name === "skillLevel") {
            this.skillLevel = e.target.value;
        }
    }

    createSkillRequirement() {

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
                this.genericShowToast('Success!', 'Skill Requirement Record is created Successfully!', 'success');
                this.showParentComponent = false;
                this.showChildComponent = true;
            })
            .catch(error => {
                console.log('Error creating Skill Requirement Record');
                console.log(error);

                this.genericShowToast('Error creating Skill Requirement Record', error.body.message, 'error');

            });
    }
}