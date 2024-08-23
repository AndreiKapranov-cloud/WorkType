/**
 * Created by andrey on 8/20/24.
 */
import getPicklistValuesUsingApex
    from '@salesforce/apex/EShopBaseComponentController.getPicklistValuesUsingApex';
import {LightningElement} from 'lwc';
import {genericShowToast} from "c/utils";

export default class GoodSearch extends LightningElement {


    isLoading = true;
    genericShowToast = genericShowToast.bind(this);
    buyers = [];
    buyerId;
    estimatedDeliveryDate;
    pickupPointAddress;
    getPicklistValuesParamsJsonObject = {};
    status;
    cartJsonObject = {};
    cartObject;
    cartRecordId;
    categoryPicklistValues = [];
    subCategoryPicklistValues = [];

    getValueByKey(object, row) {
        return object[row];
    }

    displayNewEshopOrderInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart',
            }
        }));
    }

    connectedCallback() {

        getPicklistValuesUsingApex(({
            fieldName : 'Category__c'
        }))
            .then(result => {
                this.categoryPicklistValues = result;
                console.log('this.picklistValues: ', this.categoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });

        getPicklistValuesUsingApex(({
            fieldName : 'SubCategory__c'
        }))
            .then(result => {
                this.subCategoryPicklistValues = result;
                console.log('this.subCategoryPicklistValues: ', this.subCategoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });

      /*  getBuyers()
            .then(result => {
                this.buyers = result;
                console.log('this.buyerId: ', this.buyerId);
                console.log('this.buyers: ', this.buyers);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Buyers');
                this.genericShowToast('error getting Buyers', error.body.message, 'error');
            });


        this.getPicklistValuesParamsJsonObject.sObjectType = 'Cart__c';
        this.getPicklistValuesParamsJsonObject.field = 'Status__c';
        this.getPicklistValuesParamsJSONString = JSON.stringify(this.getPicklistValuesParamsJsonObject);

        console.log(this.getPicklistValuesParamsJSONString);

        getPicklistValuesUsingApex(({
            getPicklistValuesParamsJSONString: this.getPicklistValuesParamsJSONString
        }))
            .then(result => {

                this.statusPicklistValues = result;
                this.status = this.getValueByKey(result[0], "value");
                console.log('this.status: ', this.status);
                console.log('this.picklistValues: ', this.statusPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Status Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            })*/

        this.isLoading = false;
    }

    handleCategoryChange(e) {
        this.category = e.target.value;
    }

    handleSubCategoryChange(e) {
        this.subCategory = e.target.value;
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    createCartApexMethod() {

     /*   this.isLoading = true;
        this.cartJsonObject.buyerId = this.buyerId;
        this.cartJsonObject.estimatedDeliveryDate = this.estimatedDeliveryDate;
        this.cartJsonObject.pickupPointAddress = this.pickupPointAddress;
        this.cartJsonObject.status = this.status;

        this.paramsJSONString = JSON.stringify(this.cartJsonObject);
        console.log('paramsJSONString:' + this.paramsJSONString);

        createCartApexMethod(
            {
                paramsJSONString: this.paramsJSONString
            })
            .then(result => {
                console.log(result);
                console.log('ID: ', result.Id);
                this.cartObject = result;
                this.cartRecordId = result.Id;

                console.log('cartObject = ' + this.cartObject);

                this.genericShowToast('Success!', 'Cart Record is created Successfully!', 'success');
                this.displayNewEshopOrderInBase();
            })
            .catch(error => {
                console.log('error createCart');
                console.log(error);
                this.genericShowToast('Error creating Cart.', error.body.message, 'error');
            }).finally(
            () => {
                this.isLoading = false;
            }
        )*/
    }
}