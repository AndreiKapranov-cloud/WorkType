import {LightningElement, track, wire} from 'lwc';

import fetchGoodLineItemsInGlobalSearch
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInGlobalSearch';
import fetchGoodLineItemsInCategory
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInCategory';
import fetchGoodLineItemsInSubCategory
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItemsInSubCategory';
import fetchGoodLineItems
    from '@salesforce/apex/SelectGoodController.fetchGoodLineItems';
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
    @track goodLineItemNames = [];
    @track goodLineItems = [];
    @track selectedItemsCopyWithoutBackslashes = [];
    @track selectedOption = 'Global Search';
    @track preselectedRows = [];
    @track sneakersItems = [];
    @track goodLineItemsCopy = [];
    @track selectedItems = [];
    @track goodLineItemsDisplayedInTable = [];
    @track itemsFromSearchResult = [];
    @track goodLineItemsCopyForSearch = [];
    @track deselectedRows = [];

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
    goodLineItemId;
    columns = columns;
    item;
    globalSearchText = '';
    categorySearchText = '';
    subCategorySearchText = '';
    category;
    subCategory;
    selectedRows = [];
    supplierName;
    value = 'Global Search';
    lineItems = [];
    isTableLoading = true;
    itemFromSearch;


    connectedCallback() {
        this.isTableLoading = true;

        fetchGoodLineItems()
            .then(result => {
                this.goodLineItems = result;
                console.log('result : ' + result);
                this.goodLineItemsCopy = JSON.parse(JSON.stringify(this.goodLineItems));
                this.goodLineItemsDisplayedInTable = JSON.parse(JSON.stringify(this.goodLineItems));

                console.log('this.goodLineItemsDisplayedInTable : ' + JSON.stringify(this.goodLineItemsDisplayedInTable));
                if (!this.goodLineItems.length) {
                    this.genericShowToast('The E-Shop is Empty', 'No Goods', 'error');
                }

                console.log('this.goodLineItems :' + this.goodLineItems);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting GoodLineItems');
                this.genericShowToast('Error getting GoodLineItems', error.body.message, 'error');
            });

        getCategoryPicklistValuesUsingApex()
            .then(result => {
                this.categoryPicklistValues = result;
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });

        getSubCategoryPickListValuesForHoodiesCategory()
            .then(result => {
                this.hoodiesSubCategoryPicklistValues = result;
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
            })
            .catch(error => {
                console.log(error);
                console.log('error getting CostumesSubCategoryPicklistValues');
                this.genericShowToast('Error getting CostumesSubCategoryPicklistValues', error.body.message, 'error');
            });

        this.isTableLoading = false;
    }


    handleCategoryChangeAction(event) {
        this.isTableLoading = true;

        this.category = event.detail.name;
        switch (event.detail.name) {

            case 'Sneakers'  : {
                this.subCategory = null;
                this.displaySneakers = true;
                this.displayHoodies = false;
                this.displayCostumes = false;

                this.filterItemsByCategory(event.detail.name);

                break;
            }
            case 'Hoodies': {
                this.subCategory = null;
                this.isTableLoading = true;
                this.displayHoodies = true;
                this.displaySneakers = false;
                this.displayCostumes = false;

                this.filterItemsByCategory(event.detail.name);

                break;
            }

            case 'Costumes' : {
                this.subCategory = null;
                this.isTableLoading = true;
                this.displayCostumes = true;
                this.displayHoodies = false;
                this.displaySneakers = false;

                this.filterItemsByCategory(event.detail.name);

                break;
            }
            default:
                this.displaySneakers = true;
                break;
        }
        this.isTableLoading = false;
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

                if (this.globalSearchText === '') {
                    console.log('this.category   :' + this.category + 'this.subCategory  :' + this.subCategory);

                    this.displayCategoryOrSubCategoryItems(this.subCategory, this.category);
                } else {

                    /*   fetchGoodLineItemsInGlobalSearch
                       ({
                           searchText: this.globalSearchText
                       })*/

                    try {
                        //   this.goodLineItemsDisplayedInTable.filter(goodLineItem => goodLineItem.name = 'Hoodie');       //.contains(this.globalSearchText));
                       this.goodLineItemsCopy.filter(goodLineItem => goodLineItem.name.toString().includes(this.globalSearchText));




                        this.processSearchResult( this.goodLineItemsCopy);
                        //           this.itemsFromSearchResult = result;
                        //   this.goodLineItemsCopyForSearch = JSON.parse(JSON.stringify(this.itemsFromSearchResult));

                     /*   this.goodLineItemsDisplayedInTable = [];

                        this.itemsFromSearchResult.forEach(item => {
                            this.itemFromSearch = this.goodLineItemsCopy.filter(e => e.id === item.id);

                            this.goodLineItemsDisplayedInTable.push(this.goodLineItemsCopy.find(e => e.id === item.id));

                        });*/


                        //   this.goodLineItemsDisplayedInTable.forEach(item => this.goodLineItemNames.push(item.name));
                        //    this.goodLineItemsDisplayedInTable = this.goodLineItemsCopy.filter(goodLineItemCopy => goodLineItemCopy.name.includes(this.globalSearchText));
                        //   console.log(this.goodLineItemNames);


                        //   this.goodLineItemsDisplayedInTable.forEach(this.goodLineItemNames.push(goodLineItem.name));

                        //      this.selectedItems = this.selectedItems.filter(e => e !== this.goodLineItemsDisplayedInTable[i].id);
                    } catch (e) {
                        console.error("An error occurred" + e); //This will not be executed
                    }


                    /*   this.goodLineItemsCopy.forEach(e => {
                           if (e.id === event.detail.selectedRows[i].id) {
                               e.checked = true;
                           }*/


                    /*
                                             this.itemsFromSearchResult = result;
                                             this.goodLineItemsCopyForSearch = JSON.parse(JSON.stringify(this.itemsFromSearchResult));

                                             this.goodLineItemsDisplayedInTable = [];

                                             this.itemsFromSearchResult.forEach(item => {
                                                 this.itemFromSearch = this.goodLineItemsCopy.filter(e => e.id === item.id);

                                                 this.goodLineItemsDisplayedInTable.push(this.goodLineItemsCopy.find(e => e.id === item.id));

                                             this.itemFromSearch = this.goodLineItemsCopy.filter(e => e.id === item.id);

                                             this.goodLineItemsDisplayedInTable.push(this.goodLineItemsCopy.find(e => e.id === item.id))

                                            .then(result => {
                                                    this.processSearchResult(result);
                                                }
                                            )
                                            .catch(error => {
                                                console.log(error);
                                                this.genericShowToast('Error fetching GoodLineItems', error.body.message, 'error');
                                                console.log('Error fetching GoodLineItems', error);
                                            })*/
                }
                console.log('global');
            }
                this.isTableLoading = false;
                break;
            case
            'Search in Category': {
                this.categorySearchText = event.target.value;

                if (this.categorySearchText === '') {

                    this.displayCategoryOrSubCategoryItems(this.subCategory, this.category);
                } else {
                    fetchGoodLineItemsInCategory({searchText: this.categorySearchText, category: this.category})
                        .then(result => {
                                this.processSearchResult(result);
                            }
                        )
                        .catch(error => {
                            console.log(error);
                            this.genericShowToast('Error fetching GoodLineItems', error.body.message, 'error');
                            console.log('Error fetching GoodLineItems', error);
                        })
                    console.log('in Category');
                }
                this.isTableLoading = false;
                break;
            }
            case
            'Search in SubCategory': {
                this.subCategorySearchText = event.target.value;

                if (this.subCategorySearchText === '') {

                    this.displayCategoryOrSubCategoryItems(this.subCategory, this.category);
                } else {
                    fetchGoodLineItemsInSubCategory(({
                        searchText: this.subCategorySearchText,
                        subCategory: this.subCategory
                    }))
                        .then(result => {
                                this.processSearchResult(result);

                            }
                        )
                        .catch(error => {
                            console.log(error);
                            this.genericShowToast('Error fetching GoodLineItems', error.body.message, 'error');
                        })
                    console.log('in SubCategory');
                }
                this.isTableLoading = false;
                break;
            }
            default:
                this.globalSearchText = event.target.value;

                this.isTableLoading = false;
                break;
        }
    }


    displayCategoryOrSubCategoryItems(subCategory, category) {
        if (subCategory) {
            this.filterItemsBySubCategory(subCategory);
        } else if (category)
            this.filterItemsByCategory(category);
    }


    processSearchResult(result) {
        this.itemsFromSearchResult = result;
        this.goodLineItemsCopyForSearch = JSON.parse(JSON.stringify(this.itemsFromSearchResult));

        this.goodLineItemsDisplayedInTable = [];

        this.itemsFromSearchResult.forEach(item => {
                this.itemFromSearch = this.goodLineItemsCopy.filter(e => e.id === item.id);

                this.goodLineItemsDisplayedInTable.push(this.goodLineItemsCopy.find(e => e.id === item.id));
            }
        );
        this.populatePreselectedRows();
    }


    handleRowSelection(event) {
        this.isTableLoading = true;

        switch (event.detail.config.action) {
            case 'selectAllRows':
                for (let i = 0; i < event.detail.selectedRows.length; i++) {
                    this.selectedItems.push(event.detail.selectedRows[i].id);
                    this.preselectedRows.push(event.detail.selectedRows[i].id);

                    this.goodLineItemsCopy.forEach(e => {
                        if (e.id === event.detail.selectedRows[i].id) {
                            e.checked = true;
                        }
                    });
                }

                break;

            case 'deselectAllRows':

                this.goodLineItemsDisplayedInTable.forEach(item => item.checked = false);

                for (let i = 0; i < this.goodLineItemsDisplayedInTable.length; i++) {

                    this.preselectedRows = this.preselectedRows.filter(e => e !== this.goodLineItemsDisplayedInTable[i].id);
                    this.selectedItems = this.selectedItems.filter(e => e !== this.goodLineItemsDisplayedInTable[i].id);

                    this.goodLineItemsCopy.forEach(e => {

                        if (e.id === this.goodLineItemsDisplayedInTable[i].id) {

                            e.checked = false;
                        }
                    });
                }

                break;

            case 'rowSelect'
            :
                this.selectedItems.push(event.detail.config.value);
                this.preselectedRows.push(event.detail.config.value);

                this.goodLineItemsCopy.forEach(e => {

                    if (e.id === event.detail.config.value) {

                        e.checked = true;
                    }
                });

                break;

            case 'rowDeselect'
            :
                this.preselectedRows = this.preselectedRows.filter(e => e !== event.detail.config.value);
                this.selectedItems = this.selectedItems.filter(e => e !== event.detail.config.value);

                this.goodLineItemsCopy.forEach(e => {
                    if (e.id === event.detail.config.value) {
                        e.checked = false;
                    }
                });

                break;
            default:
                break;
        }

        this.isTableLoading = false;
    }


    handleSubCategoryChange(event) {
        this.isTableLoading = true;
        this.subCategory = event.detail.name;

        this.filterItemsBySubCategory(this.subCategory);

        this.isTableLoading = false;
    }


    filterItemsByCategory(category) {
        this.goodLineItemsDisplayedInTable = this.goodLineItemsCopy.filter(e => e.category === category);

        this.populatePreselectedRows();
    }


    filterItemsBySubCategory(subCategory) {
        this.goodLineItemsDisplayedInTable = this.goodLineItemsCopy.filter(e => e.subCategory === subCategory);

        this.populatePreselectedRows();
    }


    populatePreselectedRows() {
        this.preselectedRows = [];
        this.goodLineItemsDisplayedInTable.forEach(item => {
            if (item.checked === true) {
                this.preselectedRows.push(item.id);
            }
        });
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
                    'lineItems': this.lineItems,
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