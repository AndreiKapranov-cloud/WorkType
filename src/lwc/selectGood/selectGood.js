/**
 * Created by andrey on 8/20/24.
 */
import {LightningElement} from 'lwc';
import getGoodLineItemsBySubCategory
    from '@salesforce/apex/EShopBaseComponentController.getGoodLineItemsBySubCategory';
import getCategoryPicklistValuesUsingApex
    from '@salesforce/apex/EShopBaseComponentController.getCategoryPicklistValuesUsingApex';
import getSubCategoryPickListValuesForCostumesCategory
    from '@salesforce/apex/EShopBaseComponentController.getSubCategoryPickListValuesForCostumesCategory';
import getSubCategoryPickListValuesForHoodiesCategory
    from '@salesforce/apex/EShopBaseComponentController.getSubCategoryPickListValuesForHoodiesCategory';
import getSubCategoryPickListValuesForSneakersCategory
    from '@salesforce/apex/EShopBaseComponentController.getSubCategoryPickListValuesForSneakersCategory';

import {genericShowToast} from "c/utils";


const columns = [
    {label: 'Id', fieldName: 'Id'},
    {label: 'Name', fieldName: 'Name'},
    {label: 'Quantity', fieldName: 'Quantity__c', type: 'number'},
    {label: 'Supplier Name', fieldName: 'Supplier__r.Name'},
];


export default class SelectGood extends LightningElement {
    isLoading = true;
    genericShowToast = genericShowToast.bind(this);
    buyerId;
    estimatedDeliveryDate;
    pickupPointAddress;
    status;
    categoryPicklistValues = [];
    displaySneakers = false;
    displayCostumes = false;
    displayHoodies = false;
    sneakersSubCategoryPicklistValues = [];
    hoodiesSubCategoryPicklistValues = [];
    costumesSubCategoryPicklistValues = [];
    comboboxLabel;
    goodLineItems = [];
    goodLineItemId;
    columns = columns;
    goodLineItemWrapperObject = {};
    item;



    getValueByKey(object, row) {
        return object[row];
    }

    handleCategoryChangeAction(event) {

        switch (event.detail.name) {

            case 'Sneakers'  : {
                this.isLoading = true;
                this.comboboxLabel = 'Sneakers';
                this.displaySneakers = true;
                this.displayHoodies = false;
                this.displayCostumes = false;
                this.isLoading = false;
                break;
            }
            case 'Hoodies': {
                this.isLoading = true;
                this.comboboxLabel = 'Hoodies';
                this.displayHoodies = true;
                this.displaySneakers = false;
                this.displayCostumes = false;
                this.isLoading = false;
                break;
            }
            case 'Costumes' : {
                this.isLoading = true;
                this.comboboxLabel = 'Costumes';
                this.displayCostumes = true;
                this.displayHoodies = false;
                this.displaySneakers = false;

                this.isLoading = false;
                break;
            }
            default:
                this.displaySneakers = true;
                break;
        }
    }

    connectedCallback() {

        getCategoryPicklistValuesUsingApex()
            .then(result => {
                this.categoryPicklistValues = result;
                console.log('this.picklistValues: ', this.categoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });

        getSubCategoryPickListValuesForHoodiesCategory()
            .then(result => {
                this.hoodiesSubCategoryPicklistValues = result;
                console.log('this.hoodiesSubCategoryPicklistValues: ', this.hoodiesSubCategoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting HoodiesSubCategoryPicklistValues');
                this.genericShowToast('Error getting HoodiesSubCategoryPicklistValues', error.body.message, 'error');
            });

        getSubCategoryPickListValuesForSneakersCategory()
            .then(result => {
                this.sneakersSubCategoryPicklistValues = result;
                console.log('this.sneakersSubCategoryPicklistValues: ', this.sneakersSubCategoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting SneakersSubCategoryPicklistValues');
                this.genericShowToast('Error getting SneakersSubCategoryPicklistValues', error.body.message, 'error');
            });
        getSubCategoryPickListValuesForCostumesCategory()
            .then(result => {
                this.costumesSubCategoryPicklistValues = result;
                console.log('this.costumesSubCategoryPicklistValues: ', this.costumesSubCategoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting CostumesSubCategoryPicklistValues');
                this.genericShowToast('Error getting CostumesSubCategoryPicklistValues', error.body.message, 'error');
            });


        this.isLoading = false;
    }

    handleSubCategoryChange(event) {

        getGoodLineItemsBySubCategory(({
            subCategory: event.detail.name
        }))
            .then(result => {

                this.listOfTodos=result;

           /*     {label: 'Id', fieldName: 'Id'},
                {label: 'Name', fieldName: 'Name'},
                {label: 'Quantity', fieldName: 'Quantity__c', type: 'number'},
                {label: 'Supplier Name', fieldName: 'Supplier__r.Name'},
*/
                for(this.item of this.listOfTodos){
                    this.goodLineItems.push({
                        Id: this.item.Id,
                        Name:this.item.Name/*,
                        Quantity:this.item.Quantity__c,
                        SupplierName:this.item.Supplier__r.Name*/});
                }

                this.result.forEach(item => { this.goodLineItems.push({
                    Id: item.Id,
                    Name:item.Name,
                    Quantity:item.Quantity__c,
                    SupplierName:item.Supplier__r.Name});});





                this.goodLineItemId = this.getValueByKey(result[0], "Id");

                console.log('this.goodLineItems: ', this.goodLineItems);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting goodLineItems');
                this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
            });

    }

    displayViewGoodLineItemInBase() {
        console.log('displayViewGoodLineItemInBase,this.goodLineItemId :' + this.goodLineItemId);
        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'ViewGoodLineItem',
                'goodLineItemId': this.goodLineItemId
            }
        }));
    }

    handleChangeGoodLineItems(e) {
        this.goodLineItemId = e.target.key;
        console.log('handleChangeGoodLineItems,this.goodLineItemId :' + this.goodLineItemId);
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

}