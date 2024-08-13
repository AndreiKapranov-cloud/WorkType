import {LightningElement, api} from 'lwc';
import createProductRequiredApexMethod
    from '@salesforce/apex/ProductRequiredController.createProductRequiredApexMethod';
import getPicklistValuesUsingApex from '@salesforce/apex/BaseComponentController.getPicklistValuesUsingApex';
import getRecordsGenericApex
    from '@salesforce/apex/BaseComponentController.getRecordsGenericApex';
import {genericShowToast} from "c/utils";

export default class NewProductRequired extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    picklistValues = [];
    product2Id;
    quantityRequired;
    quantityUnitOfMeasure;
    product2s = [];
    @api workTypeRecordId;
    @api workTypeName;
    isLoading = true;
    paramsJSONString = [];
    productRequiredJsonObject = {};
    static renderMode = "light";
    getProduct2RecordsParamsJsonObject = {};


    displayNewProductItemInBase() {
        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewProductItem',
                'product2s': this.product2s,
                'product2Id': this.product2Id
            }
        }));
    }


    handleProductRequiredChange(e) {
        this.product2Id = e.target.value;
    }

    handleQuantityRequiredChange(e) {
        this.quantityRequired = e.target.value;
    }

    handleQuantityUnitOfMeasureChange(e) {
        this.quantityUnitOfMeasure = e.target.value;
    }


    connectedCallback() {

        this.getProduct2RecordsParamsJsonObject.fieldToQuery = 'Name';
        this.getProduct2RecordsParamsJsonObject.sObjectName = 'Product2';
        this.getProduct2RecordsParamsJsonObject.nameOfFieldAfterWhereClause = 'Description';
        this.getProduct2RecordsParamsJsonObject.valueOfFieldAfterWhereClause = 'Field Service';

        this.getProduct2RecordsParamsJSONString = JSON.stringify(this.getProduct2RecordsParamsJsonObject);

        console.log(this.getProduct2RecordsParamsJSONString);
        getRecordsGenericApex(
            {
                getRecordsParamsJSONString: this.getProduct2RecordsParamsJSONString
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


        getPicklistValuesUsingApex(({
            sObjectType: 'ProductRequired',
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

        this.isLoading = false;
    }

    validateQuantityRequired() {

        let quantityRequiredInput = this.refs?.quantityRequired;

        return quantityRequiredInput.checkValidity();
    }

    createProductRequired() {

        if (this.validateQuantityRequired()) {
            this.isLoading = true;

            this.productRequiredJsonObject.parentRecordId = this.workTypeRecordId;
            this.productRequiredJsonObject.product2Id = this.product2Id;
            this.productRequiredJsonObject.quantityRequired = this.quantityRequired;
            this.productRequiredJsonObject.quantityUnitOfMeasure = this.quantityUnitOfMeasure;

            this.paramsJSONString = JSON.stringify(this.productRequiredJsonObject);

            console.log('quantityUnitOfMeasure = ' + this.quantityUnitOfMeasure);
            console.log('workTypeName = ' + this.workTypeName);
            console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);

            createProductRequiredApexMethod({
                paramsJSONString: this.paramsJSONString
            })
                .then(result => {
                    console.log(result);
                    this.genericShowToast('Success!', 'Product Required Record is created Successfully!', 'success');
                    this.displayNewProductItemInBase()
                })
                .catch(error => {
                    console.log('Error creating Product Required Record');
                    console.log(error);
                    this.isLoading = true;
                    this.genericShowToast('Error creating Product Required Record', error.body.message, 'error');

                })
                .finally(() => this.isLoading = false);

        } else {
            this.genericShowToast('Error creating Product Required Record.', 'Please, complete Quantity Required field properly', 'error');

        }
    }
}