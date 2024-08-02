import { LightningElement,wire,api} from 'lwc';
import getLocations from '@salesforce/apex/ProductItemController.getLocations';
import getQuantityUnitOfMeasurePicklistValues from '@salesforce/apex/ProductItemController.getQuantityUnitOfMeasurePicklistValues';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import PRODUCT_ITEM_OBJECT from '@salesforce/schema/ProductItem';
import PRODUCT_2 from '@salesforce/schema/ProductItem.Product2Id';
import LOCATION from '@salesforce/schema/ProductItem.LocationId';
import QUANTITY_ON_HAND from '@salesforce/schema/ProductItem.QuantityOnHand';
import QUANTITY_UNIT_OF_MEASURE from '@salesforce/schema/ProductItem.QuantityUnitOfMeasure';
import SERIAL_NUMBER from '@salesforce/schema/ProductItem.SerialNumber';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';

export default class NewProductItem extends LightningElement {

    location;
    serialNumber;
    product2Id;
    serialNumber;
    locations = [];
    product2s = [];
    picklistValues = [];
    quantityOnHand;
    quantityUnitOfMeasure;

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


    connectedCallback() {

        getLocations()
            .then(result => {
                this.locations = result;
                this.location = this.locations[0].Id;

                console.log('this.locations: ', this.locations);
                console.log('this.location: ', this.location);

            })
            .catch(error => {
                console.log(error);
                this.error = error.message;
                console.log('Error getting locations.');
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error getting locations.',
                        message: error,
                        variant: 'error'
                    })
                );
            });


        getProduct2s()
            .then(result => {
                this.product2s = result;
                this.product2Id = this.product2s[0].Id;

                console.log('this.product2s: ', this.product2s);
                console.log('this.product2Id: ', this.product2Id);

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
            .catch(error => {
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


        createProductItem() {


        const fields = {};
      
        fields[PRODUCT_2.fieldApiName] = this.product2Id;
        fields[LOCATION.fieldApiName] = this.location;
        fields[QUANTITY_ON_HAND.fieldApiName] = this.quantityOnHand;
        fields[QUANTITY_UNIT_OF_MEASURE.fieldApiName] = this.quantityUnitOfMeasure;
        fields[SERIAL_NUMBER.fieldApiName] = this.serialNumber;

            console.log('this.product2Id ', this.product2Id);
            console.log('this.location ', this.location);
            console.log('this.quantityOnHand ', this.quantityOnHand);
            console.log('this.quantityUnitOfMeasure ', this.quantityUnitOfMeasure);
            console.log('this.serialNumber ', this.serialNumber);
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