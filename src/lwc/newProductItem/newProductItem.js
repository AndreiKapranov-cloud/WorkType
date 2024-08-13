import {LightningElement, api} from 'lwc';

import getLocations
    from '@salesforce/apex/ProductItemController.getLocations';
import createProductItemApexMethod
    from '@salesforce/apex/ProductItemController.createProductItemApexMethod';
import getPicklistValuesUsingApex from '@salesforce/apex/BaseComponentController.getPicklistValuesUsingApex';
import getRecordsGenericApex
    from '@salesforce/apex/BaseComponentController.getRecordsGenericApex';
import {genericShowToast} from "c/utils";

export default class NewProductItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    locationId;
    getRecordsParamsJsonObject = {};
    static renderMode = "light";
    locations = [];
    picklistValues = [];
    quantityOnHand;
    quantityUnitOfMeasure;
    serialNumber;
    serialNumberValid = false;
    isLoading = true;
    paramsJSONString = [];
    productItemJsonObject = {};
    nameOfFieldAfterWhereClause = '';
    valueOfFieldAfterWhereClause = '';
    getProductItemRecordsParamsJsonObject = {};
    duplicatedProductItem;

    displayNewWorkTypeInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewWorkType',
            }
        }));
    }

    handleProduct2IdChange(e) {
        this.product2Id = e.target.value;
    }

    handleLocationChange(e) {
        this.locationId = e.target.value;
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
        console.log('product2ssss :' + this.product2s);
         getLocations()
             .then(result => {
                 this.locations = result;
                 this.locationId = this.locations[0].Id;

                 console.log('this.locations: ', this.locations);
                 console.log('this.location: ', this.locationId);

             })
             .catch(error => {
                 console.log(error);
                 console.log('Error getting locations.');
                 this.genericShowToast('Error getting locations.', error.body.message, 'error');
             });


/*

        this.getRecordsParamsJsonObject.fieldToQuery = 'Name';
        this.getRecordsParamsJsonObject.sObjectName = 'Location';
        this.getRecordsParamsJsonObject.nameOfFieldAfterWhereClause = 'IsInventoryLocation';
        this.getRecordsParamsJsonObject.valueOfFieldAfterWhereClause = true;

        this.getRecordsParamsJSONString = JSON.stringify(this.getRecordsParamsJsonObject);

        console.log(this.getRecordsParamsJSONString);
        getRecordsGenericApex(
            {
                getRecordsParamsJSONString: this.getRecordsParamsJSONString
            })
            .then(result => {
                console.log('this.locationssssssssssss: ', result);

                this.locations = result;
                this.locationId = this.locations[0].Id;

                console.log('this.locations: ', this.locations);
                console.log('this.location: ', this.locationId);

            })
            .catch(error => {
                console.log(error);
                console.log('Error getting locations.');
                this.genericShowToast('Error getting locations.', error.body.message, 'error');
            });
*/


        getPicklistValuesUsingApex(({
            sObjectType: 'ProductItem',
            field: 'QuantityUnitOfMeasure'
        }))
            .then(result => {
                this.picklistValues = result;
                console.log('this.picklistValues: ', this.picklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');

            });

        this.getRecordsParamsJsonObject.fieldToQuery = 'Name';
        this.getRecordsParamsJsonObject.sObjectName = 'Product2';
        this.getRecordsParamsJsonObject.nameOfFieldAfterWhereClause = 'Description';
        this.getRecordsParamsJsonObject.valueOfFieldAfterWhereClause = 'Field Service';

        this.getRecordsParamsJSONString = JSON.stringify(this.getRecordsParamsJsonObject);

        console.log(this.getRecordsParamsJSONString);
        getRecordsGenericApex(
            {
                getRecordsParamsJSONString: this.getRecordsParamsJSONString
            })
            .then(result => {
                this.product2s = result;
                this.product2Id = this.product2s[0].Id;

                console.log('this.product2s: ', this.product2s);
                console.log('this.productRequired: ', this.productRequired);

            })
            .catch(error => {
                console.log(error);
                console.log('Error getting product2s.');
                this.genericShowToast('Error getting product2s.', error.body.message, 'error');
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

    checkWorkTypeInputFields() {
        let serialNumberValidValue = this.serialNumberValid;
        let validateQuantityOnHandValue = this.validateQuantityOnHand();
        let validateSerialNumberValue = this.validateSerialNumber();

        return serialNumberValidValue && validateQuantityOnHandValue && validateSerialNumberValue;
    }

    /*checkIfSerialNumberDuplicated() {

        this.getProductItemRecordsParamsJsonObject.fieldToQuery = 'Id';
        this.getProductItemRecordsParamsJsonObject.sObjectName = 'ProductItem';
        this.getProductItemRecordsParamsJsonObject.nameOfFieldAfterWhereClause = 'SerialNumber';
        this.getProductItemRecordsParamsJsonObject.valueOfFieldAfterWhereClause = this.serialNumber.toString();

        this.getProductItemRecordsParamsJSONString = JSON.stringify(this.getProductItemRecordsParamsJsonObject);

        console.log(this.getProductItemRecordsParamsJSONString);
        getRecordsGenericApex(
            {
                getRecordsParamsJSONString: this.getProductItemRecordsParamsJSONString
            })
            .then(result => {
                this.duplicatedProductItem = result[0];

                console.log('this.duplicatedProductItemmmmmmmm: ', this.duplicatedProductItem);

            })
            .catch(error => {
                console.log(error);
                console.log('Error getting ProductItem.');
                this.genericShowToast('Error getting ProductItem.', error.body.message, 'error');
            });
        if (this.duplicatedProductItem) {
            this.genericShowToast('Serial Number Duplicated.', 'Please, insert another number', 'error');
            return false;
        } else {
            return true;
        }

    }*/

    /* checkProductItemInput() {
         let isWorkTypeInputValid = this.checkWorkTypeInputFields();
         let isSerialNumberNotDuplicated = this.checkIfSerialNumberDuplicated();

        return isWorkTypeInputValid && isSerialNumberNotDuplicated;

     }*/

    createProductItem() {

        if (this.checkWorkTypeInputFields()) {
            this.isLoading = true;

            console.log('this.product2Id ', this.product2Id);
            console.log('this.location ', this.location);
            console.log('this.quantityOnHand ', this.quantityOnHand);
            console.log('this.quantityUnitOfMeasure ', this.quantityUnitOfMeasure);
            console.log('this.serialNumber ', this.serialNumber);

            this.productItemJsonObject.product2Id = this.product2Id;
            this.productItemJsonObject.locationId = this.locationId;
            this.productItemJsonObject.quantityOnHand = this.quantityOnHand;
            this.productItemJsonObject.quantityUnitOfMeasure = this.quantityUnitOfMeasure;
            this.productItemJsonObject.serialNumber = this.serialNumber;

            this.paramsJSONString = JSON.stringify(this.productItemJsonObject);

            createProductItemApexMethod({
                paramsJSONString: this.paramsJSONString
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
}