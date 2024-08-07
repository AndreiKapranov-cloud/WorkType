import {LightningElement} from 'lwc';
import getDurationTypePicklistValues from '@salesforce/apex/WorkTypeController.getDurationTypePicklistValues';
import createWorkTypeApexMethod from '@salesforce/apex/WorkTypeController.createWorkTypeApexMethod';
import {genericShowToast} from "c/utils";

export default class NewWorkType extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    isLoading = true;
    workTypeName;
    picklistValues = [];
    shouldAutoCreateSvcAppt = false;
    showNewWorkTypeComponent = true;
    showNewSkillRequirementComponent = false;
    workTypeRecordId;
    durationType = '';
    disableBtn = false;
    workTypeNameValid = false;


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

        //   this.name.includes(` `) ||
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

        getDurationTypePicklistValues()
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
        // console.log('validateEstimatedDuration :' + this.validateEstimatedDuration());
        // console.log('validateDurationType :' + this.validateDurationType());
        // console.log('validateWorkTypeName :' + this.validateWorkTypeName());
        // console.log('workTypeNameValid :' + this.workTypeNameValid);
        console.log(this.checkWorkTypeInputFields())
        if (this.checkWorkTypeInputFields()) {
            this.isLoading = true;
            console.log('createWorkType');
            console.log('estimated duration =' + this.estimatedDuration);
            createWorkTypeApexMethod(
                {
                    workTypeName: this.name,
                    description: this.description,
                    estimatedDuration: this.estimatedDuration,
                    durationType: this.durationType,
                    shouldAutoCreateSvcAppt: this.shouldAutoCreateSvcAppt
                })
                .then(result => {
                    console.log(result);
                    console.log('ID: ', result.Id);
                    this.workTypeObject = result;
                    this.workTypeRecordId = result.Id;
                    this.workTypeName = result.Name;

                    console.log('workTypeObject = ' + this.workTypeObject);

                    console.log('record.Name = ' + result.Name);
                    // this.isLoaded = true;
                    this.genericShowToast('Success!', 'Work Type Record is created Successfully!', 'success');
                    this.showNewWorkTypeComponent = false;
                    this.showNewSkillRequirementComponent = true;
                })
                .catch(error => {
                    console.log('error createWorkType');
                    console.log(error);
                    // this.isLoaded = true;
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








