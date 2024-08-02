import { LightningElement,wire,api,track} from 'lwc';
import SKILL_REQUIREMENT_OBJECT from '@salesforce/schema/SkillRequirement';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import WORK_TYPE from '@salesforce/schema/SkillRequirement.RelatedRecordId';
import SKILL from '@salesforce/schema/SkillRequirement.SkillId';
import SKILL_LEVEL from '@salesforce/schema/SkillRequirement.SkillLevel';
import getSkills from '@salesforce/apex/SkillController.getSkills';

export default class NewSkillRequirement extends LightningElement {

    skills = [];
    skillRequired;
    skillLevel;
    @api workTypeRecordId;
    @api workTypeObject;
    @api workTypeName;
    error;
    showParentComponent = true;
    showChildComponent = false;

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
     }

    handleChange(e) {

        // if (e.target.name === "skillRequired") {
        //     this.skillRequired = this.template.querySelector('select.slds-select').value;
            if (e.target.name === "skillRequired") {
                this.skillRequired = e.target.value;
        } else if (e.target.name === "skillLevel") {
            this.skillLevel = e.target.value;
        }
      }

    createSkillRequirement() {

    const fields = {};

    console.log('workType Id = ' + this.workTypeRecordId);
    console.log('workType Name = ' + this.workTypeName);
    console.log('List of skills for skill req = ' + this.skills);
    console.log('final skillRequired for skill req = ' + this.skillRequired);
    console.log('final skillLevel for skill req = ' + this.skillLevel);
    fields[WORK_TYPE.fieldApiName] = this.workTypeRecordId;
    fields[SKILL.fieldApiName] = this.skillRequired;
    fields[SKILL_LEVEL.fieldApiName] = this.skillLevel;

    const recordInput = { apiName: SKILL_REQUIREMENT_OBJECT.objectApiName, fields:fields};
    try {
        createRecord(recordInput)
            .then(r =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Skill Requirement created',
                        variant: 'success'
                    })
                );
            } );
        this.showParentComponent = false;
        this.showChildComponent = true;
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Skill Requirement record',
                message: error,
                variant: 'error'
            })
        );
      }
    }
  }