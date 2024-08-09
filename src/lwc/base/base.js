/**
 * Created by andrey on 8/9/24.
 */

import {api, LightningElement} from 'lwc';

export default class Base extends LightningElement {

    displayNewWorkTypeComponent = true;
    displayNewSkillRequirementComponent = false;
    displayNewProductRequiredComponent = false;
    displayNewProductItemComponent = false;

    handleDisplayNewWorkTypeComponent(event) {
        this.displayNewWorkTypeComponent = true;
        this.displayNewProductItemComponent = false;

    }

    handleDisplayNewSkillRequirementComponent(event) {
        this.workTypeRecordId = event.detail.workTypeRecordId;
        this.workTypeName = event.detail.workTypeName;
        this.workTypeObject = event.detail.workTypeObject;

        this.displayNewSkillRequirementComponent = true;
        this.displayNewWorkTypeComponent = false;

    }

    handleDisplayNewProductRequiredComponent(event) {
        this.workTypeRecordId = event.detail.workTypeRecordId;
        this.workTypeName = event.detail.workTypeName;


        this.displayNewProductRequiredComponent = true;
        this.displayNewSkillRequirementComponent = false;
    }

    handleDisplayNewProductItemComponent(event) {

        this.displayNewProductItemComponent = true;
        this.displayNewProductRequiredComponent = false;
    }
}