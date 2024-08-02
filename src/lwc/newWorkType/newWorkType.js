import {LightningElement, wire} from 'lwc';
import getDurationTypePicklistValues from '@salesforce/apex/WorkTypeController.getDurationTypePicklistValues';
import createWorkTypeApexMethod from '@salesforce/apex/WorkTypeController.createWorkTypeApexMethod';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {genericShowToast} from "c/utils";

export default class NewWorkType extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    isLoaded = false;
    workType;
    workTypeName;
    picklistValues = [];
    name = '';
    description = '';
    estimatedDuration = '';
    durationType = '';
    shouldAutoCreateSvcAppt = false;
    showNewWorkTypeComponent = true;
    showNewSkillRequirementComponent = false;
    workTypeRecordId;

    handleChange(e) {
        console.log('handleChange');
        if (e.target.name === "name") {
            this.name = e.target.value;
            console.log('name = ' + this.name);
        } else if (e.target.name === "description") {
            this.description = e.target.value;
        } else if (e.target.name === "estimatedDuration") {
            this.estimatedDuration = e.target.value;
        } else if (e.target.name === "durationType") {
            this.durationType = e.target.value;
        } else if (e.target.name === "shouldAutoCreateSvcAppt") {
            this.shouldAutoCreateSvcAppt = e.target.checked;
        }
    }


    connectedCallback() {

        getDurationTypePicklistValues()
            .then(result => {
                this.picklistValues = result;
                console.log('this.picklistValues: ', this.picklistValues);
            })
            .catch(error => {
                console.log(error);
                this.error = error.message;
                console.log('error getting Duration Type Picklist values');
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


    createWorkType() {

        console.log('createWorkType');
        console.log('estimated duration =' + this.estimatedDuration);
        createWorkTypeApexMethod(
            {
                workTypeName: this.name,
                description: this.description,
                estimatedDuration: this.estimatedDuration,
                durationType: this.durationType
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
                this.showNewWorkTypeComponent = false;
                this.showNewSkillRequirementComponent = true;
            })
            .catch(error => {
                console.log('error createWorkType');
                console.log(error);

                this.genericShowToast('Error creating Work Type.', error.body.message, 'error');

            });
    }

}








