import { LightningElement,wire,api} from 'lwc';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
import { getPicklistValues } from 'lightning/uiObjectInfoApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import PRODUCT_REQUIRED_OBJECT from '@salesforce/schema/ProductRequired';
import WORK_TYPE from '@salesforce/schema/ProductRequired.ParentRecordId';
import PRODUCT_2 from '@salesforce/schema/ProductRequired.Product2Id';
import QUANTITY_REQUIRED from '@salesforce/schema/ProductRequired.QuantityRequired';
import QUANTITY_UNIT_OF_MEASURE from '@salesforce/schema/ProductRequired.QuantityUnitOfMeasure';
const RECORD_TYPE_ID = '012000000000000AAA';

export default class NewProductRequired extends LightningElement {
    
    showParentComponent = true;
    showChildComponent = false;
    
    productRequired;
    quantityRequired;
    quantityUnitOfMeasure;
    @api workTypeRecordId;
    @api workTypeName;
    @wire(getProduct2s) product2s;

   
    handleChange(e) {

        if (e.target.name === "productRequired") {
            this.productRequired = this.template.querySelector('select.slds-select').value;
        } else if (e.target.name === "quantityRequired") {
            this.quantityRequired = e.target.value;
        } else if (e.target.name === "quantityUnitOfMeasure") {
            this.quantityUnitOfMeasure = e.target.value;
        }
      }

    @wire(getPicklistValues, {
    recordTypeId: RECORD_TYPE_ID,
    fieldApiName: QUANTITY_UNIT_OF_MEASURE,
    })
    getPicklistValuesForField({ data, error }) {
    if (error) {
        console.error(error)
    } else if (data) {
        this.picklistValues = [...data.values];
      }
    }

    async createProductRequired() {
    
        console.log('Namenamename = ' + this.workTypeName);
        console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);//без этой строчки не работает
        const fields = {};
        fields[WORK_TYPE.fieldApiName] = this.workTypeRecordId;
        fields[PRODUCT_2.fieldApiName] = this.productRequired;
        fields[QUANTITY_REQUIRED.fieldApiName] = this.quantityRequired;
        fields[QUANTITY_UNIT_OF_MEASURE.fieldApiName] = this.quantityUnitOfMeasure;
     
     
     
    const recordInput = { apiName: PRODUCT_REQUIRED_OBJECT.objectApiName, fields:fields};
    try {
        const productRequired = await createRecord(recordInput);
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Product Required created',
                variant: 'success'
            })
        );
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Product Required record',
                message: error,
                variant: 'error'
            })
        );
    }
    this.showParentComponent = false;
    this.showChildComponent = true;
         }
    }