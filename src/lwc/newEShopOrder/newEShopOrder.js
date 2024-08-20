/**
 * Created by andrey on 8/20/24.
 */

import {LightningElement} from 'lwc';

export default class NewEShopOrder extends LightningElement {


    /*isLoading = true;
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

    getValueByKey(object, row) {
        return object[row];
    }

    displayNewEshopOrderInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewShopOrder',
            }
        }));
    }

    connectedCallback() {

        getBuyers()
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
            })

        this.isLoading = false;
    }

    handleChangeBuyer(e) {
        this.buyerId = e.target.value;
    }

    handleEstimatedDeliveryDateChange(e) {
        this.estimatedDeliveryDate = e.target.value;
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    createCartApexMethod() {

        this.isLoading = true;
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
        )
    }*/
}