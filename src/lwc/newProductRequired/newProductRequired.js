import {LightningElement, api} from 'lwc';
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
    product2Id;
    quantityRequired;
    quantityUnitOfMeasure;
    @api workTypeRecordId;
    @api workTypeName;
    isLoading = true;


    displayNewProductItemInBase() {
        this.dispatchEvent(new CustomEvent('displaynewproductiteminbase', {
            detail: {
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

        getProduct2s()
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

    validateQuantityRequired() {

        let quantityRequiredInput = this.refs?.quantityRequired;

        return quantityRequiredInput.checkValidity();
    }

    createProductRequired() {
        //    console.log('validateQuantityRequired :' + this.validateQuantityRequired());
        if (this.validateQuantityRequired()) {
            this.isLoading = true;
            console.log('quantityUnitOfMeasure = ' + this.quantityUnitOfMeasure);
            console.log('workTypeName = ' + this.workTypeName);
            console.log('final workTypeRecordId for skill req = ' + this.workTypeRecordId);

            createProductRequiredApexMethod({
                parentRecordId: this.workTypeRecordId,
                product2Id: this.product2Id,
                quantityRequired: this.quantityRequired,
                quantityUnitOfMeasure: this.quantityUnitOfMeasure

            })
                .then(result => {
                    console.log(result);
                    this.genericShowToast('Success!', 'Product Required Record is created Successfully!', 'success');
                    // this.showNewProductRequiredComponent = false;
                    // this.showNewProductItemComponent = true;
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