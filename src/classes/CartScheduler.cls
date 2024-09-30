

public with sharing class CartScheduler {

    public static void scheduleCartStatusChange() {

        String jobName = 'ScheduleCartStatusChange';
        String cronExp = '0 0 0 * * ?'; // Cron expression for daily at midnight

        System.schedule(jobName, cronExp, new CartStatusChangeScheduler());

    }

    @TestVisible
    private static void scheduleRandomActualDeliveryDate() {

        String jobName = 'scheduleRandomActualDeliveryDate';
        String cronExp = '0 0 0 * * ?'; // Cron expression for daily at midnight

        System.schedule(jobName, cronExp, new RandomActualDeliveryDateScheduler());
    }


    public static void abortScheduleCartStatusChangeJob() {

        List<AsyncApexJob> asyncApexJobs = [
                SELECT Id, CronTriggerId
                FROM AsyncApexJob
                WHERE ApexClass.Name = :'CartStatusChangeScheduler' AND Status = 'Queued'
        ];

        for (AsyncApexJob asyncApexJob : asyncApexJobs) {
            System.abortJob(asyncApexJob.CronTriggerId);
        }
    }
}