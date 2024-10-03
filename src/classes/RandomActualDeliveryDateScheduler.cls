
public with sharing class RandomActualDeliveryDateScheduler implements Schedulable {

    public void execute(SchedulableContext sC) {

        try {
            List <EShopOrder__c> orders = [
                    SELECT EstimatedDeliveryDate__c, ActualDeliveryDate__c
                    FROM EShopOrder__c
                    WHERE Done__c = FALSE
            ];
            System.debug('orders before : ' + orders);
            for (EShopOrder__c order : orders) {

                order.ActualDeliveryDate__c = order.EstimatedDeliveryDate__c.addDays(generateRandomFromRange(0,3));
            }

            System.debug('orders after : ' + orders);
            update orders;
        } catch (Exception e) {
            System.debug('Error occurred while deleting opportunities ' + e.getMessage());
        }
    }

    public static Integer generateRandomFromRange(Integer startNum, Integer endNum) {
        Integer returnValue;
        //Logic- first we will generate random boolean value which will decide if we want to
        //add the random number from startNum or will subtract random number from endNum
        Integer randomNumber = Integer.valueOf((Math.random() * 10));
        Boolean addSubFlag = Math.mod(randomNumber, 2) == 0 ? true : false;

        Integer diffInRange = endNum - startNum;
        //Now find random number staring from 0 to diffInRange
        Integer randomNum = Math.mod(Math.roundToLong(Math.random() * diffInRange + 1).intValue(), diffInRange);
        //If addSubFlag is true, we will add random number generated between 0 and diffInRange from start number
        //else we will subtract random number from end number
        if (addSubFlag) {
            if (diffInRange > 1) {
                returnValue = startNum + randomNum;
            } else {
                returnValue = startNum;
            }
        } else {
            if (diffInRange > 1) {
                returnValue = endNum - randomNum;
            } else {
                returnValue = endNum;
            }
        }
        return returnValue;
    }
}
