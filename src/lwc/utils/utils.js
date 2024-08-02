/**
 * Created by andrey on 8/1/24.
 */


import {ShowToastEvent} from "lightning/platformShowToastEvent";



   export function genericShowToast(title,message,variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        console.log('Message');
        this.dispatchEvent(toastEvent);

     }