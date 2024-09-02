/**
 * Created by andrey on 8/20/24.
 */
import {LightningElement, track, wire} from 'lwc';

import fetchGoodLineItemsInGlobalSearch
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInGlobalSearch';
import fetchGoodLineItemsInCategory
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInCategory';
import fetchGoodLineItemsInSubCategory
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInSubCategory';
import fetchGoodLineItems
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItems';
import getGoodLineItemWrapperObjectsByCategory
    from '@salesforce/apex/SelectGoodController.getGoodLineItemWrapperObjectsByCategory';
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
    goodLineItemId;
    columns = columns;
    item;
    globalSearchText = '';
    categorySearchText = '';
    subCategorySearchText = '';
    category;
    subCategory;
    @track goodLineItems = [];
    @track selectedItems = [];
    selectedRows = [];
    selectedItemsIds = [];
    supplierName;
    @track selectedItemsCopyWithoutBackslashes = [];
    @track selectedOption = 'Global Search';
    @track preselectedRows = [];
    value = 'Global Search';
    lineItems = [];
    sneakersItems = [];
    categoryValue;
    tableSpinner = true;
    isTableLoading = true;

    handleCategoryChangeAction(event) {
        this.isTableLoading = true;

        this.category = event.detail.name;
        switch (event.detail.name) {

            case 'Sneakers'  : {

                this.comboboxLabel = 'Sneakers';
                this.displaySneakers = true;

                this.displayHoodies = false;
                this.displayCostumes = false;

                this.sneakersItems = JSON.stringify(this.goodLineItems);

                this.getLineItemsByCategory(event.detail.name);

                break;
            }
            case 'Hoodies': {
                this.isTableLoading = true;
                this.comboboxLabel = 'Hoodies';
                this.displayHoodies = true;
                this.displaySneakers = false;
                this.displayCostumes = false;

                this.getLineItemsByCategory(event.detail.name);

                break;
            }
            case 'Costumes' : {
                this.isTableLoading = true;
                this.comboboxLabel = 'Costumes';
                this.displayCostumes = true;
                this.displayHoodies = false;
                this.displaySneakers = false;

                this.getLineItemsByCategory(event.detail.name);

                break;
            }
            default:
                this.displaySneakers = true;
                break;
        }
        this.isTableLoading = false;
    }

    getLineItemsByCategory(categoryValue) {
        getGoodLineItemWrapperObjectsByCategory(({
            category: categoryValue
        }))
            .then(result => {
                this.isTableLoading = true;
                this.goodLineItems = result;
                console.log('this.goodLineItems: ', this.goodLineItems);
                console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
            })
            .catch(error => {
                this.isTableLoading = true;
                console.log(error);
                console.log('error getting goodLineItems');
                this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
            }).finally(
            () => {
                this.isTableLoading = false;
            })
    }

    get options() {
        return [
            {label: 'Global Search', value: 'Global Search'},
            {label: 'Search in Category', value: 'Search in Category'},
            {label: 'Search in SubCategory', value: 'Search in SubCategory'}
        ];
    }

    handleChangeRadioSearchOptions(event) {
        this.selectedOption = event.detail.value;
        console.log('Option selected with value: ' + this.selectedOption);
    }

    handleChangeSearchText(event) {

        this.isTableLoading = true;

        switch (this.selectedOption) {

            case 'Global Search'  : {

                this.globalSearchText = event.target.value;

                fetchGoodLineItemsInGlobalSearch(({searchText: this.globalSearchText}))
                    .then(result => {

                        this.goodLineItems = result;
                    })
                    .catch(error => {
                        console.log(error);
                        this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
                        console.log('Error fetching GoodLineItems', result.error);
                    }).finally(
                    () => {
                        this.isTableLoading = false;
                    })
            }
                console.log('global');
                break;
            case
            'Search in Category': {
                this.categorySearchText = event.target.value;

                fetchGoodLineItemsInCategory(({searchText: this.categorySearchText, category: this.category}))
                    .then(result => {

                        this.goodLineItems = result;
                    })
                    .catch(error => {
                        console.log(error);
                        this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
                        console.log('Error fetching GoodLineItems', result.error);
                    }).finally(
                    () => {
                        this.isTableLoading = false;
                    })
                console.log('in Category');
                break;
            }
            case
            'Search in SubCategory': {
                this.subCategorySearchText = event.target.value;

                fetchGoodLineItemsInSubCategory(({
                    searchText: this.subCategorySearchText,
                    subCategory: this.subCategory
                }))
                    .then(result => {

                        this.goodLineItems = result;
                    })
                    .catch(error => {
                        console.log(error);
                        this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
                    }).finally(
                    () => {
                        this.isTableLoading = false;
                    })
                console.log('in SubCategory');
                break;
            }
            default:
                this
                    .globalSearchText = event.target.value;

                this.isTableLoading = false;
                break;
        }

    }

    connectedCallback() {
        this.isTableLoading = true;

        fetchGoodLineItems()
            .then(result => {

                this.goodLineItems = result;

            })
            .catch(error => {
                console.log(error);
                console.log('error getting GoodLineItems');
                this.genericShowToast('Error getting GoodLineItems', error.body.message, 'error');
            });

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

        this.isTableLoading = false;
    }


    handleRowSelection(event) {
        this.isTableLoading = true;

        switch (event.detail.config.action) {
            case 'selectAllRows':
                for (let i = 0; i < event.detail.selectedRows.length; i++) {
                    this.selectedItems.push(event.detail.selectedRows[i].id);
                    this.preselectedRows.push(event.detail.selectedRows[i].id);
                }
                break;

            case 'deselectAllRows':
                this.selectedItems = [];
                this.preselectedRows = [];
                break;

            case 'rowSelect':
                this.selectedItems.push(event.detail.config.value);
                this.preselectedRows.push(event.detail.config.value);

                break;

            case 'rowDeselect':
                this.preselectedRows = this.preselectedRows.filter(e => e !== event.detail.config.value);
                this.selectedItems = this.selectedItems.filter(e => e !== event.detail.config.value);

                break;

            default:
                break;
        }
        this.isTableLoading = false;
    }

    handleSubCategoryChange(event) {
        this.isTableLoading = true;
        this.subCategory = event.detail.name;
        getGoodLineItemWrapperObjectsBySubCategory(({
            subCategory: event.detail.name
        }))
            .then(result => {
                this.goodLineItems = result;
                this.displayedGoodLineItemsIds = [];
                for (let i = 0; i < this.selectedItems.length; i++) {
                    this.displayedGoodLineItemsIds.push(this.selectedItems[i].id)
                }
            })
            .catch(error => {
                console.log(error);
                console.log('error getting goodLineItems');
                this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
            }).finally(
            () => {
                this.isTableLoading = false;
            })
    }


    displayViewGoodLineItemInBase() {
        this.isLoading = true;
        if (this.selectedItems.length === 0) {

            this.genericShowToast('Error', 'Please select at least one Good', 'error');
            this.isLoading = false;
        } else {
            for (let i = 0; i < this.selectedItems.length; i++) {
                this.item = this.goodLineItems.find(x => x.id === this.selectedItems[i]);
                this.lineItems.push(this.item);
            }

            this.dispatchEvent(new CustomEvent('switchtoviewgoodlineitem', {
                detail: {
                    'componentToDisplay': 'ViewGoodLineItem',
                    'goodLineItemId': this.goodLineItemId,
                    'lineItems': this.lineItems,
                    'selectedItemsIds': this.selectedItems,
                    'cartId': this.cartId
                }
            }));
            this.isLoading = false;
        }
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    returnToNewCart() {

        this.dispatchEvent(new CustomEvent('switchtonewcart', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }
}