import {LightningElement,} from 'lwc';
import getLocations from '@salesforce/apex/ProductItemController.getLocations';
import getQuantityUnitOfMeasurePicklistValues
    from '@salesforce/apex/ProductItemController.getQuantityUnitOfMeasurePicklistValues';
import createProductItemApexMethod
    from '@salesforce/apex/ProductItemController.createProductItemApexMethod';
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
            this.product2Id = e.target.value;
        } else if (e.target.name === "location") {
            this.location = e.target.value;
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
                console.log('Error getting locations.');
                this.genericShowToast('Error getting locations.', error.body.message, 'error');
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
                console.log('Error getting product2s.');
                console.log(error);
                this.genericShowToast('Error getting product2s.', error.body.message, 'error');
            });


        getQuantityUnitOfMeasurePicklistValues()
            .then(result => {
                this.picklistValues = result;
                console.log('this.picklistValues: ', this.picklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('Error getting quantityUnitOfMeasure PickList values');
                this.genericShowToast('Error getting quantityUnitOfMeasure PickList values', error.body.message, 'error');
            });
        this.isLoaded = true;
    }


    createProductItem() {
        this.isLoaded = false;

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
                this.isLoaded = true;
                this.genericShowToast('Success!', 'Product Item Record is created Successfully!', 'success');
            })
            .catch(error => {
                console.log('Error creating Product Item Record');
                console.log(error);
                this.isLoaded = true;
                this.genericShowToast('Error creating Product Item Record', error.body.message, 'error');

            });
    }
}