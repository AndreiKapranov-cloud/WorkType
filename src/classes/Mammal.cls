public with sharing class Mammal {
    public Mammal() {

    }

    public String species;
    public String colour;


   public void drink(){
    System.debug('Mammals drink water');
   }
  public Mammal(String species, String colour){
    this.species = species;
    this.colour = colour;

   }
   List<ArcticMammal>arcticMammals;
   List<AustralianMammal>australianMammals;
   
}