public with sharing class Man extends Inhabitant{
    public Man() {

    }

    String name; 
    String colour;

    public void eat(){
        System.debug('Men eat');
    }

    public void drink(){
        System.debug('Men drink');
    }

    public void workout(){
        System.debug('Men workout');
    }
    List<Black>black;
    List<White>white;
    List<Yellow>yellow;
  
    public Men(String name, String colour){
      this.name = name;
      this.colour = colour;
    }
    
}