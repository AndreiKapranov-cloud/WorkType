/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api, track} from 'lwc';

import createEshopOrderList
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrderList';
import createEshopOrderMethod
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrderMethod';

import {genericShowToast} from "c/utils";

export default class ViewGoodLineItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    @api goodLineItemId;
    @api cartId;
    @api selectedItemsIds = [];
    @api lineItems;
    goodLineItems = [];
    quantity;
    colour;
    size;
    supplierName;
    eShopOrderGoodQuantity;
    estimatedDeliveryDate;
    eshopOrderJsonObject = {};
    paramsJSONString = [];
    eshopOrderObject = {};
    goodQuantityInputValid = false;
    isLoading = true;
    @track lineItem;
    index = 0;
    goToNextEShopOrderButtonDisabled = false;
    goToPreviousEShopOrderButtonDisabled = true;
    @track eshopOrderWrapperList = [];
    @track clonedLineItems = [];


    @track selectedLineItemsDeepCopy = [];


    connectedCallback() {
        console.log('connectedCallback');
        this.isLoading = true;
        this.today = new Date();
        console.log('Daaaaate' + this.today);

        console.log('JSON' + JSON.parse(JSON.stringify(this.lineItems)));

        this.selectedLineItemsDeepCopy = JSON.parse(JSON.stringify(this.lineItems));

       this.lineItem = this.selectedLineItemsDeepCopy[this.index];

        console.log('this.lineItem    :' + this.lineItem);

        console.log(' this.selectedItemsIdsssssssssssss    :' + this.selectedItemsIds);

        console.log('cdccdcc: ' + this.cartId);
        this.isLoading = false;
    }

    handleEShoporderGoodQuantityChange(e) {
        try {
            let target = e.target;
            this.lineItem.quantityToAddToCart = e.target.value;
            console.log('this.lineItem.quantityToAddToCart = ' +   this.lineItem.quantityToAddToCart);

            const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            if (isWhitespaceString(this.lineItem.quantityToAddToCart) || this.lineItem.quantityToAddToCart === '') {
                target.setCustomValidity('Complete this field.');
                this.goodQuantityInputValid = false;
            } else {
                target.setCustomValidity('');
                this.goodQuantityInputValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }


    handleOrderEstimatedDeliveryDateChange(e) {

        try {
            console.log('this.lineItem.estimatedDeliveryDate  ' + this.lineItem.estimatedDeliveryDate);

            console.log('this.lineItems[this.index].estimatedDeliveryDate    ' + this.lineItems[this.index].estimatedDeliveryDate);
            console.log('e.target.value ' + e.target.value);


            this.lineItem.estimatedDeliveryDate = e.target.value;

        } catch (e) {
            console.log(e.message)//error when handling result
        }
    }

    validateOrderGoodQuantity() {
        let goodQuantityInput = this.template.querySelector(".quantity");
        goodQuantityInput.reportValidity();

        return goodQuantityInput.checkValidity();
    }

    validateEstimatedDeliveryDate() {
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        estimatedDeliveryDateInput.reportValidity();
        return estimatedDeliveryDateInput.checkValidity();
    }

    checkWorkTypeInputFields() {
        let isOrderGoodQuantityValid = this.validateOrderGoodQuantity();
        let estimatedDeliveryDateValid = this.validateEstimatedDeliveryDate()
        return isOrderGoodQuantityValid && estimatedDeliveryDateValid && this.goodQuantityInputValid;
    }

    controlIfButtonIsDisabledDependingOnIndex() {
        this.goToPreviousEShopOrderButtonDisabled = this.index <= 0;
        this.goToNextEShopOrderButtonDisabled = this.index >= this.lineItems.length - 1;
    }

    goToNextEShopOrder() {
        if (this.index < this.selectedLineItemsDeepCopy.length - 1) {
            this.index += 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            console.log('this.lineItem    :' + this.lineItem);
            this.controlIfButtonIsDisabledDependingOnIndex();
        }
    }

    goToPreviousEShopOrder() {
        if (this.index > 0) {
            this.index -= 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            console.log('this.lineItem    :' + this.lineItem);
            this.controlIfButtonIsDisabledDependingOnIndex();
        }
    }

    addNewEShopOrderToCart() {

        if (this.checkWorkTypeInputFields()) {
            this.isLoading = true;
            this.eshopOrderJsonObject.eShopOrderGoodQuantity = this.lineItem.eShopOrderGoodQuantity;
            this.eshopOrderJsonObject.estimatedDeliveryDate = this.lineItem.estimatedDeliveryDate;
            this.eshopOrderJsonObject.cartId = this.cartId;
            this.eshopOrderJsonObject.goodLineItemId = this.goodLineItemId;

            this.paramsJSONString = JSON.stringify(this.eshopOrderJsonObject);
            console.log(this.paramsJSONString);
            createEshopOrderMethod(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
                    console.log(result);
                    this.eshopOrderObject = result;

                    this.selectedLineItemsDeepCopy = this.selectedLineItemsDeepCopy.filter(e => e !== this.selectedLineItemsDeepCopy[this.index]);

                    if( this.selectedLineItemsDeepCopy.length === 0){
                        this.returnToSelectGood();
                    }

                    console.log('eshopOrderObject = ' + this.eshopOrderObject);
                    this.genericShowToast('Success!', 'EShop Order Record created Successfully!', 'success');
                })
                .catch(error => {
                    console.log('Error creating EShop Order');
                    console.log(error);
                    this.genericShowToast('Error creating EShop Order.', error.body.message, 'error');
                }).finally(
                () => {
                    this.isLoading = false;
                }
            )
        } else {
            this.genericShowToast('Error creating EShopOrder', 'Please, complete required fields properly', 'error');
        }
    }

    returnToNewCart() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }

    returnToSelectGood() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'SelectGood',
                'cartId': this.cartId
            }
        }));
    }

}