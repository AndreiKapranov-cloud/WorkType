import { LightningElement,wire,api} from 'lwc';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
import getQuantityUnitOfMeasurePicklistValues from '@salesforce/apex/ProductRequiredController.getQuantityUnitOfMeasurePicklistValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import PRODUCT_REQUIRED_OBJECT from '@salesforce/schema/ProductRequired';
import WORK_TYPE from '@salesforce/schema/ProductRequired.ParentRecordId';
import PRODUCT_2 from '@salesforce/schema/ProductRequired.Product2Id';
import QUANTITY_REQUIRED from '@salesforce/schema/ProductRequired.QuantityRequired';
import QUANTITY_UNIT_OF_MEASURE from '@salesforce/schema/ProductRequired.QuantityUnitOfMeasure';

export default class NewProductRequired extends LightningElement {

    picklistValues = [];
    showParentComponent = true;
    showChildComponent = false;
    product2s = [];
    productRequired;
    quantityRequired;
    quantityUnitOfMeasure;
    @api workTypeRecordId;
    @api workTypeName;

    handleChange(e) {

        if (e.target.name === "productRequired") {
            this.productRequired = this.template.querySelector('select.slds-select').value;
        } else if (e.target.name === "quantityRequired") {
            this.quantityRequired = e.target.value;
        } else if (e.target.name === "quantityUnitOfMeasure") {
            this.quantityUnitOfMeasure = e.target.value;
        }
      }

    connectedCallback() {

        getProduct2s()
                .then(result => {
                    this.product2s = result;
                    this.productRequired = this.product2s[0].Id;

                    console.log('this.product2s: ', this.product2s);
                    console.log('this.productRequired: ', this.productRequired);

                })
                .catch(error => {
                    console.log(error);
                    this.error = error.message;
                    console.log('Error getting product2s.');
                    console.log(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error getting product2s.',
                            message: error,
                            variant: 'error'
                        })
                    );
                });


        getQuantityUnitOfMeasurePicklistValues()
            .then(result => {
                this.picklistValues = result;
                console.log('this.picklistValues: ', this.picklistValues);
            })
            .catch(error =>{
                console.log(error);
                this.error = error.message;
                console.log('Error getting quantityUnitOfMeasure PickList values');
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error getting quantityUnitOfMeasure PickList values',
                        message: error,
                        variant: 'error'
                    })
                );
            });
    }


    createProductRequired() {
        console.log('quantityUnitOfMeasure = ' + this.quantityUnitOfMeasure);
        console.log('workTypeName = ' + this.workTypeName);
        console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);
        const fields = {};
        fields[WORK_TYPE.fieldApiName] = this.workTypeRecordId;
        fields[PRODUCT_2.fieldApiName] = this.productRequired;
        fields[QUANTITY_REQUIRED.fieldApiName] = this.quantityRequired;
        fields[QUANTITY_UNIT_OF_MEASURE.fieldApiName] = this.quantityUnitOfMeasure;
     

    const recordInput = { apiName: PRODUCT_REQUIRED_OBJECT.objectApiName, fields:fields};
    try {
        createRecord(recordInput);
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Product Required created',
                variant: 'success'
            })
        );
        this.showParentComponent = false;
        this.showChildComponent = true;
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Product Required record',
                message: error,
                variant: 'error'
            })
        );
    }

         }
    }