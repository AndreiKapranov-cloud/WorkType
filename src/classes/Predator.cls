public with sharing class Predator extends Animal{
    public Predator() {

    }
    public String species;
    public String colour;

    override void say( System.debug('Rrrrr'););
  
    public override void eat(){
     System.debug('Predators eat each other');
    }
    
    public void drink(){
     System.debug('Predators drink blood');
    }
   public Predator(String species, String colour){
    this.species = species;
    this.colour = colour;
    }
    List<CatPredator> catPredators;
    List<DogPredator> dogPredators;
}
