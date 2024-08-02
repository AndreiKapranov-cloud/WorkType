import {LightningElement, wire, api} from 'lwc';
import getLocations from '@salesforce/apex/ProductItemController.getLocations';
import getQuantityUnitOfMeasurePicklistValues
    from '@salesforce/apex/ProductItemController.getQuantityUnitOfMeasurePicklistValues';
import createProductItemApexMethod
    from '@salesforce/apex/ProductItemController.createProductItemApexMethod';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
import {genericShowToast} from "c/utils";

export default class NewProductItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    location;
    serialNumber;
    product2Id;
    serialNumber;
    locations = [];
    product2s = [];
    picklistValues = [];
    quantityOnHand;
    quantityUnitOfMeasure;
    isLoaded = false;

    handleChange(e) {

        if (e.target.name === "product2") {
            this.product2Id = this.template.querySelector('[data-id="product2"]').value;
        } else if (e.target.name === "location") {
            this.location = this.template.querySelector('[data-id="location"]').value;
            ;
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
        this.isLoaded = true;
    }


    createProductItem() {


        console.log('this.product2Id ', this.product2Id);
        console.log('this.location ', this.location);
        console.log('this.quantityOnHand ', this.quantityOnHand);
        console.log('this.quantityUnitOfMeasure ', this.quantityUnitOfMeasure);
        console.log('this.serialNumber ', this.serialNumber);

        createProductItemApexMethod({
            product2Id: this.product2Id,
            locationId: this.location,
            quantityOnHand: this.quantityOnHand,
            quantityUnitOfMeasure: this.quantityUnitOfMeasure,
            SerialNumber: this.serialNumber
        })
            .then(result => {
                console.log(result);
                this.genericShowToast('Success!', 'Product Item Record is created Successfully!', 'success');
            })
            .catch(error => {
                console.log('Error creating Product Item Record');
                console.log(error);

                this.genericShowToast('Error creating Product Item Record', error.body.message, 'error');

            });
    }
}