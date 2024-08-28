/**
 * Created by andrey on 8/20/24.
 */
import {LightningElement, track, wire} from 'lwc';

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
    goodLineItemId;
    columns = columns;
    item;
    searchText = '';
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
    @track isTableLoading;
    @track selectedOption;
    value = 'Global Search';


    handleCategoryChangeAction(event) {
        this.isLoading = true;
        this.category = event.detail.name;
        switch (event.detail.name) {

            case 'Sneakers'  : {
                this.isLoading = true;
                this.comboboxLabel = 'Sneakers';
                this.displaySneakers = true;
                this.displayHoodies = false;
                this.displayCostumes = false;

                getGoodLineItemWrapperObjectsByCategory(({
                    category: event.detail.name
                }))
                    .then(result => {
                        this.goodLineItems = result;
                        console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
                    })
                    .catch(error => {
                        console.log(error);
                        console.log('error getting goodLineItems');
                        this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
                    })

                this.isLoading = false;
                break;
            }
            case 'Hoodies': {
                this.isLoading = true;
                this.comboboxLabel = 'Hoodies';
                this.displayHoodies = true;
                this.displaySneakers = false;
                this.displayCostumes = false;

                getGoodLineItemWrapperObjectsByCategory(({
                    category: event.detail.name
                }))
                    .then(result => {
                        this.goodLineItems = result;
                        console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
                    })
                    .catch(error => {
                        console.log(error);
                        console.log('error getting goodLineItems');
                        this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
                    })

                this.isLoading = false;
                break;
            }
            case 'Costumes' : {
                this.isLoading = true;
                this.comboboxLabel = 'Costumes';
                this.displayCostumes = true;
                this.displayHoodies = false;
                this.displaySneakers = false;

                getGoodLineItemWrapperObjectsByCategory(({
                    category: event.detail.name
                }))
                    .then(result => {
                        this.goodLineItems = result;
                        console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
                    })
                    .catch(error => {
                        console.log(error);
                        console.log('error getting goodLineItems');
                        this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
                    })

                this.isLoading = false;
                break;
            }
            default:
                this.displaySneakers = true;
                this.isLoading = false;
                break;
        }
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

        event.target.isLoading = true;

        switch (this.selectedOption) {

            case 'Global Search'  : {

                this.globalSearchText = event.target.value;
                console.log('global');
                break;
            }
            case 'Search in Category': {
                this.categorySearchText = event.target.value;
                console.log('in Category');

                break;
            }
            case 'Search in SubCategory' : {
                this.subCategorySearchText = event.target.value;
                console.log('in SubCategory');
                break;
            }
            default:
                this.globalSearchText = event.target.value;
                break;
        }

        event.target.isLoading = false;
    }

    @wire(fetchGoodLineItems, {searchText: '$globalSearchText'})
    wiredGoodLineItems(result) {
        this.isLoading = true;
        if (result.data) {
            console.log('result  : ' + JSON.stringify(result));
            console.log('result.data :' + JSON.stringify(result.data));
            this.goodLineItems = result.data;
        } else if (result.error) {
            this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
            console.log('Error fetching GoodLineItems', result.error);
        }
        this.isLoading = false;
    }

    @wire(fetchGoodLineItemsInCategory, {searchText: '$categorySearchText', category: '$category'})
    wiredGoodLineItemsByCategory(result) {
        this.isLoading = true;
        if (result.data) {
            console.log('hello from category')
            /*  console.log('result   : ' + JSON.stringify(result));
              console.log('result.data :' + JSON.stringify(result.data));*/
            this.goodLineItems = result.data;
        } else if (result.error) {
            this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
            console.log('Error fetching GoodLineItems', result.error);
        }
        this.isLoading = false;
    }

    @wire(fetchGoodLineItemsInSubCategory, {searchText: '$subCategorySearchText', subCategory: '$subCategory'})
    wiredGoodLineItemsBySubcategory(result) {
        this.isLoading = true;
        if (result.data) {
            console.log('result  : ' + JSON.stringify(result));
            console.log('result.data :' + JSON.stringify(result.data));
            this.goodLineItems = result.data;
        } else if (result.error) {
            this.genericShowToast('Error fetching GoodLineItems', result.error.body.message, 'error');
            console.log('Error fetching GoodLineItems', result.error);
        }
        this.isLoading = false;
    }

    connectedCallback() {
        this.isLoading = true;
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


    handleRowSelection(event) {
        console.log(JSON.stringify(this.options));
        switch (event.detail.config.action) {
            case 'selectAllRows':
                for (let i = 0; i < event.detail.selectedRows.length; i++) {
                    this.selectedItems.push(event.detail.selectedRows[i].id);
                }
                console.log(JSON.stringify(this.selectedItems));
                break;

            case 'deselectAllRows':
                this.selectedItems = [];
                break;

            case 'rowSelect':
                this.selectedItems.push(event.detail.config.value);
                console.log(JSON.stringify(this.selectedItems));
                break;

            case 'rowDeselect':
                this.selectedItems = this.selectedItems.filter(function (e) {
                    return e !== event.detail.config.value;
                });
                console.log(JSON.stringify(this.selectedItems));
                break;

            default:
                break;
        }
        console.log(event.detail.config.action);
    }

    handleSubCategoryChange(event) {
        this.isLoading = true;
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
                console.log('this.goodLineItems: ', JSON.stringify(this.goodLineItems));
            })
            .catch(error => {
                console.log(error);
                console.log('error getting goodLineItems');
                this.genericShowToast('Error getting goodLineItems', error.body.message, 'error');
            }).finally(
            () => {
                this.isLoading = false;
            }
        )
    }


    displayViewGoodLineItemInBase() {
        this.isLoading = true;
        if (this.selectedItems.length === 0) {

            this.genericShowToast('Error', 'Please select at least one Good', 'error');
            this.isLoading = false;
        } else {

            for (let i = 0; i < this.selectedItems.length; i++) {
                this.selectedItemsIds.push(this.selectedItems[i])
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

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart'
            }
        }));
    }
}