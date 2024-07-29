import { LightningElement,wire,api,track} from 'lwc';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import WORK_TYPE_NAME from "@salesforce/schema/WorkType.Name";
import SKILL_REQUIREMENT_OBJECT from '@salesforce/schema/SkillRequirement';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import WORK_TYPE from '@salesforce/schema/SkillRequirement.RelatedRecordId';
import SKILL from '@salesforce/schema/SkillRequirement.SkillId';
import SKILL_LEVEL from '@salesforce/schema/SkillRequirement.SkillLevel';
import getSkills from '@salesforce/apex/SkillController.getSkills';
import { getFieldDisplayValue } from "lightning/uiRecordApi";
const WORK_TYPE_FIELDS = [WORK_TYPE_NAME];


export default class NewSkillRequirement extends LightningElement {
    skills;
    skillData = [];
    skillRequired;
    skillLevel;
    defaultSkillValue;
    @api workTypeRecordId;

    @api workTypeObject;
    @api workTypeName;
  
    workTypeId;
    error;
    showParentComponent = true;
    showChildComponent = false;
    

    @wire(getSkills) skills;

    // @wire(getRecord, { recordId: "$workTypeRecordId", WORK_TYPE_FIELDS })
    // workType;

    // get workTypeName() {
    //     return getFieldValue(this.workType.data, WORK_TYPE_NAME);
    //   }

     


    handleChange(e) {

        if (e.target.name === "skillRequired") {
            this.skillRequired = this.template.querySelector('select.slds-select').value;
        } else if (e.target.name === "skillLevel") {
            this.skillLevel = e.target.value;
        }
      }

    async createSkillRequirement() {
    console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);//без этой строчки не работает
    
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
        const skillRequirement = await createRecord(recordInput);
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Skill Requirement created',
                variant: 'success'
            })
        );
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Skill Requirement record',
                message: error,
                variant: 'error'
            })
        );
    }
    this.showParentComponent = false;
    this.showChildComponent = true;
    }
  }