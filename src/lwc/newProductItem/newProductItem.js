import {LightningElement, api} from 'lwc';
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
    isLoading = true;
    serialNumberValid = false;
    showNewProductItemComponent = true;
    showNewWorkTypeComponent = false;
    isLoading = true;

    displayNewWorkTypeInBase() {
        this.dispatchEvent(new CustomEvent('displaynewworktypeinbase', {}));

    }

    handleProduct2IdChange(e) {
        this.product2Id = e.target.value;
    }

    handleLocationChange(e) {
        this.location = e.target.value;
    }

    handleQuantityOnHandChange(e) {
        this.quantityOnHand = e.target.value;
    }

    handleQuantityUnitOfMeasureChange(e) {
        this.quantityUnitOfMeasure = e.target.value;
    }


    handleSerialNumberChange(e) {

        this.serialNumber = e.target.value;

        console.log('serialNumber = ' + this.serialNumber);
        console.log(this.serialNumber.includes(` `));
        const isWhitespaceString = str => !str.replace(/\s/g, '').length;

        if (isWhitespaceString(this.serialNumber) || this.serialNumber === '') {
            this.serialNumberValid = false;
            this.genericShowToast('Product Item Serial Number Input Error', 'Please, complete Serial Number field properly.', 'error');
        } else {
            this.serialNumberValid = true;
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
        this.isLoading = false;

    }


    validateQuantityOnHand() {
        let validateQuantityOnHandInput = this.refs?.quantityOnHand;
        validateQuantityOnHandInput.reportValidity();
        return validateQuantityOnHandInput.checkValidity();
    }

    validateSerialNumber() {
        let serialNumberInput = this.refs?.serialNumber;
        serialNumberInput.reportValidity();
        return serialNumberInput.checkValidity();
    }


    createProductItem() {

        if (this.serialNumberValid && this.validateQuantityOnHand() && this.validateSerialNumber()) {
            this.isLoading = true;

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

                })
                .finally(() => this.isLoading = false);

        } else {
            this.genericShowToast('Error creating Product Item Record.', 'Please, complete fields properly', 'error');
        }

    }

    /*  returnToNewWorkTypeComponent() {
          this.showNewWorkTypeComponent = true;
          this.showNewProductItemComponent = false;
      }
  */
}