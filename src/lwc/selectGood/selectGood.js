/**
 * Created by andrey on 8/20/24.
 */
import {LightningElement, track, wire} from 'lwc';

import fetchGoodLineItems
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItems';
import getGoodLineItemWrapperObjectsBySubCategory
    from '@salesforce/apex/SelectGoodController.getGoodLineItemWrapperObjectsBySubCategory';
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

    {label: 'Name', fieldName: 'name'},
    {label: 'Quantity', fieldName: 'quantity'},
    {label: 'Supplier Name', fieldName: 'supplierName'},
    {label: 'Size', fieldName: 'size'},
    {label: 'Colour', fieldName: 'colour'}
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
    gooodLineItems = [];
    goodLineItemId;
    columns = columns;
    goodLineItemWrapperObject = {};
    item;
    searchText = '';
    subCategory;
    goodLineItems = [];

    supplierName;


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


    @wire(fetchGoodLineItems, {searchText: '$searchText', subCategory: '$subCategory'})
    wiredGoodLineItems(result) {

        this.refreshedData = result
        if (result.data) {
            console.log('result  : ' + JSON.stringify(result));
            console.log('result.data :' + JSON.stringify(result.data));
            this.goodLineItems = result.data;
        } else if (result.error) {
            this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
            console.log('Error fetching GoodLineItems', result.error);
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

    handleChangeSearchText(event) {
        this.searchText = event.target.value;
    }

    handleSubCategoryChange(event) {
        this.subCategory = event.detail.name;
        getGoodLineItemWrapperObjectsBySubCategory(({
            subCategory: event.detail.name
        }))
            .then(result => {
                this.goodLineItems = result;
                /*    console.log(this.goodLineItems);

                    console.log(this.getValueByKey(this.getValueByKey(this.goodLineItems[0], "Supplier__r"), 'Name'));
                    console.log(this.goodLineItems[0].Supplier__r.Name);*/

                /*   this.goodLineItems.forEach(record => {
                       console.log(record.Id);
                       console.log(record.Name);
                       console.log(this.getValueByKey(record, "Quantity__c"));
                       console.log(this.getValueByKey(this.getValueByKey(record, "Supplier__r"), 'Name'));


                       this.goodLineItemWrapperObject.Id = record.Id;
                       this.goodLineItemWrapperObject.Name = record.Name;
                       this.goodLineItemWrapperObject.Quantity = this.getValueByKey(record, "Quantity__c");
                       this.goodLineItemWrapperObject.SupplierName = this.getValueByKey(this.getValueByKey(record, "Supplier__r"), 'Name');

                      /!* let goodLineItemWrapperObject = {Id: record.Id, Name: record.Name,Quantity:this.getValueByKey(record, "Quantity__c"),
                           SupplierName:this.getValueByKey(this.getValueByKey(record, "Supplier__r"), 'Name')};*!/

                       console.log('goodLineItemWrapperObject  :' + JSON.stringify(this.goodLineItemWrapperObject));
                       this.gooodLineItems.push(JSON.stringify(this.goodLineItemWrapperObject));
                       console.log('gooodLineItems   :' + this.gooodLineItems);
                   });*/


                //  this.goodName = this.getValueByKey(this.getValueByKey(result, "Good__r"), 'Name');
                //  this.listOfTodos=result;

                /*     {label: 'Id', fieldName: 'Id'},
                     {label: 'Name', fieldName: 'Name'},
                     {label: 'Quantity', fieldName: 'Quantity__c', type: 'number'},
                     {label: 'Supplier Name', fieldName: 'Supplier__r.Name'},
     */
                /* for(this.item of this.goodLineItems){
                     this.goodLineItems.push({
                         Id: this.item.Id,
                         Name:this.item.Name/!*,
                         Quantity:this.item.Quantity__c,
                         SupplierName:this.item.Supplier__r.Name*!/});
                 }*/

                /* this.result.forEach(item => { this.goodLineItems.push({
                     Id: item.Id,
                     Name:item.Name,
                     Quantity:item.Quantity__c,
                     SupplierName:item.Supplier__r.Name});});*/


                console.log('this.gooodLineItems: ', JSON.stringify(this.gooodLineItems));
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