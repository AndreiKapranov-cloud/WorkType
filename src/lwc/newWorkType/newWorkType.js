import {LightningElement} from 'lwc';
import getPicklistValuesUsingApex from '@salesforce/apex/BaseComponentController.getPicklistValuesUsingApex';
import createWorkTypeApexMethod from '@salesforce/apex/WorkTypeController.createWorkTypeApexMethod';
import {genericShowToast} from "c/utils";

export default class NewWorkType extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    isLoading = true;
    workTypeName;
    picklistValues = [];
    shouldAutoCreateSvcAppt = false;
    workTypeRecordId;
    durationType = '';
    workTypeNameValid = false;
    paramsJSONString = [];
    workTypeJsonObject = {};
    static renderMode = "light";

    displayNewSkillRequirementInBase() {
        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewSkillRequirement',
                'workTypeRecordId': this.workTypeRecordId,
                'workTypeName': this.workTypeName,
                'workTypeObject': this.workTypeObject
            }
        }));
    }


    handleshouldAutoCreateSvcApptChange(e) {
        this.shouldAutoCreateSvcAppt = e.target.checked;
    }

    handleDurationTypeChange(e) {
        this.durationType = e.target.value;
    }

    handleEstimatedDurationChange(e) {
        this.estimatedDuration = e.target.value;
    }

    handleDescriptionChange(e) {
        this.description = e.target.value;
    }


    handleWorkTypeNameChange(e) {

        let target = e.target;
        this.name = e.target.value;
        console.log('name = ' + this.name);
        console.log(this.name.includes(` `));
        const isWhitespaceString = str => !str.replace(/\s/g, '').length;

        if (isWhitespaceString(this.name) || this.name === '') {
            target.setCustomValidity('Complete this field.');
            this.workTypeNameValid = false;
        } else {
            target.setCustomValidity('');
            this.workTypeNameValid = true;

        }
    }

    validateEstimatedDuration() {
        let estimatedDurationInput = this.refs?.estimatedDuration;
        estimatedDurationInput.reportValidity();
        return estimatedDurationInput.checkValidity();

    }

    validateDurationType() {
        let durationTypeInput = this.refs?.durationType;
        durationTypeInput.reportValidity();
        return durationTypeInput.checkValidity();
    }

    validateWorkTypeName() {
        let workTypeNameInput = this.refs?.workTypeName;
        workTypeNameInput.reportValidity();
        return workTypeNameInput.checkValidity();
    }

    connectedCallback() {

        getPicklistValuesUsingApex(({
            sObjectType: 'WorkType',
            field: 'DurationType'
        }))
            .then(result => {
                this.picklistValues = result;
                console.log('this.picklistValues: ', this.picklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Duration Type Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');

            });

        this.isLoading = false;
    }

    checkWorkTypeInputFields() {
        let isWorkTypeNameValid = this.validateWorkTypeName();
        let isEstimatedDurationValid = this.validateEstimatedDuration();
        let isDurationTypeValid = this.validateDurationType();

        return isWorkTypeNameValid && isEstimatedDurationValid && isDurationTypeValid && this.workTypeNameValid;
    }

    createWorkType() {

        if (this.checkWorkTypeInputFields()) {
            this.isLoading = true;
            this.workTypeJsonObject.workTypeName = this.name;
            this.workTypeJsonObject.description = this.description;
            this.workTypeJsonObject.estimatedDuration = this.estimatedDuration;
            this.workTypeJsonObject.durationType = this.durationType;
            this.workTypeJsonObject.shouldAutoCreateSvcAppt = this.shouldAutoCreateSvcAppt;

            this.paramsJSONString = JSON.stringify(this.workTypeJsonObject);

            console.log('createWorkType:'+ this.paramsJSONString);


            createWorkTypeApexMethod(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
                    console.log(result);
                    console.log('ID: ', result.Id);
                    this.workTypeObject = result;
                    this.workTypeRecordId = result.Id;
                    this.workTypeName = result.Name;

                    console.log('workTypeObject = ' + this.workTypeObject);

                    console.log('record.Name = ' + result.Name);
                    this.genericShowToast('Success!', 'Work Type Record is created Successfully!', 'success');
                    this.displayNewSkillRequirementInBase();
                })
                .catch(error => {
                    console.log('error createWorkType');
                    console.log(error);
                    this.genericShowToast('Error creating Work Type.', error.body.message, 'error');
                }).finally(
                () => {
                    this.isLoading = false;
                }
            )

        } else {
            this.genericShowToast('Error creating Work Type.', 'Please, complete required fields properly', 'error');
        }

    }
}








