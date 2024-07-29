public with sharing class Fish extends Animal{
    public Fish() {

    }
    override void say('Blum-blum');
  
   public override void eat(){
    System.debug('Fishes eat shit');
   }
   
   public String species;
   public String colour;

   public void drink(){
    System.debug('Fishes drink water');
   }
   public Fish(String species, String colour){
    this.species = species;
    this colour = colour;
   }
   List <RiverFish> riverFishes;
   List <SeaFish> seaFishes;
   
}