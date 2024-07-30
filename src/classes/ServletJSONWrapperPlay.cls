/**
 * Created by andrey on 7/30/24.
 */

public with sharing class ServletJSONWrapperPlay {
    public static void play(String jSONString) {

//        String modifiedJSON = jsonString.replace('-','_').
//                replace('configGlossary:','configGlossary_');
//

        String modifiedJSON = jsonString.replace('web-', 'web_').
                replace('servlet-', 'servlet_').replace('taglib-', 'taglib_').
                replace('init-', 'init_').
                replace('configGlossary:','configGlossary_');


//        String modifiedJSON = jsonString.replace('b-', 'b_').
//                replace('t-', 't_').
//                replace('configGlossary:','configGlossary_');
//
//
//       .+?(?="/";")


        ServletJSONWrapper servletJSONWrapper = (ServletJSONWrapper)JSON.deserialize(modifiedJSON, ServletJSONWrapper.class);

        System.debug(JSON.serializePretty(servletJSONWrapper,true));
      //  "cacheTemplatesStore
      //       jsp
      //     "betaServer":true
       List<JSONServlet>servList = servletJSONWrapper.web_app.servlet;
       JSONServlet jSONServlet = (JSONServlet) servList[0];

       String useJSP = jSONServlet.init_param.get('useJSP');

        String cacheTemplatesStore = jSONServlet.init_param.get('cacheTemplatesStore');

        JSONServlet jSONServletCofal = servList[4];


        System.debug('useJsp = ' + useJSP);
        System.debug('betaServer = ' + servList[4].init_param.betaServer);
        System.debug('cacheTemplatesStore = ' + cacheTemplatesStore);
        System.debug(servletJSONWrapper.web_app.servlet[4].servlet_name);


    }
}