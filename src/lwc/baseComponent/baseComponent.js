

import {api, LightningElement} from 'lwc';

export default class BaseComponent extends LightningElement {
    componentName = 'New Work Type';
    displayNewWorkTypeComponent = true;
    displayNewSkillRequirementComponent = false;
    displayNewProductRequiredComponent = false;
    displayNewProductItemComponent = false;

    handleWhichComponentToDisplay(event) {
        switch (event.detail.componentToDisplay) {
            case 'NewWorkType'  : {
                this.componentName = 'New Work Type';
                this.displayNewWorkTypeComponent = true;
                this.displayNewProductItemComponent = false;
                break;
            }
            case 'NewSkillRequirement': {
                this.componentName = 'New Skill Requirement';
                this.workTypeRecordId = event.detail.workTypeRecordId;
                this.workTypeName = event.detail.workTypeName;
                this.workTypeObject = event.detail.workTypeObject;
                this.displayNewSkillRequirementComponent = true;
                this.displayNewWorkTypeComponent = false;
                break;
            }
            case 'NewProductRequired' : {
                this.componentName = 'New Product Required';
                //TODO:  workTypeRecordId and workTypeName  repeated
                this.workTypeRecordId = event.detail.workTypeRecordId;
                this.workTypeName = event.detail.workTypeName;
                this.displayNewProductRequiredComponent = true;
                this.displayNewSkillRequirementComponent = false;
                break;
            }
            case 'NewProductItem' : {
                this.componentName = 'New Product Item';
                this.displayNewProductItemComponent = true;
                this.displayNewProductRequiredComponent = false;
                break;
            }
            default:
                this.displayNewWorkTypeComponent = true;
                this.displayNewProductItemComponent = false;
                break;
        }
    }
}