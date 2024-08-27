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
    item;
    searchText = '';
    subCategory;
    goodLineItems = [];
    selectedItems = [];
    selectedRows = [];
    selectedItemsIds = [];
    supplierName;
    selectedItemsCopy = [];
    @track selectedItemsCopyWithoutBackslashes = [];
    @track selectedItemsQQQcopy = [];


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

    handleRowSelection(event) {

        this.selectedItems = [...event.detail.selectedRows];
        this.selectedItemsQQQ = event.detail.selectedRows;
        this.selectedItemsQQQcopy += JSON.stringify(this.selectedItemsQQQ);
        this.selectedItemsCopy += JSON.stringify(this.selectedItems);
        this.selectedItemsCopyWithoutBackslashes = JSON.stringify(this.selectedItemsCopy).split("\\").join("");
        console.log('this.selectedItems fffffffffffffffffffffffffff: ' + JSON.stringify(this.selectedItems));
        console.log('this.selectedItemsCopy fffffffffffffffffffffffffff: ' + JSON.stringify(this.selectedItemsCopy));
        console.log('this.selectedItemsCopy without \\\ fffffffffffffffffffffffffff: ' + JSON.stringify(this.selectedItemsCopy).split("\\").join(""));
        console.log(' this.selectedItemsQQQ: ' + JSON.stringify(this.selectedItemsQQQ));
        console.log(' this.selectedItemsQQQcopy: ' + this.selectedItemsQQQcopy);

    }

    handleSubCategoryChange(event) {
        this.subCategory = event.detail.name;
        getGoodLineItemWrapperObjectsBySubCategory(({
            subCategory: event.detail.name
        }))
            .then(result => {
                this.goodLineItems = result;
                console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
            })
            .catch(error => {
                console.log(error);
                console.log('error getting goodLineItems');
                this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
            });
    }


    displayViewGoodLineItemInBase() {

        // if (this.selectedItems.length === 0) {
        if (this.selectedItemsCopyWithoutBackslashes.length === 0) {
            this.genericShowToast('Error', 'Please select at least one Good', 'error');
        } else {

            console.log('this.selectedItems :' + this.selectedItemsCopyWithoutBackslashes);

            /*     for (let i = 0; i < this.selectedItems.length; i++) {
                     this.selectedItemsIds.push(this.selectedItems[i].id)
                 }*/

            for (let i = 0; i < this.selectedItemsQQQ.length; i++) {
                this.selectedItemsIds.push(this.selectedItemsQQQ[i].id)
            }

            console.log('this.selectedItemsIds :' + this.selectedItemsIds);
            this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
                detail: {
                    'componentToDisplay': 'ViewGoodLineItem',
                    'goodLineItemId': this.goodLineItemId,

                    'selectedItemsIds': this.selectedItemsIds,
                    'cartId': this.cartId
                }
            }));

            console.log('this.selectedItemsCopy :', JSON.stringify(this.selectedItemsCopy));
        }
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    returnToNewCart() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }
}