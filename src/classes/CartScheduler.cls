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

        List<AsyncApexJob> asyncApexJobs = [
                SELECT Id, CronTriggerId
                FROM AsyncApexJob
                WHERE ApexClass.Name = :'ScheduledCartStatusChange' AND Status = 'Queued'
        ];

        for (AsyncApexJob asyncApexJob : asyncApexJobs) {
            System.abortJob(asyncApexJob.CronTriggerId);
        }
    }
}