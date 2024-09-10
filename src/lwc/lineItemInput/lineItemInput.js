/**
 * Created by andrey on 9/10/24.
 */

import {LightningElement, api, track} from 'lwc';

export default class LineItemInput extends LightningElement {


    @api index;
    @api selectedLineItemsDeepCopy;

    @track lineItemCopy;


    @api
    get lineItem() {
        return this.lineItemCopy;
    }

    set lineItem(value) {
        this.lineItemCopy = JSON.parse(JSON.stringify(value));
        console.log('run');
    }


    @api sendValuesToParent() {

        this.dispatchEvent(new CustomEvent('sendvaluestoviewgoodlineitem', {
            detail: {
                lineItem: this.lineItemCopy
            }
        }));
    }



    renderedCallback() {

    }



    connectedCallback() {
        this.lineItemCopy = JSON.parse(JSON.stringify(this.lineItem));
        console.log( 'this.lineItemCopy from connectedCallback   : ' + this.lineItemCopy);
    }


    handleOrderEstimatedDeliveryDateChange(e) {

        try {

            //  this.targetOfDeliveryDateHandler = e.target;

            let target = e.target;

            this.quantityTarget = e.target;
            target.setCustomValidity('');
            this.lineItemCopy.estimatedDeliveryDate = e.target.value;

           // this.selectedLineItemsDeepCopy[this.index].estimatedDeliveryDate = e.target.value;


       /*     let estimatedDeliveryDateValue = new Date(this.lineItemCopy.estimatedDeliveryDate);

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
            }*/
        } catch (e) {
            console.log(e.message)
        }
    }


    handleEShopOrderGoodQuantityChange(e) {
        try {
            let target = e.target;

            this.estimatedDeliveryDateTarget = e.target;

            this.lineItemCopy.quantityToAddToCart = e.target.value;
          //  this.selectedLineItemsDeepCopy[this.index].quantityToAddToCart = e.target.value;

         /*   const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            if (isWhitespaceString(this.lineItem.quantityToAddToCart) || this.lineItem.quantityToAddToCart === '') {
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
            }*/


        } catch (e) {
            console.log(e.message)
        }
    }

    validateOrderGoodQuantity() {
        let goodQuantityInput = this.template.querySelector(".quantity");

        console.log('validate validateOrderGoodQuantity : ' + goodQuantityInput);
        goodQuantityInput.reportValidity();

        return goodQuantityInput.checkValidity() && this.isQuantityValid;
    }


    validateEstimatedDeliveryDate() {
        let estimatedDeliveryDateInput = this.template.querySelector(".estimatedDeliveryDate");

        console.log('validate EstimatedDeliveryDate : ' + estimatedDeliveryDateInput);
        estimatedDeliveryDateInput.reportValidity();
        return estimatedDeliveryDateInput.checkValidity() && this.isEstimatedDeliveryDateValid;
    }


    checkEShopOrderInputFields() {
        let isOrderGoodQuantityValid = this.validateOrderGoodQuantity();
        let estimatedDeliveryDateValid = this.validateEstimatedDeliveryDate()
        return isOrderGoodQuantityValid && estimatedDeliveryDateValid;
    }





}