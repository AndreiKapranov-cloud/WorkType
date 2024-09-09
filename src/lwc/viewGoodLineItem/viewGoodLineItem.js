/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api, track} from 'lwc';

import createEshopOrder
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrder';
import createEshopOrders
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrders';

import {genericShowToast} from "c/utils";

import {RefreshEvent} from 'lightning/refresh';

export default class ViewGoodLineItem extends LightningElement {

    genericShowToast = genericShowToast.bind(this);

    @api cartId;
    @api selectedItemsIds = [];
    @api lineItems;

    @track eshopOrderWrapperList = [];
    @track clonedLineItems = [];
    @track selectedLineItemsDeepCopy = [];
    @track itemNames = [];
    @track allParamsJSONString = [];
    @track eshopOrderObjects = [];
    @track indexesOfOrdersNotValid = [];

    isWhitespaceString = str => !str.replace(/\s/g, '').length;

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
    isLoading = true;
    index = 0;
    goToNextEShopOrderButtonDisabled = true;
    goToPreviousEShopOrderButtonDisabled = true;
    incrementedIndex = 1;
    isEstimatedDeliveryDateValid = false;
    addAllButtonDisabled = true;
    targetOfDeliveryDateHandler;
    deliveryDateValid;
    quantityToAddToCartValid;
    goodQuantityInputNotSpaces;
    quantityEnough;
    isQuantityValid;
    orderQuantityBlank;
    wareHouseQuantityEnough;
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

    /*  renderedCallback() {
         // super.renderedCallback();

          let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
          let goodQuantityInput = this.template.querySelector(".quantity");

          console.log('estimatedDeliveryDateInput  : ' + estimatedDeliveryDateInput);
          console.log('goodQuantityInput  : ' + goodQuantityInput);

          estimatedDeliveryDateInput.setCustomValidity('');
          goodQuantityInput.setCustomValidity('');
      }*/

    handleEShopOrderGoodQuantityChange(e) {
        try {
            let target = e.target;

            this.estimatedDeliveryDateTarget = e.target;

            this.lineItem.quantityToAddToCart = e.target.value;
            this.selectedLineItemsDeepCopy[this.index].quantityToAddToCart = e.target.value;

            //   const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            if (this.isWhitespaceString(this.lineItem.quantityToAddToCart) || this.lineItem.quantityToAddToCart === '') {
                target.setCustomValidity('Complete this field.');
                this.goodQuantityInputNotSpaces = false;
            } else {
                target.setCustomValidity('');
                this.goodQuantityInputNotSpaces = true;
            }

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


    /*valiQuant(quantity, target) {


        if (this.isWhitespaceString(this.lineItem.quantityToAddToCart) || this.lineItem.quantityToAddToCart === '') {
            target.setCustomValidity('Complete this field.');
            this.goodQuantityInputNotSpaces = false;
        } else {
            target.setCustomValidity('');
            this.goodQuantityInputNotSpaces = true;
        }

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

    }*/


    handleOrderEstimatedDeliveryDateChange(e) {

        try {

            //  this.targetOfDeliveryDateHandler = e.target;

            let target = e.target;

            this.quantityTarget = e.target;
            target.setCustomValidity('');
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
                //      this.selectedLineItemsDeepCopy[this.index].estimatedDeliveryDate = e.target.value;
                this.isEstimatedDeliveryDateValid = true;
            }

        } catch (e) {
            console.log(e.message)
        }
    }


    handleResetEstimatedDeliveryDate(e){

        let target = e.target;
        target.setCustomValidity('');

    }

    handleBlur(e){

        let target = e.target;
        target.setCustomValidity('');

    }
    handleEmptied(e){

        let target = e.target;
        target.setCustomValidity('');

    }


   /* valiDate(date, target) {
        let estimatedDeliveryDateValue = new Date(date);

        let today = new Date();

        let yyyyMmDdEstimatedDeliveryDateValue = estimatedDeliveryDateValue.toISOString().slice(0, 10);
        let yyyyMmDdToday = today.toISOString().slice(0, 10);

        if (yyyyMmDdEstimatedDeliveryDateValue < yyyyMmDdToday) {
            target.setCustomValidity('Date not Valid.');
            this.isEstimatedDeliveryDateValid = false;
        } else {
            target.setCustomValidity('');
            this.selectedLineItemsDeepCopy[this.index].estimatedDeliveryDate = e.target.value;
            this.isEstimatedDeliveryDateValid = true;
        }
    }*/


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
            this.incrementedIndex = 1;
        }
    }


    goToNextEShopOrder() {

        /*  this.dispatchEvent(new RefreshEvent);
          this.quantityTarget.setCustomValidity('');

          this.estimatedDeliveryDateTarget.setCustomValidity('');

          */

       /*  this.checkEShopOrderInputFields();
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        let goodQuantityInput = this.template.querySelector(".quantity");


        estimatedDeliveryDateInput.setCustomValidity('');
        goodQuantityInput.setCustomValidity('');

*/
        // if (this.checkEShopOrderInputFields()) {
        if (this.index < this.selectedLineItemsDeepCopy.length - 1) {
            this.index += 1;
            this.incrementedIndex += 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            this.checkIfButtonIsDisabledDependingOnIndex();
            if (this.index === this.selectedLineItemsDeepCopy.length - 1) {
                this.addAllButtonDisabled = false;
            }
        }
        /*  } else {
              this.genericShowToast('Input not valid.', 'Please, complete required fields properly.', 'error');
          }*/

    //    this.checkEShopOrderInputFields();
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        let goodQuantityInput = this.template.querySelector(".quantity");


        estimatedDeliveryDateInput.setCustomValidity('');
        goodQuantityInput.setCustomValidity('');
    }


    goToPreviousEShopOrder() {

        //   this.dispatchEvent(new RefreshEvent);
       /* this.checkEShopOrderInputFields();
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        let goodQuantityInput = this.template.querySelector(".quantity");


        estimatedDeliveryDateInput.setCustomValidity('');
        goodQuantityInput.setCustomValidity('');*/
       // this.checkEShopOrderInputFields();

        //  if (this.checkEShopOrderInputFields()) {
        if (this.index > 0) {
            this.index -= 1;
            this.incrementedIndex -= 1;
            this.lineItem = this.selectedLineItemsDeepCopy[this.index];
            this.checkIfButtonIsDisabledDependingOnIndex();

            /* } else {

                 this.genericShowToast('Input not valid.', 'Please, complete required fields properly.', 'error');

             }*/
        }

    //    this.checkEShopOrderInputFields();
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");
        let goodQuantityInput = this.template.querySelector(".quantity");


        estimatedDeliveryDateInput.setCustomValidity('');
        goodQuantityInput.setCustomValidity('');
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
            createEshopOrder(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
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
            this.allParamsJSONString = [];
            this.indexesOfOrdersNotValid = [];

            this.selectedLineItemsDeepCopy.forEach(e => {

                this.eshopOrderJsonObject.eShopOrderGoodQuantity = e.quantityToAddToCart;
                this.eshopOrderJsonObject.eShopOrderGoodQuantity = e.quantityToAddToCart;
                this.eshopOrderJsonObject.estimatedDeliveryDate = e.estimatedDeliveryDate;


                this.eshopOrderJsonObject.cartId = this.cartId;
                this.eshopOrderJsonObject.goodLineItemId = e.id;

                this.paramsJSONString = JSON.stringify(this.eshopOrderJsonObject);
                //     console.log(this.paramsJSONString);

                this.allParamsJSONString.push(this.paramsJSONString);

            });


            this.selectedLineItemsDeepCopy.forEach((e, index) => {


                if (e.estimatedDeliveryDate) {
                    let estimatedDeliveryDateValue = new Date(e.estimatedDeliveryDate);

                    let today = new Date();


                    let yyyyMmDdEstimatedDeliveryDateValue = estimatedDeliveryDateValue.toISOString().slice(0, 10);
                    let yyyyMmDdToday = today.toISOString().slice(0, 10);


                    console.log('yyyyMmDdEstimatedDeliveryDateValue:  ' + yyyyMmDdEstimatedDeliveryDateValue);
                    console.log('yyyyMmDdToday :  ' + yyyyMmDdToday);


                    this.deliveryDateValid = yyyyMmDdEstimatedDeliveryDateValue > yyyyMmDdToday;
                    console.log('this.deliveryDateValid    :' + this.deliveryDateValid);
                } else {
                    this.deliveryDateValid = false;
                }


                if (e.quantityToAddToCart) {
                    const isWhitespaceString = str => !str.replace(/\s/g, '').length;

                    this.orderQuantityBlank = (isWhitespaceString(e.quantityToAddToCart) || e.quantityToAddToCart === '');


                    console.log('this.orderQuantityBlank : ' + this.orderQuantityBlank);

                    this.wareHouseQuantityEnough = e.quantityToAddToCart <= e.quantity;

                    console.log('this.wareHouseQuantityEnough    :' + this.wareHouseQuantityEnough);

                }


                if (!this.deliveryDateValid || this.orderQuantityBlank || !this.wareHouseQuantityEnough || !e.estimatedDeliveryDate || !e.quantityToAddToCart) {

                    console.log('e.index   :' + (index + 1));
                    this.indexesOfOrdersNotValid.push(index + 1);
                    console.log('this.indexesOfOrdersNotValid//////////////////////////// :' + this.indexesOfOrdersNotValid);
                }

            });


            if (this.indexesOfOrdersNotValid.length === 0) {
                console.log('this.allParamsJSONString   :' + this.allParamsJSONString);
                createEshopOrders(
                    {
                        allParamsJSONString: this.allParamsJSONString
                    })
                    .then(result => {


                            this.eshopOrderObjects = result;


                            console.log('this.eshopOrderObjects    :' + this.eshopOrderObjects);
                            this.returnToSelectGood();
                        }
                    )
                    .catch(error => {
                        console.log('Error creating EShop Orders');
                        console.log(error);
                        this.genericShowToast('Error creating EShop Orders.', error.body.message, 'error');
                    })

                this.genericShowToast('Success!', 'EShop Order Records created Successfully!', 'success');


            } else {

                this.genericShowToast('Error creating EShopOrder', 'Please, complete required fields properly  for Orders, having this numbers: ' +
                    this.indexesOfOrdersNotValid, 'error');

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

}