/**
 * Created by andrey on 8/23/24.
 */
import {LightningElement, api} from 'lwc';
import getGoodLineItemById
    from '@salesforce/apex/EShopBaseComponentController.getGoodLineItemById';
import {genericShowToast} from "c/utils";


export default class ViewGoodLineItem extends LightningElement {
    genericShowToast = genericShowToast.bind(this);
    @api goodLineItemId;
    goodLineItem;
    goodName;
    quantity;
    colour;
    size;
    supplierName;
    eShopOrderGoodQuantity;
    estimatedDeliveryDate;
    eshopOrderJsonObject;

    getValueByKey(object, row) {
        return object[row];
    }


    connectedCallback() {
        console.log('connectedCallback:' + this.goodLineItemId);
        getGoodLineItemById(({
            goodLineItemId: this.goodLineItemId
        }))
            .then(result => {

                //    this.goodLineItemId = this.getValueByKey(result[0], "Id");

                this.goodLineItem = result;
                this.goodName = this.getValueByKey(this.getValueByKey(result, "Good__r"), 'Name');
                this.quantity = this.getValueByKey(result, 'Quantity__c');
                this.colour = this.getValueByKey(this.getValueByKey(result, "Good__r"), 'Colour__c');
                this.size = this.getValueByKey(this.getValueByKey(result, "Good__r"), 'Size__c');
                ;
                this.supplierName = '🥰🥶' + this.getValueByKey(this.getValueByKey(result, "Supplier__r"), 'Name');
                console.log('this.goodLineItem: ', this.goodLineItem);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting GoodLineItem');
                this.genericShowToast('Error getting GoodLineItem', error.body.message, 'error');
            });

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
        this.eshopOrderJsonObject.goodId = this.goodId;
        this.eshopOrderJsonObject.registrationDate = this.registrationDate;
        this.eshopOrderJsonObject.goodLineItemId = this.goodLineItemId;

        this.paramsJSONString = JSON.stringify(this.workOrderLineItemJsonObject);

        createWorkOrderLineItemApexMethod(
            {
                paramsJSONString: this.paramsJSONString
            })
            .then(result => {
                console.log(result);
                this.workOrderLineItemObject = result;
                console.log('workOrderLineItemObject = ' + this.workOrderLineItemObject);
                this.genericShowToast('Success!', 'Work Order Line Item Record is created Successfully!', 'success');
            })
            .catch(error => {
                console.log('error createWorkOrder');
                console.log(error);
                this.genericShowToast('Error creating Work Order Line Item.', error.body.message, 'error');
            }).finally(
            () => {
                this.isLoading = false;
            }
        )
    }


}