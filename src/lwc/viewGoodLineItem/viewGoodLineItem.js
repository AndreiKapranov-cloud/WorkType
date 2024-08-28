/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api} from 'lwc';
import getGoodLineItemWrappersByIds
    from '@salesforce/apex/SelectGoodController.getGoodLineItemWrappersByIds';
import createEshopOrderMethod
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrderMethod';

import {genericShowToast} from "c/utils";

export default class ViewGoodLineItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    @api goodLineItemId;
    @api cartId;
    @api selectedItemsIds;
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


    connectedCallback() {
        this.isLoading = true;
        this.today = new Date();
        console.log('Daaaaate' + this.today)
        //   console.log('connectedCallback:' + this.goodLineItemId);
        getGoodLineItemWrappersByIds(({
            goodLineItemsIds: this.selectedItemsIds
        }))
            .then(result => {

                this.goodLineItems = result;

                console.log('this.goodLineItems: ', this.goodLineItems);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting GoodLineItem');
                this.genericShowToast('Error getting GoodLineItem', error.body.message, 'error');
            });

        console.log('cdccdcc: ' + this.cartId);
        this.isLoading = false;
    }

    handleEShoporderGoodQuantityChange(e) {

        let target = e.target;
        this.eShopOrderGoodQuantity = e.target.value;
        console.log('eShopOrderGoodQuantity = ' + this.eShopOrderGoodQuantity);

        const isWhitespaceString = str => !str.replace(/\s/g, '').length;

        if (isWhitespaceString(this.eShopOrderGoodQuantity) || this.eShopOrderGoodQuantity === '') {
            target.setCustomValidity('Complete this field.');
            this.goodQuantityInputValid = false;
        } else {
            target.setCustomValidity('');
            this.goodQuantityInputValid = true;
        }
    }

    handleEstimatedDeliveryDateChange(e) {
        this.estimatedDeliveryDate = e.target.value;
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

    addNewEShopOrderToCart() {

        if (this.checkWorkTypeInputFields()) {
            this.isLoading = true;
            this.eshopOrderJsonObject.eShopOrderGoodQuantity = this.eShopOrderGoodQuantity;
            this.eshopOrderJsonObject.estimatedDeliveryDate = this.estimatedDeliveryDate;
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