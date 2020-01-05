public with sharing class SimilarPropertyController {
    
    @AuraEnabled(cacheable=true)
    public static List<Property__c> getSimilarProperties (Id recordId, 
                                                           String searchCriteria,
                                                           Decimal priceRange, 
                                                           Decimal price,
                                                           Decimal beds) {
        List<Property__c> propertyList = new List<Property__c>();
        if (searchCriteria == 'Bedrooms'){
            propertyList =  [SELECT 
                            Id, Name, Beds__c, Baths__c, Price__c, 
                            Broker__c, Status__c, Thumbnail__c, Sq_Feet__c
                            FROM Property__c 
                            WHERE Id != :recordId 
                            AND Beds__c = :beds];
        } else if (searchCriteria == 'Price') {

            Decimal range;
            if (priceRange == null) {
                range = 100000;
            } else {
                range = priceRange;
            }

            propertyList =  [SELECT 
                            Id, Name, Beds__c, Baths__c, Price__c, 
                            Broker__c, Status__c, Thumbnail__c, Sq_Feet__c
                            FROM Property__c 
                            WHERE Id != :recordId 
                            AND Price__c > :price - range 
                            AND Price__c < :price + range];
        }

        return propertyList;
    }
}
