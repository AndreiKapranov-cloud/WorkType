public with sharing class Animal {
    public Animal() {

    }
    String name; 
    String colour;

    public void eat(){
        System.debug('Animals eat meat');
    }

    public void drink(){
        System.debug('Animals drink');
        System.debug('sdcsdc');
    }

    // List<Black>black;
    // List<White>white;
    // List<Yellow>yellow;
  
    public Animal(String name, String colour){
      this.name = name;
      this.colour = colour;
    }
    

}