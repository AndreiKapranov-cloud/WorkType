

public with sharing class ServletJSONWrapperPlay {
    public static void play(String jSONString) {


        Map<String, Object> fatherMap = (Map<String, Object>) JSON.deserializeUntyped(jsonString);


        Map<String, Object> webAppMap = (Map<String, Object>) fatherMap.get('web-app');

        List<Object> servletMapsList = (List<Object>) webAppMap.get('servlet');

        Map<String, Object> servletMappingMap = (Map<String, Object>) webAppMap.get('servlet-mapping');

        Map<String, Object> tagLibMap = (Map<String, Object>) webAppMap.get('taglib');



        List< Map<String, Object>> modifiedServletList = new List< Map<String, Object>>();

        for (Integer i = 0; i < servletMapsList.size(); i++) {

            Map<String, Object> servletMap = (Map<String, Object>) servletMapsList[i];
            Map<String, Object> modifiedServletMap = new Map<String, Object>();

            for (String servMapKey : servletMap.keySet()) {
                Object servMapvalue = servletMap.get(servMapKey);
                modifiedServletMap.put(servMapKey.replace('-', '_'), servMapvalue);


                Map<String, Object> initParamMap = (Map<String, Object>) servletMap.get('init-param');

                if ((initParamMap != null)) {

                    Map<String, Object> modifiedInitParamMap = new Map<String, Object>();

                    for (String initParamMapKey : initParamMap.keySet()) {

                        Object initParamMapvalue = initParamMap.get(initParamMapKey);
                        modifiedInitParamMap.put(initParamMapKey.replace('-', '_').replace(':', '_'),
                                initParamMapvalue);

                        modifiedServletMap.put('init_param', modifiedInitParamMap);

                    }
                }
            }

            modifiedServletList.add(modifiedServletMap);
        }



        Map<String, Object> modifiedFatherMap = new Map<String, Object>();

        for(String fatherMapMapKey : fatherMap.keySet()) {

            Object fatherMapValue = fatherMap.get(fatherMapMapKey);
            modifiedFatherMap.put(fatherMapMapKey.replace('-', '_'), fatherMapValue);

        }


        Map<String, Object> modifiedWebAppMap = new Map<String, Object>();

        for(String webAppMapKey : webAppMap.keySet()) {

            Object servMapValue = webAppMap.get(webAppMapKey);
            modifiedWebAppMap.put(webAppMapKey.replace('-', '_'), servMapValue);

        }


        Map<String, Object> modifiedServletMappingMap = new Map<String, Object>();

         for(String servletMappingMapKey : servletMappingMap.keySet()){

             Object servletMappingMapValue = servletMappingMap.get(servletMappingMapKey);
             modifiedServletMappingMap.put(servletMappingMapKey.replace('-', '_'), servletMappingMapValue);

         }

        Map<String, Object> modifiedTagLibMap = new Map<String, Object>();

        for(String tagLibMapKey : tagLibMap.keySet()){

            Object tagLibMapValue = tagLibMap.get(tagLibMapKey);
            modifiedTagLibMap.put(tagLibMapKey.replace('-', '_'), tagLibMapValue);

        }


        modifiedWebAppMap.put('servlet',modifiedServletList);
        modifiedWebAppMap.put('servlet_mapping',modifiedServletMappingMap);
        modifiedWebAppMap.put('taglib',modifiedTagLibMap);

        modifiedFatherMap.put('web_app',modifiedWebAppMap);

        String modifiedJSON = JSON.serialize(modifiedFatherMap);


        ServletJSONWrapper servletJSONWrapper = (ServletJSONWrapper)JSON.deserialize(modifiedJSON,
                ServletJSONWrapper.class);


        System.debug(JSON.serializePretty(servletJSONWrapper,true));

//        useJSP

      //  Boolean useJSP = servletJSONWrapper.web_app.servlet[0].init_param.useJSP;
    //    System.debug('useJSP =' + useJSP);


        System.debug(servletJSONWrapper.web_app.servlet.size());
        System.debug('adminGroupId: ' + servletJSONWrapper.web_app.servlet[servletJSONWrapper.web_app.servlet.size()-1].init_param.adminGroupID);
    }
}