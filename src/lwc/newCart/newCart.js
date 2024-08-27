/**
 * Created by andrey on 8/19/24.
 */
import {LightningElement, track} from 'lwc';
import createCartApexMethod
    from '@salesforce/apex/CartController.createCartApexMethod';
import getBuyers
    from '@salesforce/apex/CartController.getBuyers';
import getCartStatusPicklistValuesUsingApex
    from '@salesforce/apex/CartController.getCartStatusPicklistValuesUsingApex';
import {genericShowToast} from "c/utils";


export default class NewCart extends LightningElement {
    isLoading = true;
    genericShowToast = genericShowToast.bind(this);
    buyers = [];
    buyerId;
    estimatedDeliveryDate;
    pickupPointAddress;
    status;
    cartJsonObject = {};
    cartObject;
    cartId;
    @track statusPicklistValues;

    getValueByKey(object, row) {
        return object[row];
    }

    displayGoodSearchInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'SelectGood',
                'cartId': this.cartId
            }
        }));
    }


    connectedCallback() {
        this.isLoading = true;
        getBuyers()
            .then(result => {
                this.buyers = result;
                this.buyerId = this.getValueByKey(result[0], 'Id');
                console.log('this.buyerId: ', this.buyerId);
                console.log('this.buyers: ', this.buyers);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Buyers');
                this.genericShowToast('error getting Buyers', error.body.message, 'error');
            });

        getCartStatusPicklistValuesUsingApex()

            .then(result => {

                this.statusPicklistValues = result;
                this.status = this.getValueByKey(result[0], "value");
                console.log('this.status: ', this.status);
                console.log('this.statusPicklistValues: ', JSON.stringify(this.statusPicklistValues));
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
                this.cartId = result.Id;

                console.log('cartObject = ' + this.cartObject);
                console.log('cartId = ' + this.cartId);

                this.genericShowToast('Success!', 'Cart Record is created Successfully!', 'success');
                this.displayGoodSearchInBase();
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
    }
}