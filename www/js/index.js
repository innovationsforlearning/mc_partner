/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 // if in development skip cordova initialization/deviceready event handling
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if(is_chrome){
  //window.location.assign("partnerstation.html")
  var cordova_app = {
     // Application Constructor
    initialize: function() {
        
            app.initialize();
    }
}
}else{
var cordova_app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        cordova_app.receivedEvent('deviceready');
    },

    onResume: function() {
        cordova_app.receivedEvent('resume');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       
        console.log('Received Event: ' + id);

        
        switch(id) {
            case 'resume':
                location.reload();
            break;

            case 'deviceready':
              // if deviceready 
              // go to the app page
              //window.location.assign("partnerstation.html")
              app.initialize();
            break;
           
            default:
            break;
        }
    }
};
}
