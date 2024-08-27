/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api} from 'lwc';
import getGoodLineItemById
    from '@salesforce/apex/EShopBaseComponentController.getGoodLineItemById';
import getGoodLineItemWrappersByIds
    from '@salesforce/apex/SelectGoodController.getGoodLineItemWrappersByIds';

getGoodLineItemWrappersByIds
import getGoodLineItemsByIds
    from '@salesforce/apex/EShopBaseComponentController.getGoodLineItemsByIds';
import createEshopOrderMethod
    from '@salesforce/apex/EShopBaseComponentController.createEshopOrderMethod';

import {genericShowToast} from "c/utils";


export default class ViewGoodLineItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    @api goodLineItemId;
    @api cartId;
    @api selectedItemsIds;
    goodLineItem;
    goodLineItems = [];
    goodName;
    quantity;
    colour;
    size;
    supplierName;
    eShopOrderGoodQuantity;
    estimatedDeliveryDate;
    eshopOrderJsonObject = {};
    paramsJSONString = [];
    eshopOrderObject = {};
    goodLineItemWrapperObject = {};

    getValueByKey(object, row) {
        return object[row];
    }


    connectedCallback() {

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
        this.eShopOrderGoodQuantity = e.target.value;
    }

    handleEstimatedDeliveryDateChange(e) {
        this.estimatedDeliveryDate = e.target.value;
    }

    addNewEShopOrderToCart() {

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
    }
    returnToNewCart() {

        console.log('wrrrrrrrr...')
        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }

    returnToSelectGood() {

        console.log('wrrrrrrrr...')
        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'SelectGood',
                'cartId': this.cartId
            }
        }));
    }


}