import { LightningElement,wire } from 'lwc';
import getDurationTypePicklistValues from '@salesforce/apex/WorkTypeController.getDurationTypePicklistValues';
import createWorkTypeApexMethod from '@salesforce/apex/WorkTypeController.createWorkTypeApexMethod';
import getPicklistValuesUsingApex from '@salesforce/apex/WorkTypeController.getPicklistValuesUsingApex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { createRecord } from 'lightning/uiRecordApi';
 import { getPicklistValues } from 'lightning/uiObjectInfoApi';
// import WORK_TYPE_OBJECT from '@salesforce/schema/WorkType';
// import WORK_TYPE_NAME_FIELD from '@salesforce/schema/WorkType.Name';
// import DESCRIPTION_FIELD from '@salesforce/schema/WorkType.Description';
// import ESTIMATED_DURATION_FIELD from '@salesforce/schema/WorkType.EstimatedDuration';
 import DURATION_TYPE_FIELD from '@salesforce/schema/WorkType.DurationType';
// import SHOULD_AUTO_CREATE_SERVICE_APPOINTMENT_FIELD from '@salesforce/schema/WorkType.ShouldAutoCreateSvcAppt';
const RECORD_TYPE_ID = '012000000000000AAA';

export default class NewWorkType extends LightningElement {
    menList = [];

    workTypeSObjectType = 'WorkType';
    durationTypeFieldName = 'DurationType';
  
    workType;
    workTypeRecordList = [];
    
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
        }else if (e.target.name === "durationType") {
            this.durationType = e.target.value;
        }else if (e.target.name === "shouldAutoCreateSvcAppt") {
            this.shouldAutoCreateSvcAppt = e.target.checked;
        }
      }
     
      connectedCallback(){


        

        getDurationTypePicklistValues()
          .then(result => {
            this.picklistValues = result;
            console.log('this.picklistValues: ', this.picklistValues);
          })
          .catch(zalupa =>{
            console.log(zalupa);
            this.error = zalupa.message;
            console.log('error createWorkType');
            console.log(zalupa);
            this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Error getting PickList values',
                      message: zalupa,
                      variant: 'error'
                  })
              );
          });
        }

      
      // connectedCallback(){
      //     console.log('this.workTypeSObjectType,this.durationTypeFieldName =',this.workTypeSObjectType,this.durationTypeFieldName);
      //     getPicklistValuesUsingApex({sObjectType:this.workTypeSObjectType,field:this.durationTypeFieldName})
      //     .then(result => {
      //     this.picklistValues = result;
      //     console.log('this.picklistValues from apex: ', this.picklistValues);
      //     })
      //     .catch(error =>{
      //       console.log(error);
      //       this.massage = error.message;
      //       console.log('Error getting PickList values');
      //       console.log(zalupa);
      //       this.dispatchEvent(
      //             new ShowToastEvent({
      //                 title: 'Error getting PickList values',
      //                 message: massage,
      //                 variant: 'error'
      //             })
      //         );
      //     });
      //   }   
      




      createWorkType() {

      console.log('createWorkType');
      console.log('estimated duration =' + this.estimatedDuration);
      createWorkTypeApexMethod(
        {
          workTypeName:this.name,
          description:this.description,
          estimatedDuration:this.estimatedDuration,
          durationType:this.durationType
        })
      .then(result => {
          console.log(result);
          console.log('ID: ', result.Id);
          this.workTypeObject = result;
          this.workTypeRecordId = result.Id;
          this.workTypeName = result.Name;
          
          console.log('workTypeObject = ' + this.workTypeObject);
          
          console.log('record.Name = ' + result.Name);
        
          this.showNewWorkTypeComponent = false;
          this.showNewSkillRequirementComponent = true;


          
          const toastEvent = new ShowToastEvent({
              title:'Success!',
              message:'Work Type Record is created Successfully!',
              variant:'success'
          });
          this.dispatchEvent(toastEvent);
        })
      .catch(zalupa =>{
          console.error(zalupa);
          this.error = zalupa.message;
          console.log('error createWorkType');
          console.log(zalupa);
          this.dispatchEvent(
              new ShowToastEvent({
              title: 'Error creating Work Type record',
              message: zalupa,
              variant: 'error'
                  })
              );
        });
    }
}