import {LightningElement} from 'lwc';
import getPicklistValuesUsingApex from '@salesforce/apex/BaseComponentController.getPicklistValuesUsingApex';
import createWorkOrderApexMethod from '@salesforce/apex/WorkOrderController.createWorkOrderApexMethod';
import getWorkTypes from '@salesforce/apex/WorkTypeController.getWorkTypes';
import {genericShowToast} from "c/utils";


export default class NewWorkOrder extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    workOrderNumber;
    workTypes = [];
    status;
    priority;
    workTypeId;
    subject;
    description;
    workOrderRecordId;
    showNewWorkOrderComponent = true;
    showNewWorkOrderLineItemComponent = false;
    isLoading = true;
    workOrderObject = {};
    priorityPicklistValues = [];
    statusPicklistValues = [];
    workOrderJsonObject = new Object();
    paramsJSONString = [];

    connectedCallback() {

        getWorkTypes()
            .then(result => {
                this.workTypes = result;
                this.workTypeId = this.workTypes[0].Id;
                console.log('this.workTypeId: ', this.workTypeId);
                console.log('this.workTypes: ', this.workTypes);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting WorkTypes');
                this.genericShowToast('error getting WorkTypes', error.body.message, 'error');
            });


        getPicklistValuesUsingApex(({
            sObjectType: 'WorkOrder',
            field: 'Priority'
        }))
            .then(result => {
                this.priorityPicklistValues = result;
                console.log('this.priorityPicklistValues: ', this.priorityPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Priority Picklist values');
                this.genericShowToast('Error Priority PickList values', error.body.message, 'error');

            });


        getPicklistValuesUsingApex(({
            sObjectType: 'WorkOrder',
            field: 'Status'
        }))
            .then(result => {
                this.statusPicklistValues = result;
                console.log('this.statusPicklistValues: ', this.statusPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Status Picklist values');
                this.genericShowToast('Error Status PickList values', error.body.message, 'error');

            });
        this.isLoading = false;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    handlePriorityChange(e) {
        this.priority = e.target.value;
    }

    handleWorkTypeChange(e) {
        this.workTypeId = e.target.value;
    }

    handleDescriptionChange(e) {
        this.description = e.target.value;
    }

    handleSubjectChange(e) {
        this.subject = e.target.value;
    }


    createWorkOrder() {

        this.isLoading = true;

        this.workOrderJsonObject.workTypeId = this.workTypeId;
        this.workOrderJsonObject.status = this.status;
        this.workOrderJsonObject.priority = this.priority;
        this.workOrderJsonObject.subject = this.subject;
        this.workOrderJsonObject.description = this.description;

        this.paramsJSONString = JSON.stringify(this.workOrderJsonObject);

        createWorkOrderApexMethod(
            {
                paramsJSONString: this.paramsJSONString
            })
            .then(result => {
                console.log(result);
                console.log('ID: ', result.Id);
                this.workOrderObject = result;


                this.workOrderId = result.Id;
                this.workOrderNumber = result.workOrderNumber;

                console.log('workOrderObject = ' + this.workOrderObject);
                this.genericShowToast('Success!', 'Work Order Record is created Successfully!', 'success');
                this.showNewWorkOrderComponent = false;
                this.showNewWorkOrderLineItemComponent = true;
            })
            .catch(error => {
                console.log('error creating WorkOrder record');
                console.log(error);
                this.genericShowToast('Error creating Work Order.', error.body.message, 'error');

            })
            .finally(() => this.isLoading = false)

    }
}