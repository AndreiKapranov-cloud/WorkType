import { LightningElement,wire,api} from 'lwc';
import getLocations from '@salesforce/apex/LocationController.getLocations';
import { getPicklistValues } from 'lightning/uiObjectInfoApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import PRODUCT_ITEM_OBJECT from '@salesforce/schema/ProductItem';
import PRODUCT_2 from '@salesforce/schema/ProductItem.Product2Id';
import LOCATION from '@salesforce/schema/ProductItem.LocationId';
import QUANTITY_ON_HAND from '@salesforce/schema/ProductItem.QuantityOnHand';
import QUANTITY_UNIT_OF_MEASURE from '@salesforce/schema/ProductItem.QuantityUnitOfMeasure';
import SERIAL_NUMBER from '@salesforce/schema/ProductItem.SerialNumber';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
const RECORD_TYPE_ID = '012000000000000AAA';

export default class NewProductItem extends LightningElement {

    location;
    productRequired;
    product2Id;
    serialNumber;
    
    quantityOnHand;
    quantityUnitOfMeasure;
    @wire(getLocations) locations;
    @wire(getProduct2s) product2s;
   
    handleChange(e) {

        if (e.target.name === "product2") {
            this.product2Id = this.template.querySelector('[data-id="product2"]').value;
        } else if (e.target.name === "location") {
            this.location = this.template.querySelector('[data-id="location"]').value;;
        } else if (e.target.name === "quantityOnHand") {
            this.quantityOnHand = e.target.value;
        } else if (e.target.name === "quantityUnitOfMeasure") {
            this.quantityUnitOfMeasure = e.target.value;
        } else if (e.target.name === "serialNumber") {
            this.serialNumber = e.target.value;
        }
      }

    @wire(getPicklistValues, {
    recordTypeId: RECORD_TYPE_ID,
    fieldApiName: QUANTITY_UNIT_OF_MEASURE,
    })
    getPicklistValuesForField({ data, error }) {
    if (error) {
        // TODO: Error handling
        console.error(error)
    } else if (data) {
        this.picklistValues = [...data.values];
      }
    }

    async createProductItem() {
   
        
        const fields = {};
      
        fields[PRODUCT_2.fieldApiName] = this.product2Id;
        fields[LOCATION.fieldApiName] = this.location;
        fields[QUANTITY_ON_HAND.fieldApiName] = this.quantityOnHand;
        fields[QUANTITY_UNIT_OF_MEASURE.fieldApiName] = this.quantityUnitOfMeasure;
        fields[SERIAL_NUMBER.fieldApiName] = this.serialNumber;
     
     
    const recordInput = { apiName: PRODUCT_ITEM_OBJECT.objectApiName, fields:fields};
    try {
        const productItem = await createRecord(recordInput);
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Product Item created',
                variant: 'success'
            })
        );
    } catch (error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating Product Item record',
                message: error,
                variant: 'error'
            })
        );
    }
  }
}