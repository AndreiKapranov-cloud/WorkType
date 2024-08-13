import {LightningElement, api} from 'lwc';
import createSkillRequirementApexMethod
    from '@salesforce/apex/SkillRequirementController.createSkillRequirementApexMethod';
import getRecordsGenericApex
    from '@salesforce/apex/BaseComponentController.getRecordsGenericApex';

import {genericShowToast} from "c/utils";

export default class NewSkillRequirement extends LightningElement {

    static renderMode = "light";
    genericShowToast = genericShowToast.bind(this);
    skills = [];
    skillRequired;
    skillLevel;
    @api workTypeRecordId;
    @api workTypeObject;
    @api workTypeName;
    error;
    isLoading = true;
    skillRequirementJsonObject = {};
    paramsJSONString = [];
    getRecordsParamsJsonObject = {};
    nameOfFieldAfterWhereClause = '';
    valueOfFieldAfterWhereClause = '';


    displayNewProductRequiredInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewProductRequired',
                'workTypeName': this.workTypeName,
                'workTypeRecordId': this.workTypeRecordId
            }
        }));
    }


    validateSkillLevel() {

        let skillLevelInput = this.refs?.skillLevel;

        return skillLevelInput.checkValidity();
    }


    connectedCallback() {

        this.getRecordsParamsJsonObject.fieldToQuery = 'MasterLabel';
        this.getRecordsParamsJsonObject.sObjectName = 'Skill';
        this.getRecordsParamsJsonObject.nameOfFieldAfterWhereClause = this.nameOfFieldAfterWhereClause;
        this.getRecordsParamsJsonObject.valueOfFieldAfterWhereClause = this.valueOfFieldAfterWhereClause;

        this.getRecordsParamsJSONString = JSON.stringify(this.getRecordsParamsJsonObject);


        console.log(this.getRecordsParamsJSONString);
        getRecordsGenericApex(
            {
                getRecordsParamsJSONString: this.getRecordsParamsJSONString
            })
            .then(result => {
                console.log('getRecordsGenericApex result from js : ', result);
                this.skills = result;
                this.skillRequired = this.skills[0].Id;
                console.log('this.skillRequired: ', this.skillRequired);
                console.log('this.skills: ', this.skills);
            })
            .catch(error => {
                console.log(error);
                console.log('Error getting PickList values');
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

        if (this.validateSkillLevel()) {
            this.isLoading = true;

            this.skillRequirementJsonObject.relatedRecordId = this.workTypeRecordId;
            this.skillRequirementJsonObject.skillId = this.skillRequired;
            this.skillRequirementJsonObject.skillLevel = this.skillLevel;

            this.paramsJSONString = JSON.stringify(this.skillRequirementJsonObject);

            console.log('workType Id = ' + this.workTypeRecordId);
            console.log('workType Name = ' + this.workTypeName);
            console.log('List of skills for skill req = ' + this.skills);
            console.log('final skillRequired for skill req = ' + this.skillRequired);
            console.log('final skillLevel for skill req = ' + this.skillLevel);


            createSkillRequirementApexMethod({
                paramsJSONString: this.paramsJSONString
            })
                .then(result => {
                    console.log(result);
                    this.genericShowToast('Success!', 'Skill Requirement Record is created Successfully!', 'success');
                    // this.showNewSkillRequirementComponent = false;
                    // this.showNewProductRequiredComponent = true;
                    this.displayNewProductRequiredInBase();
                })
                .catch(error => {
                    console.log('Error creating Skill Requirement Record');
                    console.log(error);
                    this.genericShowToast('Error creating Skill Requirement Record', error.body.message, 'error');

                })
                .finally(() => this.isLoading = false);
        }
    }
}