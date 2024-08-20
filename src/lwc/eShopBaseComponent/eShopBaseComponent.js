/**
 * Created by andrey on 8/20/24.
 */

import {LightningElement} from 'lwc';

export default class EShopBaseComponent extends LightningElement {

    componentName = 'New Cart';
    displayNewCartComponent = true;
    displaySelectGoodComponent = false;

    handleWhichComponentToDisplay(event) {
        switch (event.detail.componentToDisplay) {
            case 'NewCart'  : {
                this.componentName = 'New Cart';
                this.displayNewCartComponent = true;
                break;
            }
            case 'SelectGood': {
                this.componentName = 'Select Good';
                // this.workTypeRecordId = event.detail.workTypeRecordId;
                this.displaySelectGoodComponent = true;
                this.displayNewCartComponent = false;
                break;
            }
            // case 'NewEShopOrder': {
            //     this.componentName = 'New EShop Order';
            //     // this.workTypeRecordId = event.detail.workTypeRecordId;
            //     this.displayNewEShopOrderComponent = true;
            //     this.displayNewCartComponent = false;
            //     break;
            // }
            default:
                this.displayNewCartComponent = true;
                //   this.displayNewEShopOrderComponent = false;
                break;
        }
    }
}