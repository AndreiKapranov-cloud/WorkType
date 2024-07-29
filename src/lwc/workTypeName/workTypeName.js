import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi'
import WORK_TYPE_OBJECT from '@salesforce/schema/WorkType';
import WORK_TYPE_NAME_FIELD from '@salesforce/schema/WorkType.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/WorkType.Description';
import ESTIMATED_DURATION_FIELD from '@salesforce/schema/WorkType.EstimatedDuration';
import DURATION_TYPE_FIELD from '@salesforce/schema/WorkType.DurationType';
import SHOULD_AUTO_CREATE_SERVICE_APPOINTMENT_FIELD from '@salesforce/schema/WorkType.ShouldAutoCreateSvcAppt';

export default class WorkTypeName extends LightningElement {
    
     picklistValues = []
     name = '';
     description = '';
     estimatedDuration = '';
     durationType = '';
     shouldAutoCreateSvcAppt = false;
     showParentComponent = true;
     showChildComponent = false;
     workTypeRecordId;
     workTypeName;
     timeoutId;
    
     
     handleChange(e) {
        if (e.target.name === "name") {
          this.name = e.target.value;
        } else if (e.target.name === "description") {
          this.description = e.target.value;
        } else if (e.target.name === "estimatedDuration") {
          this.estimatedDuration = e.target.value;
        }else if (e.target.name === "durationType") {
            this.durationType = e.target.value;
        }else if (e.target.name === "shouldAutoCreateSvcAppt") {
            this.shouldAutoCreateSvcAppt = e.target.checked;
        }
      }
     
      @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: DURATION_TYPE_FIELD,
      })
      getPicklistValuesForField({ data, error }) {
        if (error) {
          // TODO: Error handling
          console.error(error);
        } else if (data) {
          this.picklistValues = [...data.values];
        }
      }
    
        async createWorkType() {
        const fields = {};
        fields[WORK_TYPE_NAME_FIELD.fieldApiName] = this.name;
        fields[DESCRIPTION_FIELD.fieldApiName] = this.description;
        fields[ESTIMATED_DURATION_FIELD.fieldApiName] = this.estimatedDuration;
        fields[DURATION_TYPE_FIELD.fieldApiName] = this.durationType;
        fields[SHOULD_AUTO_CREATE_SERVICE_APPOINTMENT_FIELD.fieldApiName] = this.shouldAutoCreateSvcAppt;

        
        const recordInput = { apiName: WORK_TYPE_OBJECT.objectApiName, fields:fields};
        try {
            const workType = await createRecord(recordInput)
            
            .then(record => {
                
                
                console.log('workTypeRecordName = ' + record.name);
                this.workTypeName = record.name; 
                this.timeoutId = setTimeout(() => {
                console.log('workTypeRecordId = ' + record.id);
                
                this.workTypeRecordId = record.id;
              }, 5000);
              
           

              // let oofficePicklist = result.data.values;
              // this.officePicklist = [...oofficePicklist];
              // this.office =  this.officePicklist[0].value;
            })
            

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Work Type created',
                    variant: 'success'
                })
            );
            
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating Work Type record',
                    message: error,
                    variant: 'error'
                })
            );
            
        }
        this.showParentComponent = false;
        this.showChildComponent = true;
    }
   
      disconnectedCallback() {
      clearTimeout(this.timeoutId);
  }
}