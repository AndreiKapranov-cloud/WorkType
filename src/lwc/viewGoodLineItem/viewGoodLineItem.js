/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api, track} from 'lwc';

import createEshopOrderMethod
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrderMethod';

import {genericShowToast} from "c/utils";

export default class ViewGoodLineItem extends LightningElement {

    genericShowToast = genericShowToast.bind(this);

    @api cartId;
    @api selectedItemsIds = [];
    @api lineItems;

    @track eshopOrderWrapperList = [];
    @track clonedLineItems = [];
    @track selectedLineItemsDeepCopy = [];
    @track itemNames = [];
    lineItem;
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
    index = 0;
    goToNextEShopOrderButtonDisabled = true;
    goToPreviousEShopOrderButtonDisabled = true;
    incrementedIndex = 1;
    isEstimatedDeliveryDateValid = false;
    addAllButtonDisabled = true;


    connectedCallback() {

        this.isLoading = true;

        this.selectedLineItemsDeepCopy = JSON.parse(JSON.stringify(this.lineItems));

        this.lineItem = this.selectedLineItemsDeepCopy[this.index];

        if (this.selectedLineItemsDeepCopy.length > 1) {
            this.goToNextEShopOrderButtonDisabled = false;
        }

        this.isLoading = false;
    }

    handleEShopOrderGoodQuantityChange(e) {
        try {
            let target = e.target;
            this.lineItem.quantityToAddToCart = e.target.value;
            this.selectedLineItemsDeepCopy[this.index].quantityToAddToCart = e.target.value;

            const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            if (isWhitespaceString(this.lineItem.quantityToAddToCart) || this.lineItem.quantityToAddToCart === '') {
                target.setCustomValidity('Complete this field.');
                this.goodQuantityInputValid = false;
            } else {
                target.setCustomValidity('');
                this.goodQuantityInputValid = true;
            }

            if (this.lineItem.quantityToAddToCart > this.lineItem.quantity) {
                target.setCustomValidity('Do not Have This Amount of Goods In The Warehouse.');
                this.isEstimatedDeliveryDateValid = false;
            } else {
                target.setCustomValidity('');
                this.isEstimatedDeliveryDateValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }


    handleOrderEstimatedDeliveryDateChange(e) {

        try {
            let target = e.target;
            this.lineItem.estimatedDeliveryDate = e.target.value;

            this.selectedLineItemsDeepCopy[this.index].estimatedDeliveryDate = e.target.value;

            let estimatedDeliveryDateValue = new Date(this.lineItem.estimatedDeliveryDate);

            let today = new Date();

            let yyyyMmDdEstimatedDeliveryDateValue = estimatedDeliveryDateValue.toISOString().slice(0, 10);
            let yyyyMmDdToday = today.toISOString().slice(0, 10);

            console.log('yyyyMmDdEstimatedDeliveryDateValue:  ' + yyyyMmDdEstimatedDeliveryDateValue);
            console.log('yyyyMmDdToday :  ' + yyyyMmDdToday);


            if (yyyyMmDdEstimatedDeliveryDateValue < yyyyMmDdToday) {
                target.setCustomValidity('Date not Valid.');
                this.isEstimatedDeliveryDateValid = false;
            } else {
                target.setCustomValidity('');
                this.isEstimatedDeliveryDateValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }


    validateOrderGoodQuantity() {
        let goodQuantityInput = this.template.querySelector(".quantity");
        goodQuantityInput.reportValidity();

        return goodQuantityInput.checkValidity() && this.goodQuantityInputValid;
    }


    validateEstimatedDeliveryDate() {
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        estimatedDeliveryDateInput.reportValidity();
        return estimatedDeliveryDateInput.checkValidity() && this.isEstimatedDeliveryDateValid;
    }


    checkEShopOrderInputFields() {
        let isOrderGoodQuantityValid = this.validateOrderGoodQuantity();
        let estimatedDeliveryDateValid = this.validateEstimatedDeliveryDate()
        return isOrderGoodQuantityValid && estimatedDeliveryDateValid;
    }


    checkIfButtonIsDisabledDependingOnIndex() {
        this.goToPreviousEShopOrderButtonDisabled = this.index <= 0;
        this.goToNextEShopOrderButtonDisabled = this.index >= this.selectedLineItemsDeepCopy.length - 1;
        if (this.selectedLineItemsDeepCopy.length === 1) {
            this.goToNextEShopOrderButtonDisabled = true;
            this.goToPreviousEShopOrderButtonDisabled = true;
            this.incrementedIndex = 1;
        }
    }


    goToNextEShopOrder() {
        if (this.checkEShopOrderInputFields()) {
            if (this.index < this.selectedLineItemsDeepCopy.length - 1) {
                this.index += 1;
                this.incrementedIndex += 1;
                this.lineItem = this.selectedLineItemsDeepCopy[this.index];
                this.checkIfButtonIsDisabledDependingOnIndex();
                if (this.index === this.selectedLineItemsDeepCopy.length - 1) {
                    this.addAllButtonDisabled = false;
                }
            }
        } else {
            this.genericShowToast('Input not valid.', 'Please, complete required fields properly.', 'error');
        }
    }


    goToPreviousEShopOrder() {
        if (this.checkEShopOrderInputFields()) {
            if (this.index > 0) {
                this.index -= 1;
                this.incrementedIndex -= 1;
                this.lineItem = this.selectedLineItemsDeepCopy[this.index];
                this.checkIfButtonIsDisabledDependingOnIndex();
            } else {

                this.genericShowToast('Input not valid.', 'Please, complete required fields properly.', 'error');

            }
        }
    }


    addNewEShopOrderToCart() {

        if (this.checkEShopOrderInputFields()) {
            this.isLoading = true;
            this.eshopOrderJsonObject.eShopOrderGoodQuantity = this.lineItem.quantityToAddToCart;
            this.eshopOrderJsonObject.estimatedDeliveryDate = this.lineItem.estimatedDeliveryDate;
            this.eshopOrderJsonObject.cartId = this.cartId;
            this.eshopOrderJsonObject.goodLineItemId = this.lineItem.id;

            this.paramsJSONString = JSON.stringify(this.eshopOrderJsonObject);
            console.log(this.paramsJSONString);
            createEshopOrderMethod(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
                        console.log(result);
                        this.eshopOrderObject = result;
                        console.log(this.eshopOrderObject);

                        this.selectedLineItemsDeepCopy = this.selectedLineItemsDeepCopy.filter(e => e !== this.selectedLineItemsDeepCopy[this.index]);

                        if (this.index === this.selectedLineItemsDeepCopy.length) {
                            this.index -= 1;
                        }
                        this.incrementedIndex = this.index + 1;
                        this.lineItem = this.selectedLineItemsDeepCopy[this.index];

                        this.checkIfButtonIsDisabledDependingOnIndex();

                        if (this.selectedLineItemsDeepCopy.length === 0) {
                            this.returnToSelectGood();
                        }

                        this.genericShowToast('Success!', 'EShop Order Record created Successfully!', 'success');
                    }
                )
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


    addAllOrdersToCart() {

        if (this.checkEShopOrderInputFields()) {
            this.isLoading = true;




            this.selectedLineItemsDeepCopy.forEach(e=>{

                this.eshopOrderJsonObject.eShopOrderGoodQuantity = e.quantityToAddToCart;
                this.eshopOrderJsonObject.estimatedDeliveryDate = e.estimatedDeliveryDate;
                this.eshopOrderJsonObject.cartId = this.cartId;
                this.eshopOrderJsonObject.goodLineItemId = e.id;

            })


            for (let i = 0; i < this.selectedLineItemsDeepCopy.length; i++) {

                this.eshopOrderJsonObject.eShopOrderGoodQuantity = this.selectedLineItemsDeepCopy[i].quantityToAddToCart;
                this.eshopOrderJsonObject.estimatedDeliveryDate = this.selectedLineItemsDeepCopy[i].estimatedDeliveryDate;
                this.eshopOrderJsonObject.estimatedDeliveryDate = this.selectedLineItemsDeepCopy[i].estimatedDeliveryDate;

                this.eshopOrderJsonObject.cartId = this.cartId;
                this.eshopOrderJsonObject.goodLineItemId = (this.selectedLineItemsDeepCopy)[i].id;


                this.paramsJSONString = JSON.stringify(this.eshopOrderJsonObject);
                console.log(this.paramsJSONString);
                createEshopOrderMethod(
                    {
                        paramsJSONString: this.paramsJSONString
                    })
                    .then(result => {

                            this.eshopOrderObject = result;
                            console.log(this.eshopOrderObject);
                        }
                    )
                    .catch(error => {
                        console.log('Error creating EShop Order');
                        console.log(error);
                        this.genericShowToast('Error creating EShop Order.', error.body.message, 'error');
                    })
            }
            this.genericShowToast('Success!', 'EShop Order Records created Successfully!', 'success');
            this.returnToSelectGood();
        } else {
            this.genericShowToast('Error creating EShopOrder', 'Please, complete required fields properly', 'error');
        }
        this.isLoading = false;
    }


    returnToNewCart() {

        this.dispatchEvent(new CustomEvent('switchtonewcart', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }


    returnToSelectGood() {

        this.dispatchEvent(new CustomEvent('switchtoselectgood', {
            detail: {
                'componentToDisplay': 'SelectGood',
                'cartId': this.cartId
            }
        }));
    }
}