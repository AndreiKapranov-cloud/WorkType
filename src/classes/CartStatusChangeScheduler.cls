/**
 * Created by andrey on 9/9/24.
 */

public with sharing class CartStatusChangeScheduler {

    public static void scheduleCartStatusChange(){

        String jobName = 'ScheduleCartStatusChange';
        String cronExp = '0 0 0 * * ?'; // Cron expression for daily at midnight

// Schedule Apex job with parameter values
        System.schedule(jobName, cronExp, new ScheduledCartStatusChange());
    }
}