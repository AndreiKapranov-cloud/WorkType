import {LightningElement, wire, api} from 'lwc';
import getProduct2s from '@salesforce/apex/ProductRequiredController.getProduct2s';
import getQuantityUnitOfMeasurePicklistValues
    from '@salesforce/apex/ProductRequiredController.getQuantityUnitOfMeasurePicklistValues';
import createProductRequiredApexMethod
    from '@salesforce/apex/ProductRequiredController.createProductRequiredApexMethod';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {genericShowToast} from "c/utils";

export default class NewProductRequired extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    picklistValues = [];
    showParentComponent = true;
    showChildComponent = false;
    product2s = [];
    productRequired;
    quantityRequired;
    quantityUnitOfMeasure;
    @api workTypeRecordId;
    @api workTypeName;
    isLoaded = false;

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


    createProductRequired() {
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
                this.genericShowToast('Success!', 'Product Required Record is created Successfully!', 'success');
                this.showParentComponent = false;
                this.showChildComponent = true;
            })
            .catch(error => {
                console.log('Error creating Product Required Record');
                console.log(error);

                this.genericShowToast('Error creating Product Required Record', error.body.message, 'error');

            });
    }
}