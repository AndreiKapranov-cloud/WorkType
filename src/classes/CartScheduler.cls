/**
 * Created by andrey on 9/9/24.
 */

public with sharing class CartScheduler {

    public static void scheduleCartStatusChange() {

        String jobName = 'ScheduleCartStatusChange';
        String cronExp = '0 0 0 * * ?'; // Cron expression for daily at midnight

        System.schedule(jobName, cronExp, new ScheduledCartStatusChange());
    }


    public static void scheduleRandomActualDeliveryDate() {

        String jobName = 'scheduleRandomActualDeliveryDate';
        String cronExp = '0 0 0 * * ?'; // Cron expression for daily at midnight


        System.schedule(jobName, cronExp, new ScheduleRandomActualDeliveryDate());
    }


    public static void abortScheduleCartStatusChangeJob() {

        List<AsyncApexJob> asyncApexJobList = [
                SELECT ApexClassId, Id, CronTriggerId, JobItemsProcessed, JobType,
                        Status, NumberOfErrors, MethodName
                FROM AsyncApexJob
                WHERE ApexClass.Name = :'ScheduledCartStatusChange' AND Status = 'Queued'
        ];

        System.debug(asyncApexJobList);
        for (AsyncApexJob AsyncApexJob : asyncApexJobList) {
            System.abortJob(asyncApexJobList[0].CronTriggerId);
        }
    }
}