
@isTest
public with sharing class InhabitantTest {

    @isTest
    public static void testParseInhabitantFromJSON(){
        final String JSON_STRING = '{\n' +
                '  "men" : {\n' +
                '    "yellow" : {\n' +
                '      "chineese" : [ "man3", "man4" ],\n' +
                '      "indians" : [ "man1", "man2" ]\n' +
                '    },\n' +
                '    "black" : {\n' +
                '      "egyptyans" : [ "Balu balu", "Japar" ],\n' +
                '      "livians" : [ "Muhak Muhak", "Eblak MacCryak" ]\n' +
                '    },\n' +
                '    "white" : {\n' +
                '      "ukrainians" : [ "Nikolay Gogol", "Taras Shevchenko" ],\n' +
                '      "belarusians" : [ "Vasil Bykau", "Uladzimir Karatkevic" ]\n' +
                '    }\n' +
                '  },\n' +
                '  "animals" : {\n' +
                '    "mammals" : {\n' +
                '      "arcticMammals" : [ "polarBear", "walrus" ],\n' +
                '      "australianMammals" : [ "duckbill", "koala" ]\n' +
                '    },\n' +
                '    "predators" : {\n' +
                '      "dogPredators" : [ "volf", "bear" ],\n' +
                '      "catPredators" : [ "tiger", "lion" ]\n' +
                '    },\n' +
                '    "fishes" : {\n' +
                '      "riverFishes" : [ "karas", "gudgeon" ],\n' +
                '      "seaFishes" : [ "vale", "sward-fish" ]\n' +
                '    }\n' +
                '  }\n' +
                '}';
        Inhabitant inhabitant = (Inhabitant)JSON.deserialize(JSON_STRING,Inhabitant.class);

        System.debug(JSON.serializePretty(inhabitant));


    }

    @isTest
    public static void testSoloduha() {

        String JSONString = '{\n' +
                '  "men" : {\n' +
                '    "yellow" : {\n' +
                '      "chineese" : [ "man3", "man4" ],\n' +
                '      "indians" : [ "man1", "man2" ]\n' +
                '    },\n' +
                '    "black" : {\n' +
                '      "egyptyans" : [ "Balu balu", "Japar" ],\n' +
                '      "livians" : [ "Muhak Muhak", "Eblak MacCryak" ]\n' +
                '    },\n' +
                '    "white" : {\n' +
                '      "ukrainians" : [ "Nikolay Gogol", "Taras Shevchenko" ],\n' +
                '      "belarusians" : [ "Vasil Bykau", "Uladzimir Karatkevic" ]\n' +
                '    }\n' +
                '  },\n' +
                '  "animals" : {\n' +
                '    "mammals" : {\n' +
                '      "arcticMammals" : [ "polarBear", "walrus" ],\n' +
                '      "australianMammals" : [ "duckbill", "koala" ]\n' +
                '    },\n' +
                '    "predators" : {\n' +
                '      "dogPredators" : [ "volf", "bear" ],\n' +
                '      "catPredators" : [ "tiger", "lion" ]\n' +
                '    },\n' +
                '    "fishes" : {\n' +
                '      "riverFishes" : [ "karas", "gudgeon" ],\n' +
                '      "seaFishes" : [ "vale", "sward-fish" ]\n' +
                '    }\n' +
                '  }\n' +
                '}';

        Inhabitant inhabitant = (Inhabitant)JSON.deserialize(JSONString,Inhabitant.class);
        String coalaInhabitant = inhabitant.animals.mammals.australianMammals[1];

        System.assertEquals(coalaInhabitant,'koala','oooo');

        inhabitant.men.yellow.chineese.add('Bruce Lee');
        inhabitant.men.yellow.chineese.add('Jakie Chan');

        String bruce = inhabitant.men.yellow.chineese[2];
        String jakie = inhabitant.men.yellow.chineese[3];



        System.assertEquals(bruce,'Bruce Lee');
        System.assertEquals(jakie,'Jakie Chan');


        inhabitant.men.white.belarusians.add('Saladuha');
        String saladuho = inhabitant.men.white.belarusians[2];

        System.assertEquals(saladuho,'Saladuha');

        System.debug(JSON.serializePretty(inhabitant));
        for(  String item : inhabitant.men.yellow.chineese) {
        System.debug(item);
}

        List<String> predators = new List<String>();
        predators.addAll( inhabitant.animals.predators.catPredators);
        predators.addAll( inhabitant.animals.predators.dogPredators);




        for (String item : predators){
            System.debug(item);
        }

    }
}