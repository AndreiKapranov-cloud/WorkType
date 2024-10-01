import {LightningElement, api, track} from 'lwc';


import createEshopOrders
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrders';

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
    @track paramsJSONString = [];
    @track eshopOrderResultObjects = [];
    @track indexesOfOrdersNotValid = [];
    @track eshopOrderObjects = [];
    @track incrementedIndexesOfOrdersNotValid = [];
    @track namesOfItemsNotValid = [];
    @track lineItemsNotValid = [];
    @track namesOfValidItems = [];

    lineItem;
    quantity;
    colour;
    size;
    supplierName;
    estimatedDeliveryDate;
    eshopOrderResultObject = {};
    isLoading = true;
    index = 0;
    goToNextEShopOrderButtonDisabled = true;
    goToPreviousEShopOrderButtonDisabled = true;
    incrementedIndex = 1;
    isEstimatedDeliveryDateValid = false;
    addAllButtonDisabled = false;
    isDeliveryDateValid;
    goodQuantityInputNotSpaces;
    quantityEnough;
    isQuantityValid;
    isOrderQuantityBlank;
    isWareHouseQuantityEnough;
    estimatedDeliveryDateTarget;
    quantityTarget;

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
                this.goodQuantityInputNotSpaces = false;
            } else {
                target.setCustomValidity('');
                this.goodQuantityInputNotSpaces = true;
            }

            console.log('this.lineItem.quantityToAddToCart:  ' + this.lineItem.quantityToAddToCart);
            console.log('this.lineItem.quantity :  ' + this.lineItem.quantity);

            if (this.lineItem.quantityToAddToCart > this.lineItem.quantity) {
                target.setCustomValidity('Do not Have This Amount of Goods In The Warehouse.');
                this.quantityEnough = false;
            } else {
                target.setCustomValidity('');
                this.quantityEnough = true;
            }

            if (this.goodQuantityInputNotSpaces && this.quantityEnough) {

                this.isQuantityValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    handleOrderEstimatedDeliveryDateChange(e) {

        try {

            let target = e.target;

            this.quantityTarget = e.target;
            target.setCustomValidity('');
            this.lineItem.estimatedDeliveryDate = e.target.value;

            let estimatedDeliveryDateValue = new Date(this.lineItem.estimatedDeliveryDate);

            let today = new Date();

            let yyyyMmDdEstimatedDeliveryDateValue = estimatedDeliveryDateValue.toISOString().slice(0, 10);
            let yyyyMmDdToday = today.toISOString().slice(0, 10);

            console.log('yyyyMmDdEstimatedDeliveryDateValue:  ' + yyyyMmDdEstimatedDeliveryDateValue);
            console.log('yyyyMmDdToday :  ' + yyyyMmDdToday);


            if (yyyyMmDdEstimatedDeliveryDateValue < yyyyMmDdToday) {
                target.setCustomValidity('Can not input past Date.');
                this.isEstimatedDeliveryDateValid = false;
            } else {
                target.setCustomValidity('');

                this.selectedLineItemsDeepCopy[this.index].estimatedDeliveryDate = e.target.value;
                this.isEstimatedDeliveryDateValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }

    validateOrderGoodQuantity() {
        let goodQuantityInput = this.template.querySelector(".quantity");
        goodQuantityInput.reportValidity();

        return goodQuantityInput.checkValidity() && this.isQuantityValid;
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
            this.addAllButtonDisabled = true;
            this.incrementedIndex = 1;
        }
    }

    goToNextEShopOrder() {

        if (this.index < this.selectedLineItemsDeepCopy.length - 1) {
            this.index += 1;
            this.incrementedIndex += 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            this.checkIfButtonIsDisabledDependingOnIndex();

        }
    }

    goToPreviousEShopOrder() {

        if (this.index > 0) {
            this.index -= 1;
            this.incrementedIndex -= 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            this.checkIfButtonIsDisabledDependingOnIndex();

        }
    }

    addNewEShopOrderToCart() {

        if (this.checkEShopOrderInputFields()) {
            this.eshopOrderObjects = [];
            this.paramsJSONString = [];
            this.isLoading = true;
            let eshopOrderObject = {};
            eshopOrderObject.eShopOrderGoodQuantity = this.lineItem.quantityToAddToCart;
            eshopOrderObject.estimatedDeliveryDate = this.lineItem.estimatedDeliveryDate;
            eshopOrderObject.cartId = this.cartId;
            eshopOrderObject.goodLineItemId = this.lineItem.id;

            console.log('eshopOrderObject  :' + eshopOrderObject);

            this.eshopOrderObjects.push(eshopOrderObject);

            console.log('this.eshopOrderObjects  :' + this.eshopOrderObjects);

            this.paramsJSONString = JSON.stringify(this.eshopOrderObjects);


            console.log('this.paramsJSONString  :' + this.paramsJSONString);

            createEshopOrders(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {

                        console.log('result    :' + result);

                        this.eshopOrderResultObject = result[0];
                        console.log('this.eshopOrderObject   :' + this.eshopOrderResultObject);

                        this.deleteItemFromView();
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
            this.paramsJSONString = [];
            this.indexesOfOrdersNotValid = [];
            this.lineItemsNotValid = [];
            this.namesOfItemsNotValid = [];
            this.namesOfValidItems = [];
            this.isLoading = true;

            this.selectedLineItemsDeepCopy.forEach((selectedLineItem, index) => {

                if (selectedLineItem.estimatedDeliveryDate) {
                    let estimatedDeliveryDateValue = new Date(selectedLineItem.estimatedDeliveryDate);

                    let today = new Date();

                    let yyyyMmDdEstimatedDeliveryDateValue = estimatedDeliveryDateValue.toISOString().slice(0, 10);
                    let yyyyMmDdToday = today.toISOString().slice(0, 10);

                    this.isDeliveryDateValid = yyyyMmDdEstimatedDeliveryDateValue >= yyyyMmDdToday;
                } else {
                    this.isDeliveryDateValid = false;
                }

                if (selectedLineItem.quantityToAddToCart) {
                    const isWhitespaceString = str => !str.replace(/\s/g, '').length;

                    this.isOrderQuantityBlank = (isWhitespaceString(selectedLineItem.quantityToAddToCart) || selectedLineItem.quantityToAddToCart === '');

                    this.isWareHouseQuantityEnough = selectedLineItem.quantityToAddToCart <= selectedLineItem.quantity;

                }

                if (!this.isDeliveryDateValid || this.isOrderQuantityBlank || !this.isWareHouseQuantityEnough || !selectedLineItem.estimatedDeliveryDate || !selectedLineItem.quantityToAddToCart) {

                    this.namesOfItemsNotValid.push(selectedLineItem.name);
                    this.lineItemsNotValid.push(selectedLineItem);
                    this.indexesOfOrdersNotValid.push(index);
                    this.incrementedIndexesOfOrdersNotValid.push(index + 1);

                } else {

                    let eshopOrderObject = {};

                    eshopOrderObject.eShopOrderGoodQuantity = selectedLineItem.quantityToAddToCart;
                    eshopOrderObject.estimatedDeliveryDate = selectedLineItem.estimatedDeliveryDate;
                    eshopOrderObject.cartId = this.cartId;
                    eshopOrderObject.goodLineItemId = selectedLineItem.id;

                    this.namesOfValidItems.push(selectedLineItem.name);

                    this.eshopOrderObjects.push(eshopOrderObject);
                }
            });

            if (this.lineItemsNotValid.length > 0) {

                this.genericShowToast('Error creating EShopOrder', 'Please, complete required fields properly  for Orders, having this names: ' +
                    this.namesOfItemsNotValid, 'error');
            }

            this.paramsJSONString = JSON.stringify(this.eshopOrderObjects);

            console.log('this.paramsJSONString :' + this.paramsJSONString);
            console.log('this.namesOfValidItems :' + this.namesOfValidItems);
            createEshopOrders(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
                        console.log('result   : ' + JSON.stringify(result));

                        this.eshopOrderResultObjects = result;

                        this.genericShowToast('Success!', 'EShop Order Records created Successfully, having names: ' + this.namesOfValidItems, 'success');
                    }
                )
                .catch(error => {
                    console.log(error);
                    this.genericShowToast('Error creating EShop Orders.', error.body.message, 'error');
                })

            this.selectedLineItemsDeepCopy = this.lineItemsNotValid;

            this.lineItem = this.selectedLineItemsDeepCopy[0];

            this.index = 0;
            this.incrementedIndex = 1;
            this.checkIfButtonIsDisabledDependingOnIndex();

            if (this.selectedLineItemsDeepCopy.length === 0) {
                this.returnToSelectGood();
            }
        } else {
            this.genericShowToast('Error creating EShopOrder', 'Please, complete required fields properly.', 'error');
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

    deleteItemFromView() {

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
    }
}