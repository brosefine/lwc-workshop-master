import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import findProperties from '@salesforce/apex/SimilarPropertyController.findProperties';

const fields = ['Property__c.Name',
                'Property__c.Price__c',
                'Property__c.Beds__c',
                'Property__c.Status__c',
                'Property__c.Broker__c'];

export default class SimilarProperties extends LightningElement {
    @api recordId;
    @track props;
    @track errorMsg;
    @track property;
    @track price;
    @track beds;
    @wire(CurrentPageReference) pageRef;

    @wire(findProperties, {recordId: '$recordId', priceRange: '100000', price: '$price', beds: '$beds'})
    wiredProps(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            console.log("ERROR: ", this.errorMsg);
        } else if (value.data) {
            this.props = value.data;
        }
    }

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProperty(value) {
        if(value.data) {
            this.property = value.data;
            this.price = this.property.fields.Price__c.value;
            this.beds = this.property.fields.Beds__c.value;
        } else if (value.error) {
            console.log("ERROR: ", value.error);
        }
    }

    connectedCallback() {
        registerListener('propertyUpdated', this.refreshSelection, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    refreshSelection() {
        refreshApex(this.wiredRecords);
    }
}