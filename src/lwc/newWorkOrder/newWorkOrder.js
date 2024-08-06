import {LightningElement} from 'lwc';
import getPriorityPicklistValues from '@salesforce/apex/WorkOrderController.getPriorityPicklistValues';
import getStatusPicklistValues from '@salesforce/apex/WorkOrderController.getStatusPicklistValues';
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

        getPriorityPicklistValues()
            .then(result => {
                this.priorityPicklistValues = result;
                console.log('this.priorityPicklistValues: ', this.priorityPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting priorityPicklistValues');
                this.genericShowToast('Error getting priorityPicklistValues', error.body.message, 'error');
            });


        getStatusPicklistValues()
            .then(result => {
                this.statusPicklistValues = result;
                console.log('this.statusPicklistValues: ', this.statusPicklistValues);
            })
            .catch(error => {
                console.log('error getting statusPicklistValues');
                console.log(error);
                this.genericShowToast('Error getting statusPicklistValues', error.body.message, 'error');
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
    handleSubjectChange(e) {
        this.subject = e.target.value;
    }
    handleDescriptionChange(e) {
        this.description = e.target.value;
    }


    createWorkOrder() {
        this.isLoading = true;
        createWorkOrderApexMethod(
            {
                workTypeId: this.workTypeId,
                status: this.status,
                priority: this.priority,
                subject: this.subject,
                description: this.description
            })
            .then(result => {
                console.log(result);
                console.log('ID: ', result.Id);
                this.workOrderObject = result;


                this.workOrderRecordId = result.Id;
                this.workOrderNumber = result.workOrderNumber;

                console.log('workOrderObject = ' + this.workOrderObject);
                this.genericShowToast('Success!', 'Work Order Record is created Successfully!', 'success');
                this.showNewWorkOrderComponent = false;
                this.showNewWorkOrderLineItemComponent = true;
            })
            .catch(error => {
                console.log('error creating WorkOrder record');
                console.log(error);
                console.log(error.message);
                this.genericShowToast('Error creating Work Order.', error.message, 'error');

            })
            .finally(() => this.isLoading = false);
    }
}