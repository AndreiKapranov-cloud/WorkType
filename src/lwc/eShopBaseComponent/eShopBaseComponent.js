/**
 * Created by andrey on 8/20/24.
 */

import {LightningElement, track} from 'lwc';

export default class EShopBaseComponent extends LightningElement {

    @track lineItems;
    isLoading = false;
    componentName = 'New Cart';
    displayNewCartComponent = true;
    displaySelectGoodComponent = false;
    displayViewGoodLineItem = false;


    handleSwitchToNewCart(event){
        this.isLoading = true;
        this.componentName = 'New Cart';
        this.displayNewCartComponent = true;
        this.displayViewGoodLineItem = false;
        this.displaySelectGoodComponent = false;
        this.isLoading = false;
    }

    handleSwitchToSelectGood(event) {
        this.isLoading = true;
        this.cartId = event.detail.cartId;
        this.componentName = 'Select Good';
        this.displaySelectGoodComponent = true;
        this.displayNewCartComponent = false;
        this.displayViewGoodLineItem = false;
        this.isLoading = false;
    }

    handleSwitchToViewGoodLineItem(event) {
        this.isLoading = true;
        this.lineItems = event.detail.lineItems;
        this.componentName = 'Eshop Order';
        this.displayViewGoodLineItem = true;
        this.displaySelectGoodComponent = false;
        this.isLoading = false;
    }








   /* handleWhichComponentToDisplay(event) {
        this.isLoading = true;
        switch (event.detail.componentToDisplay) {
            case 'NewCart'  : {

                this.componentName = 'New Cart';
                this.displayNewCartComponent = true;
                this.displayViewGoodLineItem = false;
                this.displaySelectGoodComponent = false;
                this.isLoading = false;
                break;
            }
            case 'SelectGood': {
                this.cartId = event.detail.cartId;
                this.componentName = 'Select Good';
                this.displaySelectGoodComponent = true;
                this.displayNewCartComponent = false;
                this.displayViewGoodLineItem = false;
                this.isLoading = false;
                break;
            }
            case 'ViewGoodLineItem': {
                console.log('ViewGoodLineItem');
                this.goodLineItemId = event.detail.goodLineItemId;
                this.selectedItemsIds = event.detail.selectedItemsIds;

                this.lineItems = event.detail.lineItems;
                this.componentName = 'Eshop Order';
                this.displayViewGoodLineItem = true;
                this.displaySelectGoodComponent = false;
                this.isLoading = false;
                break;
            }

            default:
                this.displayNewCartComponent = true;
                this.isLoading = false;
                break;
        }
    }*/
}