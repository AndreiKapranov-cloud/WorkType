


import {ShowToastEvent} from "lightning/platformShowToastEvent";


   export function genericShowToast(title,message,variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);

     }