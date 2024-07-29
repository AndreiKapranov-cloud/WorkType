@isTest
public class ControllerTest {
    
    @isTest public static void getLocationsTest(){
     LocationController lC = new LocationController();   
     List<Schema.Location>locations = LocationController.getLocations();   
    }
    @isTest public static void getProduct2sTest(){
     ProductRequiredController pRC = new ProductRequiredController();
     List<Product2>product2s = ProductRequiredController.getProduct2s();   
    }
    @isTest public static void getSkillsTest(){
     SkillController sC = new SkillController();   
     List<Skill>skills = SkillController.getSkills();   
    }
    @isTest public static void getPriorityPicklistValuesTest(){
     WorkOrderController wOC = new WorkOrderController();
     List<Map<String, String>>priorityPicklistValues = WorkOrderController.getPriorityPicklistValues();   
    }
    @isTest public static void getWorkTypesTest(){
     WorkTypeController wTC = new WorkTypeController();
     List<WorkType>workTypes = WorkTypeController.getWorkTypes();   
    }
}