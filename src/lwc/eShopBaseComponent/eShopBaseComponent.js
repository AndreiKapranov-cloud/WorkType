/**
 * Created by andrey on 8/20/24.
 */

import {LightningElement} from 'lwc';

export default class EShopBaseComponent extends LightningElement {

    componentName = 'New Cart';
    displayNewCartComponent = true;
    displaySelectGoodComponent = false;
    displayViewGoodLineItem = false;

    handleWhichComponentToDisplay(event) {
        switch (event.detail.componentToDisplay) {
            case 'NewCart'  : {

                this.componentName = 'New Cart';
                this.displayNewCartComponent = true;
                this.displayViewGoodLineItem = false;
                this.displaySelectGoodComponent = false;
                break;
            }
            case 'SelectGood': {
                this.cartId = event.detail.cartId;
                this.componentName = 'Select Good';
                this.displaySelectGoodComponent = true;
                this.displayNewCartComponent = false;
                this.displayViewGoodLineItem = false;
                break;
            }
            case 'ViewGoodLineItem': {
                this.goodLineItemId = event.detail.goodLineItemId;
                this.selectedItemsIds = event.detail.selectedItemsIds;
                this.componentName = 'Eshop Order';
                this.displayViewGoodLineItem = true;
                this.displaySelectGoodComponent = false;
                break;
            }

            default:
                this.displayNewCartComponent = true;
                //   this.displayNewEShopOrderComponent = false;
                break;
        }
    }
}