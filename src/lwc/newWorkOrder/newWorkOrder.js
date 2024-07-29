import { LightningElement,wire,api} from 'lwc';
import getPriorityPicklistValues from '@salesforce/apex/WorkOrderController.getPriorityPicklistValues';
import getWorkTypes from '@salesforce/apex/WorkTypeController.getWorkTypes';
import { getPicklistValues } from 'lightning/uiObjectInfoApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import WORK_ORDER_OBJECT from '@salesforce/schema/WorkOrder';
import WORK_TYPE from '@salesforce/schema/WorkOrder.WorkTypeId';
import STATUS from '@salesforce/schema/WorkOrder.Status';
import PRIORITY from '@salesforce/schema/WorkOrder.Priority';
import SUBJECT from '@salesforce/schema/WorkOrder.Subject';
import DESCRIPTION from '@salesforce/schema/WorkOrder.Description';
const RECORD_TYPE_ID = '012000000000000AAA';

export default class NewWorkOrder extends LightningElement {

    status;
    priority;
    workTypeId;
    subject;
    description;
    workOrderRecordId;
    showParentComponent = true;
    showChildComponent = false;

    @wire(getWorkTypes)workTypes;

   
    handleChange(e) {

        if (e.target.name === "status") {
            this.status = e.target.value;
        } else if (e.target.name === "priority") {
            this.priority = e.target.value;
        } else if (e.target.name === "workType") {
            this.workTypeId = this.template.querySelector('select.slds-select').value;
        } else if (e.target.name === "subject") {
            this.subject = e.target.value;
        } else if (e.target.name === "description") {
            this.description = e.target.value;
        }
      }

    @wire(getPicklistValues, {
    recordTypeId: RECORD_TYPE_ID,
    fieldApiName: STATUS,
    })
    getPicklistValuesForField({ data, error }) {
    if (error) {
        // TODO: Error handling
        console.error(error)
    } else if (data) {
        this.statusPicklistValues = [...data.values];
      }
    }

    @wire(getPriorityPicklistValues, {})
    wiredPriorityPicklistValues({ error, data }) {
        if (data) {
            // Map the data to an array of options
            this.priorityPicklistValues = data.map(option => {
                return {
                    label: option.label,
                    value: option.value
                };
            });
        }
        else if (error) {
            console.error(error);
        }
    }

   
        async createWorkOrder() {
   
        
        const fields = {};
      
        console.log('status = ' + this.status);
        console.log('workTypeId = ' + this.workTypeId);
        console.log('subject = ' + this.subject);
        console.log('description = ' + this.description);
        fields[STATUS.fieldApiName] = this.status;
        fields[PRIORITY.fieldApiName] = this.priority;
        fields[WORK_TYPE.fieldApiName] = this.workTypeId;
        fields[SUBJECT.fieldApiName] = this.subject;
        fields[DESCRIPTION.fieldApiName] = this.description;
     
    const recordInput = { apiName: WORK_ORDER_OBJECT.objectApiName, fields:fields};
    try {
        const workOrder = await createRecord(recordInput)

        .then(record => {
         
              this.workOrderRecordId = record.id;
          
         })

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Work Order created',
                variant: 'success'
            })
        );
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Work Order record',
                message: error,
                variant: 'error'
            })
        );
    }
    this.showParentComponent = false;
    this.showChildComponent = true;
  }
}