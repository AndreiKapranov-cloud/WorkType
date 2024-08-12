import {LightningElement, api} from 'lwc';
import getWorkOrderNumberById from '@salesforce/apex/WorkOrderLineItemController.getWorkOrderNumberById';
import createWorkOrderLineItemApexMethod
    from '@salesforce/apex/WorkOrderLineItemController.createWorkOrderLineItemApexMethod';
import getWorkTypeNameById from '@salesforce/apex/WorkTypeController.getWorkTypeNameById';
import getPicklistValuesUsingApex from '@salesforce/apex/BaseComponentController.getPicklistValuesUsingApex';
import {genericShowToast} from "c/utils";


export default class NewWorkOrderLineItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    workOrderLineItemObject;
    statusPicklistValues = [];
    status;
    workOrderNumber;
    @api workOrderId;
    @api workTypeId;
    workTypeName;
    description;
    isLoading = true;
    showNewWorkOrderLineItemComponent = true;
    showNewWorkOrderComponent = false;
    workOrderLineItemJsonObject = new Object();
    paramsJSONString = [];


    handleStatusChange(e) {
        this.status = e.target.value;
    }

    handleDescriptionChange(e) {
        this.description = e.target.value;
    }

    connectedCallback() {

        getWorkTypeNameById({
            id: this.workTypeId
        })
            .then(result => {

                this.workTypeName = result[0].Name;

                console.log('this.workTypeName: ', this.workTypeName);

            })
            .catch(error => {
                console.log(error);
                console.log('error getting workTypeName');
                this.genericShowToast('Error getting workTypeName', error.body.message, 'error');
            });

        getWorkOrderNumberById({
            workOrderId: this.workOrderId
        })
            .then(result => {
                this.workOrderNumber = result.WorkOrderNumber;
                console.log('this.workOrderNumber: ', this.workOrderNumber);

            })
            .catch(error => {
                console.log(error);
                console.log('error getting workOrderNumber');
                this.genericShowToast('Error getting workOrderNumber', error.body.message, 'error');
            });


        getPicklistValuesUsingApex(({
            sObjectType: 'WorkOrderLineItem',
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

    createWorkOrderLineItem() {
        this.isLoading = true;

        this.workOrderLineItemJsonObject.status = this.status;
        this.workOrderLineItemJsonObject.WorkOrderId = this.workOrderId;
        this.workOrderLineItemJsonObject.workTypeId = this.workTypeId;
        this.workOrderLineItemJsonObject.description = this.description;

        this.paramsJSONString = JSON.stringify(this.workOrderLineItemJsonObject);

        createWorkOrderLineItemApexMethod(
            {
                paramsJSONString: this.paramsJSONString
            })
            .then(result => {
                console.log(result);
                console.log('ID: ', result.Id);
                this.workOrderLineItemObject = result;
                console.log('workOrderLineItemObject = ' + this.workOrderLineItemObject);
                this.genericShowToast('Success!', 'Work Order Line Item Record is created Successfully!', 'success');
            })
            .catch(error => {
                console.log('error createWorkOrder');
                console.log(error);
                this.genericShowToast('Error creating Work Order Line Item.', error.body.message, 'error');
            }).finally(
            () => {
                this.isLoading = false;
            }
        )
    }

    returnToNewWorkOrderComponent() {
        this.showNewWorkOrderLineItemComponent = false;
        this.showNewWorkOrderComponent = true;

    }
}