/**
 * Created by andrey on 8/20/24.
 */
import getPicklistValuesUsingApex
    from '@salesforce/apex/EShopBaseComponentController.getPicklistValuesUsingApex';
import getGoodRecordTypeIdsUsingApex
    from '@salesforce/apex/EShopBaseComponentController.getGoodRecordTypeIdsUsingApex';

import getSubCategoryPickListValuesByRecordTypeId
    from '@salesforce/apex/EShopBaseComponentController.getSubCategoryPickListValuesByRecordTypeId';

import {LightningElement, wire} from 'lwc';
import {genericShowToast} from "c/utils";
import GOOD_OBJECT from "@salesforce/schema/Good__c";
import {getObjectInfo} from "lightning/uiObjectInfoApi";

export default class SelectGood extends LightningElement {


    isLoading = true;
    genericShowToast = genericShowToast.bind(this);
    buyers = [];
    buyerId;
    estimatedDeliveryDate;
    pickupPointAddress;
    getPicklistValuesParamsJsonObject = {};
    status;
    cartJsonObject = {};
    cartObject;
    cartRecordId;
    categoryPicklistValues = [];
    subCategoryPicklistValues = [];
    displaySneakers = false;
    displayCostumes = false;
    displayHoodies = false;
    recordTypeIdsMap;
    costumesRecordTypeId;
    hoodiesRecordTypeId;
    sneakersRecordTypeId;
    sneackersSubCategoryPicklistValues = [];

    getValueByKey(object, row) {
        return object[row];
    }

    handleCategoryChangeAction(event) {

        switch (event.detail.name) {

            case 'Sneakers'  : {

                this.displaySneakers = true;
                this.displayHoodies = false;
                this.displayCostumes = false;

                getSubCategoryPickListValuesByRecordTypeId(({
                    recordTypeId: this.sneakersRecordTypeId
                }))
                    .then(result => {
                        this.sneackersSubCategoryPicklistValues = result;
                        console.log('this.sneackersSubCategoryPicklistValues: ', this.sneackersSubCategoryPicklistValues);

                    })
                    .catch(error => {
                        console.log(error);
                        console.log('error getting CategoryPickListValues');
                        this.genericShowToast('Error getting CategoryPickListValues', error.body.message, 'error');
                    });

                break;
            }
            case 'Hoodies': {
                this.displayHoodies = true;
                this.displaySneakers = false;
                this.displayCostumes = false;
                break;
            }
            case 'Costumes' : {
                this.displayCostumes = true;
                this.displayHoodies = false;
                this.displaySneakers = false;
                break;
            }
            default:
                this.displaySneakers = true;
                break;
        }
    }

    displayNewEshopOrderInBase() {

        this.dispatchEvent(new CustomEvent('whichcomponenttodisplay', {
            detail: {
                'componentToDisplay': 'NewCart',
            }
        }));
    }

   /* @wire(getObjectInfo, {objectApiName: GOOD_OBJECT})
    objectInfo;*/


    connectedCallback() {

        getGoodRecordTypeIdsUsingApex()
            .then(result => {
                this.recordTypeIdsMap = result;
                console.log('this.recordTypeIdsMap: ', this.recordTypeIdsMap);
                this.costumesRecordTypeId = this.getValueByKey(result, "Costumes");
                this.hoodiesRecordTypeId = this.getValueByKey(result, "Hoodies");
                this.sneakersRecordTypeId = this.getValueByKey(result, "Sneakers");
                console.log(this.costumesRecordTypeId);
                console.log(this.hoodiesRecordTypeId);
                console.log(this.sneakersRecordTypeId);

            })
            .catch(error => {
                console.log(error);
                console.log('error getting recordTypeIdsMap');
                this.genericShowToast('Error getting recordTypeIdsMap', error.body.message, 'error');
            });

        getPicklistValuesUsingApex(({
            fieldName: 'Category__c'
        }))
            .then(result => {
                this.categoryPicklistValues = result;
                console.log('this.picklistValues: ', this.categoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });

        getPicklistValuesUsingApex(({
            fieldName: 'SubCategory__c'
        }))
            .then(result => {
                this.subCategoryPicklistValues = result;
                console.log('this.subCategoryPicklistValues: ', this.subCategoryPicklistValues);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting QuantityUnitOfMeasure Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            });


        console.log('obj info:' + this.objectInfo);


        /*  getBuyers()
              .then(result => {
                  this.buyers = result;
                  console.log('this.buyerId: ', this.buyerId);
                  console.log('this.buyers: ', this.buyers);
              })
              .catch(error => {
                  console.log(error);
                  console.log('error getting Buyers');
                  this.genericShowToast('error getting Buyers', error.body.message, 'error');
              });


          this.getPicklistValuesParamsJsonObject.sObjectType = 'Cart__c';
          this.getPicklistValuesParamsJsonObject.field = 'Status__c';
          this.getPicklistValuesParamsJSONString = JSON.stringify(this.getPicklistValuesParamsJsonObject);

          console.log(this.getPicklistValuesParamsJSONString);

          getPicklistValuesUsingApex(({
              getPicklistValuesParamsJSONString: this.getPicklistValuesParamsJSONString
          }))
              .then(result => {

                  this.statusPicklistValues = result;
                  this.status = this.getValueByKey(result[0], "value");
                  console.log('this.status: ', this.status);
                  console.log('this.picklistValues: ', this.statusPicklistValues);
              })
              .catch(error => {
                  console.log(error);
                  console.log('error getting Status Picklist values');
                  this.genericShowToast('Error getting PickList values', error.body.message, 'error');
              })*/

        this.isLoading = false;
    }

    handleCategoryChange(e) {
        this.category = e.target.value;
    }

    handleSubCategoryChange(e) {
        this.subCategory = e.target.value;
    }

    handlePickupPointAddressChange(e) {
        this.pickupPointAddress = e.target.value;
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    createCartApexMethod() {

        /*   this.isLoading = true;
           this.cartJsonObject.buyerId = this.buyerId;
           this.cartJsonObject.estimatedDeliveryDate = this.estimatedDeliveryDate;
           this.cartJsonObject.pickupPointAddress = this.pickupPointAddress;
           this.cartJsonObject.status = this.status;

           this.paramsJSONString = JSON.stringify(this.cartJsonObject);
           console.log('paramsJSONString:' + this.paramsJSONString);

           createCartApexMethod(
               {
                   paramsJSONString: this.paramsJSONString
               })
               .then(result => {
                   console.log(result);
                   console.log('ID: ', result.Id);
                   this.cartObject = result;
                   this.cartRecordId = result.Id;

                   console.log('cartObject = ' + this.cartObject);

                   this.genericShowToast('Success!', 'Cart Record is created Successfully!', 'success');
                   this.displayNewEshopOrderInBase();
               })
               .catch(error => {
                   console.log('error createCart');
                   console.log(error);
                   this.genericShowToast('Error creating Cart.', error.body.message, 'error');
               }).finally(
               () => {
                   this.isLoading = false;
               }
           )*/
    }
}