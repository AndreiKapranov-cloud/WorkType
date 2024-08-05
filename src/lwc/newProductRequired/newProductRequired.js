import {LightningElement,api} from 'lwc';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
import getQuantityUnitOfMeasurePicklistValues
    from '@salesforce/apex/ProductRequiredController.getQuantityUnitOfMeasurePicklistValues';
import createProductRequiredApexMethod
    from '@salesforce/apex/ProductRequiredController.createProductRequiredApexMethod';
import {genericShowToast} from "c/utils";

export default class NewProductRequired extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    picklistValues = [];
    showNewProductRequiredComponent = true;
    showNewProductItemComponent = false;
    product2s = [];
    productRequired;
    quantityRequired;
    quantityUnitOfMeasure;
    @api workTypeRecordId;
    @api workTypeName;
    isLoaded = false;

    handleChange(e) {

        if (e.target.name === "productRequired") {
            this.productRequired = e.target.value;
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
                console.log('Error getting product2s.');
                this.genericShowToast('Error getting product2s.',error.body.message, 'error');
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


    createProductRequired() {
        this.isLoaded = false;
        console.log('quantityUnitOfMeasure = ' + this.quantityUnitOfMeasure);
        console.log('workTypeName = ' + this.workTypeName);
        console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);

        createProductRequiredApexMethod({
            parentRecordId: this.workTypeRecordId,
            product2Id: this.productRequired,
            quantityRequired: this.quantityRequired,
            quantityUnitOfMeasure: this.quantityUnitOfMeasure

        })
            .then(result => {
                console.log(result);
                this.isLoaded = true;
                this.genericShowToast('Success!', 'Product Required Record is created Successfully!', 'success');
                this.showNewProductRequiredComponent = false;
                this.showNewProductItemComponent = true;
            })
            .catch(error => {
                console.log('Error creating Product Required Record');
                console.log(error);
                this.isLoaded = true;
                this.genericShowToast('Error creating Product Required Record', error.body.message, 'error');

            });
    }
}