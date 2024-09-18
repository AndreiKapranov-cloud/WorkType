/**
 * Created by andrey on 9/17/24.
 */
@RestResource(urlMapping='/Carts/*')
global with sharing class CartManager {

    @HttpPost
    global static Id createCart(String buyer, String pickupPointAddress,
            String status, Boolean done) {
        Cart__c cart = new Cart__c(
                Buyer__c = buyer,
                Pickup_Point_Address__c = pickupPointAddress,
                Status__c = status,
                Done__c = done);
        insert cart;

        return cart.Id;

    }


    private static List<Cart__c> jSONParser() {
        List<Cart__c> cartsToInsert = new List<Cart__c>();
        Integer cartCounter = 0;

        String jSONParams = '[\n' +
                '   {\n' +
                '      "buyer":"a0qdL0000007wAXQAY",\n' +
                '      "pickupPointAddress":"pppFromfffffffffP",\n' +
                '      "status":"Formed",\n' +
                '      "orders":[\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         }\n' +
                '      ]\n' +
                '   },\n' +
                '   {\n' +
                '      "buyer":"a0qdL0000007wAXQAY",\n' +
                '      "pickupPointAddress":"pppFromfffffffffP",\n' +
                '      "status":"Formed",\n' +
                '      "orders":[\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         }\n' +
                '      ]\n' +
                '   },\n' +
                '   {\n' +
                '      "buyer":"a0qdL0000007wAXQAY",\n' +
                '      "pickupPointAddress":"pppFromfffffffffP",\n' +
                '      "status":"Formed",\n' +
                '      "orders":[\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         },\n' +
                '         {\n' +
                '            "estimatedDeliveryDate":"2024-09-30",\n' +
                '            "registrationDate":"2024-09-30"\n' +
                '         }\n' +
                '      ]\n' +
                '   }\n' +
                ']';
        //    List<Map<String, Object>> carts = (List<Map<String, Object>>) JSON.deserializeUntyped(jSONParams);

        List<CartWrapper> result = (List<CartWrapper>) JSON.deserialize(jSONParams, List<CartWrapper>.class);

        for (CartWrapper cartWrapper : result) {

            Cart__c cartToInsert = new Cart__c();

            cartToInsert.Buyer__c = cartWrapper.buyer;
            cartToInsert.Pickup_Point_Address__c = cartWrapper.pickupPointAddress;
            cartToInsert.Status__c = cartWrapper.status;
            cartCounter++;

            cartsToInsert.add(cartToInsert);

            List <EshopOrderWrapper> orderWrappers = cartWrapper.orders;

            for (EshopOrderWrapper eshopOrderWrapper : orderWrappers) {

                EShopOrder__c eShopOrder = new EShopOrder__c;
                eShopOrder.EstimatedDeliveryDate__c = eshopOrderWrapper.estimatedDeliveryDate;
                eShopOrder.RegistrationDate__c = eshopOrderWrapper.registrationDate;
                eShopOrder.Cart__c = cartCounter;


            }


        }


        return cartsToInsert;
    }

}

/*
        Cart__c cartToInsert = new Cart__c();

        cartToInsert.Buyer__c = 'dacfd';

        EShopOrder__c order = new EShopOrder__c();
        order.EstimatedDeliveryDate__c = (Date) '2024-09-30';

        for (Map<String, Object> cart : carts) {
            Cart__c cartToInsert = new Cart__c();

            cartToInsert.Buyer__c = (Id) cart.get('buyer');
            cartToInsert.Pickup_Point_Address__c = (String) cart.get('pickupPointAddress');
            cartToInsert.Status__c = (String) cart.get('status');


            List<Map<String, Date>> orders = (List<Map<String, Date>>) cart.get('orders');

            for (Map<String, Date> order : orders) {

                EShopOrder__c order = new EShopOrder__c();
                order.EstimatedDeliveryDate__c = (Date) order.get('estimatedDeliveryDate');
                order.RegistrationDate__c = (Date) order.get('estimatedDeliveryDate');

            }

        }
        return cartsToInsert;
    }

}*/
/*
String jSON = '
[
        {
        "buyer": "a0qdL0000007wAXQAY",
        "pickupPointAddress": "pppFromfffffffffP",
        "status": "Formed",
        "orders": [
        {
        "estimatedDeliveryDate": "2024-09-30",
        "registrationDate": "2024-09-30"
        },
        {
        "estimatedDeliveryDate": "2024-09-30",
        "registrationDate": "2024-09-30"
        },
        {
        "estimatedDeliveryDate": "2024-09-30",
        "registrationDate": "2024-09-30"
        },
        {
        "estimatedDeliveryDate": "2024-09-30",
        "registrationDate": "2024-09-30"
        }
]
},
{
"buyer": "a0qdL0000007wAXQAY",
"pickupPointAddress": "pppFromfffffffffP",
"status": "Formed",
"orders": [
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
}
]
},
{
"buyer": "a0qdL0000007wAXQAY",
"pickupPointAddress": "pppFromfffffffffP",
"status": "Formed",
"orders": [
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
},
{
"estimatedDeliveryDate": "2024-09-30",
"registrationDate": "2024-09-30"
}
]
}
]
';
}


a_kap__W_Wid__mdt credentials = a_kap__W_Wid__mdt.getInstance('City_and_Api_Key');

String responseBody;
if (city == null){
responseBody = getResponseFromAPI(credentials.a_kap__City__c, credentials.a_kap__WeatherMapApiKey__c);
}else{
responseBody = getResponseFromAPI(city, credentials.a_kap__WeatherMapApiKey__c);
}

Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(responseBody);
a_kap__Weather_Widget_Configuration__c configRec = new a_kap__Weather_Widget_Configuration__c();
configRec = getLastSyncDetails();

String cityName = String.valueOf(responseMap.get('name'));

Map<String, Object> sysMap = (Map<String, Object>)responseMap.get('sys');
String countryName = String.valueOf(sysMap.get('country'));

Map<String, Object> mainMap = (Map<String, Object>)responseMap.get('main');
Double temperature = Double.valueOf(mainMap.get('temp'));
List<Object> weatherList = (List<Object>)responseMap.get('weather');
Map<String, Object> weatherInfo = (Map<String, Object>)weatherList[0];
String weatherDesc = String.valueOf(weatherInfo.get('description'));
String weatherIcon = String.valueOf(weatherInfo.get('icon'));

configRec.name = 'Default';
if(cityName == null && countryName == null){
configRec.City__c = credentials.a_kap__City__c;
}else{
configRec.City__c = cityName + ', ' + countryName;
}
configRec.Temperature__c = temperature;
configRec.Weather_Description__c = weatherDesc;
configRec.Icon_Name__c = weatherIcon;
configRec.API_Key__c = credentials.a_kap__WeatherMapApiKey__c;
configRec.Last_Synced_on__c = Datetime.now();

upsert configRec;

return configRec;*/
