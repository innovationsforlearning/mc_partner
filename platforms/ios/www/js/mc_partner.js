/*
 *
 *
 * partnerstation.js
 *
 */
 var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;



 var watchID=0;
 var login_html = "";
 var game_html = "";
 var review_html = "";
 var report_html = "";

 var login_template = $("#login_template").html();
 var gameboard_template = $("#gameboard_template").html();
 var review_template = $("#review_template").html();
 var report_template = $("#report_template").html();

 if (is_chrome) {
  var audio_template = "" + '<div id="audio_template" class="template">' + '<audio id="help_audio" autoplay>' + '<source src="snd/_type_/_id_.mp3" type="audio/mpeg">' + '</audio>' + '</div>';

} else {
    // android audio plugin path to local files broken?
    //var audio_template="/android_asset/www/snd/_type_/_id_.mp3";
    var audio_template = "snd/_type_/_id_.mp3";
  }

  var card_reader_name = ["#card_reader1.student_name_box .student_name_label","#card_reader2.student_name_box .student_name_label"];
  var stimHTMLStage1 = "<div class='stage' id='stage1'><div id='letter'></div></div>";
  var stimHTMLStage2 = "<div class='stage' id='stage2'><span id='onset'></span><span id='word'></span></div>";
  var stimHTMLStage3 = "<div class='stage' id='stage3'><div id='word'></div></div>";

  //var stimHTMLStage3Feedback = "<div id='stage3Incorrect'><div id='onset'></div><div id='rime'></div></div>";
  var stimHTMLStage3Feedback = "<span id='onset'></span><span id='rime'></span>";
  var stimHTMLStage3FeedbackWord = "<span id='word'></span>";

  var stimReveal = "<div id='reveal'><span class='reveal_word' id='stim0'>Word0</span><span class='reveal_word' id='stim1'>Word1</span><span class='reveal_word' id='stim2'>Word2</span><span class='reveal_word' id='stim3'>Word3</span></div>"

  var stimStage1 = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
  var stimStage2 = "bat,cat,dad,fat,get,hat,jet,kid,let,met,net,pet,rat,sat,tap,vat,wet,yet,zap,at,egg,in,on,up";
  var stimStage3Sight = "a,and,ball,be,blue,by,do,for,funny,green,has,he," + "house,is,like,little,me,no,play,said,school,see,she,the,they,to," + "toy,we,why";
  var stimStage3OR = "cat,hat,bat,cap,lap,nap,map,mad,sad,bad,ham,jam," + "yam,man,tan,ran,hid,lid,did,kid,him,rim,fin,tin,win,dip,lip,sip," + "sit,fit,kit,rod,nod,top,hop,pop,mom,son,ton,won,got,hot,lot,mud," + "run,bun,sun,pup,but,cut,hut,nut,bed,fed,led,hem,hen,ten,men,pep," + "get,let,pet,yet,jet";

  function psAlert(message, callback){

    if(typeof callback === "undefined"){
      callback = function() {
          $( this ).dialog( "close" );
        }
    }

    $("#dialog_text").text(message);
  $(function() {
    $( "#dialog-message" ).dialog({
      title: "Student Login",
      modal: true,
      appendTo: "#container",
      close: callback,
      buttons: {
        Ok: callback
      }
    });
  });
  }

  var hideKeyboard = function() {
      document.activeElement.blur();
      $("username").blur();
       $("pwd").blur();
  };
  

  var accelerometer = {
    watchID: null,
    start: function(success, error, options){
      accelerometer.watchID = navigator.accelerometer.watchAcceleration( success, error, options);
    },
    stop: function () {
      if(accelerometer.watchID){
        navigator.accelerometer.clearWatch(accelerometer.watchID);
        accelerometer.watchID=null;
      }
    }
  }

// colors
var    COLORS= {
      RED: "#ff6057",
      GREEN: "#27c93f",
      YELLOW: "#ffbd2e",
      BLUE: "#2757FF",
      RED_PARTNER: "#ff6057",
      BLUE_PARTNER: "#2757FF",
      NEUTRAL: "#CCC"
    };
var PARTNER_COLOR = [COLORS.RED_PARTNER, COLORS.BLUE_PARTNER];
var BOARD_COLOR = [COLORS.RED,COLORS.GREEN,COLORS.YELLOW,COLORS.BLUE];


// audio prompts
p_ON_VERTICAL_STARTUP = "ON_VERTICAL_STARTUP"; //  Please place the iPad flat in front of you to begin.
p_ON_STARTUP  = "ON_STARTUP"; //  Welcome to MC Partner. Is this the first time you have played? Tap the green Yes or the red No
p_ON_INTRO  = "ON_INTRO"; //  This game will help you learn with your partner. One of you will be the red partner and one will be the blue partner. You decide!
p_RED_PICK_UP_IPAD  = "RED_PICK_UP_IPAD"; //  Red partner now pick up the iPad and hold it so you can see my face but your partner can't.
p_BLUE_PICK_UP_IPAD = "BLUE_PICK_UP_IPAD"; //  Blue partner now pick up the iPad and hold it so you can see my face but your partner can't.
p_READ_THE_WORD = "READ_THE_WORD"; //  Great! Now read the word you see out loud so your partner can hear it. When you have read the word, place the iPad flat in front of you again.
p_PUT_DOWN_THE_IPAD = "PUT_DOWN_THE_IPAD"; //  When you have read the word, place the iPad flat in front of you again.
p_RED_SELECT_STIMULUS = "RED_SELECT_STIMULUS"; //  Red partner now find the word your partner read to you and tap it with your finger.
p_BLUE_SELECT_STIMULUS  = "BLUE_SELECT_STIMULUS"; //  Blue partner now find the word your partner read to you and tap it with your finger.
p_CORRECT_STIMULUS  = "CORRECT_STIMULUS"; //  The right answer was [ANSWER]
p_INCORRECT_SELECTION = "INCORRECT_SELECTION"; //  The word you chose was [ANSWER]
p_CORRECT_SELECTION = "CORRECT_SELECTION"; //  Great! The right answer was [ANSWER]
p_PICK_UP_IPAD = [p_RED_PICK_UP_IPAD, p_BLUE_PICK_UP_IPAD];
p_SELECT_STIMULUS = [p_RED_SELECT_STIMULUS, p_BLUE_SELECT_STIMULUS];

// PROMPT_DELAY: delay before helpful prompts
PROMPT_DELAY = 0;
PROMPT_DELAY_INC = 1000;
MAX_PROMPT_DELAY = 5000;
PROMPT_REPEAT_DELAY = 10000;


function prompt(id, onSuccess, onError, onStatus) {

  this.media = null;
  this.timeoutID = null;
  this.repeatID= null;
  promptScope = this;



  this.start = function(pre_delay,post_delay){

    if(is_chrome){
      if(onSuccess)
        onSuccess();
      return
    };

    var src = "snd/prompt/_id_.mp3".replace("_id_", id);

    this.media = new Media(src, onSuccess, onError, onStatus);

    this.pre_delay = pre_delay;
    this.post_delay = post_delay;
    if (is_chrome) {
      if(onSuccess){onSuccess();}
      
    } else {
      if(pre_delay){

        this.timeoutID = setTimeout(function (){
          promptScope.media.play();
          if(promptScope.post_delay){
            promptScope.repeatID = setInterval(function () { promptScope.media.play();}, promptScope.post_delay);
          }
        }, pre_delay);
      }else{

        this.media.play();
        if(this.post_delay){
          this.repeatID = setInterval(function () { promptScope.media.play();}, promptScope.post_delay);
        }
      }
    }
  }

  this.stop = function(callback, delay){

    if(is_chrome){
      if(callback)
        callback();
      return;
    };

    if(this.media){
      this.media.stop();
    }
    if(this.pre_delay){
        clearTimeout(this.timeoutID);
        this.pre_delay = null;
    }
    if(this.post_delay){
      clearInterval(this.repeatID);
      this.post_delay = null;
    }
    if(callback){
      setTimeout(callback, delay);
    }
  }
}

    var app = {

    // turnCount: wait for each partner to have a turn before incrementing PROMPT_DELAY
    turnCount: 0,

    /* maintain the state of the game */
    state: {
      current: 1,
      WAIT_FOR_DEVICE_VERTICAL: 1,
      WAIT_FOR_DEVICE_FLAT: 2,
      WAIT_FOR_ANSWER: 3
    },


    /* watchID: holds the id of the accelerometer service */
    watchID: null,

    teacher: {
      username: "",
      password: "",
      id: ""
    },

    student_data: [{
      studentName: "Stage 1 Student",
      readingstage: "1",
      studentid: "stage1",
      partnerscore: "10"
    }, {
      studentName: "Lion",
      readingstage: "3",
      studentid: "lion",
      partnerscore: "0"
    }, {
      studentName: "Tiger",
      readingstage: "3",
      studentid: "tiger",
      partnerscore: "0"
    }],

    cardReader: [],
    cardListener: {},
    readerTurn: 0,
    partnerStationScores:[],
    scoreUpdates: {},

    /////////////////////////////////////////////
    //
    //  studentLogin Constructor
    //
    /////////////////////////////////////////////

    initialize: function () {
        
        this.initLogin(false);
        this.initTeacherLogin();
        this.initLocalScores();

        if(localStorage.teacherID){
          this.getStudentList(localStorage.teacherID, false);
        }



      },
      initTeacherLogin: function () {

        if(localStorage.username){
          this.teacher.username = localStorage.getItem("username");
          this.teacher.password = localStorage.getItem("password");
          this.teacher.id = localStorage.getItem("teacherID");
          $("#username").text(this.teacher.username);
          $("#pwd").text(this.teacher.username);
        }


      },
      initLocalScores: function () {
        if(localStorage.student_data){
          this.student_data = JSON.parse(localStorage.student_data);
        }
        if(localStorage.scoreUpdates){
          this.scoreUpdates = JSON.parse(localStorage.scoreUpdates);
        }
      },
      updateLocalScores: function () {
        localStorage.student_data = JSON.stringify(this.student_data);
        localStorage.scoreUpdates = JSON.stringify(this.scoreUpdates);
      },
      clearScoreUpdates: function () {
        this.scoreUpdates = {};
        localStorage.scoreUpdates = JSON.stringify(this.scoreUpdates);
      },


      /*
      ** updatePartnerStationScore: function (students, reportError)
      **
      ** students: array of updated student records to send to server
      ** reportError: true to report errors to the user. false to fail silently to allow offline app use
      **/

      updatePartnerStationScore: function (reportError){
        //
        // if reportError give user dialog
        // else fail silently so system can be used when not connected to wifi
        //
        if(!localStorage.teacherID){
          app.initLogin(true);
          return;
        }

        // QA URL
        // var ajaxurl = "http://162.242.172.156/omslb/ifltcservice/partnerstationupdate";
        // LIVE URL
        var ajaxurl = "http://apps.innovationsforlearning.org/oms/ifltcservice/partnerstationupdate";
        var students = app.preparePartnerStationScoreUpdate();
        if(students.length===0){
              console.log("No students to update. Initializing Login Screen");
              app.initLogin(true);
              return;
        }

        var cdata = JSON.stringify(
          {
            "StudentsData": students 
          });

        if(reportError){

          function onSuccess(data, status){
             if(data==="SUCCESS"){
              // have to add the score updates back into the downloaded data before clearing the updates
                app.addScoreUpdates();
                app.updateLocalScores();
               }else{
                psAlert("Error updating student scores.")
              }
              console.log(data + " " + status);
              app.initLogin(true);
          }

         function onError(xhr, ajaxOptions, thrownError) {
              psAlert("Please check your network");
              app.initLogin(true);
            }
        }else{

          function onSuccess(data, status){
            if(data==="SUCCESS"){
              // have to add the score updates back into the downloaded data before clearing the updates
                app.addScoreUpdates();
                app.updateLocalScores();
              }
            console.log(data + " " + status);
            app.initLogin(true);
          }
           function onError(xhr, ajaxOptions, thrownError) {
              psAlert("Please check your network");
              app.initLogin(true);
          }
        }

        $.ajax({
          url: ajaxurl,
          crossDomain: true,
          data: cdata,
          type: 'POST',
          contentType: "application/x-www-form-urlencoded",
          dataType: "text",
          success: onSuccess,
          error: onError
        });


      },
      /*
      ** preparePartnerStationScoreUpdate: function()
      **
      ** add the accumulated score updates to the most recent downloaded scores to prepare for uploading updates
      */
      preparePartnerStationScoreUpdate: function(){

        var students=[];
        var currentScore={};

        if(app.teacher.id){


          for(var i=0;i< app.student_data.length;i++){
            currentScore[app.student_data[i].studentid] = app.student_data[i].partnerscore;
          }

          for( var studentID in this.scoreUpdates){
            var score = Number(currentScore[studentID]) + Number(this.scoreUpdates[studentID]);
            students.push({studentid: studentID, partnerscore: score })
          }
        }
        return students;
      },
      /*
      ** addScoreUpdates: function(){
      **
      ** add the score updates to the last downloaded data
      ** then clear the updates. 
      */
      addScoreUpdates: function(){
          for( var id in this.scoreUpdates){
            for(var i=0;i< app.student_data.length;i++){
              if(id===app.student_data[i].studentid){
                var score = Number(app.student_data[i].partnerscore) + Number(this.scoreUpdates[id]);
                app.student_data[i].partnerscore=score;
                break;
              }
            }
          }
          app.clearScoreUpdates();

      },
      /*
      ** getStudentList: function (teacherID, reportError)
      **
      ** teacherID: previously validated user ID for classes teacher
      ** reportError: true to report errors to the user. false to fail silently to allow offline app use
      ** 
      ** Each time class names and scores are successfully retreived from the server
      **  store it in localStorage for offline use
      **  attempt to upload any pending score updates
      */
      getStudentList: function (teacherID, reportError){

        if(!teacherID){
          app.clearScoreUpdates();
          app.initLogin();
          return;
        }
        // QA URL
        // var ajaxurl = "http://162.242.172.156/omslb/ifltcservice/studentlist";
        var ajaxurl = "http://apps.innovationsforlearning.org/oms/ifltcservice/studentlist";
        var cdata = JSON.stringify({"teacherid": teacherID});

        if(reportError){
          function onSuccess(data, status){
            if(typeof(data)==="object"){
              app.student_data=data.StudentsData;
              localStorage.student_data = JSON.stringify(data.StudentsData);
              app.populateMenus();
              app.updatePartnerStationScore(false);
            }else{
              app.initLogin();
              psAlert(data);
            }
          }

          function onError(xhr, ajaxOptions, thrownError) {
            app.initLogin();
            psAlert(data);
          }

        }else{

          function onSuccess(data, status){
            if(typeof(data)==="object"){
              app.student_data=data.StudentsData;
              localStorage.student_data = JSON.stringify(data.StudentsData);
              app.populateMenus();
              app.updatePartnerStationScore(false);
            }else{
              app.initLogin();
            }
          }

          function onError(xhr, ajaxOptions, thrownError) {
            app.initLogin();
          }
        }

        $.ajax({
          url: ajaxurl,
          crossDomain: true,
          data: cdata,
          type: 'POST',
          contentType: "application/x-www-form-urlencoded",
          dataType: "json",
          success: onSuccess,
          error: onError
        });


      },
      authenticateUser: function (username, password){

        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        var cdata = JSON.stringify({"login": {"username": username, "password": password}});
        
        // QA URL
        // var ajaxurl = "http://162.242.172.156/omslb/ifltcservice/Teachercenterloginvalid";
        // LIVE URL
        var ajaxurl = "http://apps.innovationsforlearning.org/oms/ifltcservice/Teachercenterloginvalid"
        //var ajaxurl = "http://apps.innovationsforlearning.org/oms/ifltcservice/Teachercenterloginvalidate";
        $.ajax({
          url: ajaxurl,
          crossDomain: true,
          data: cdata,
          type: 'POST',
          contentType: "application/x-www-form-urlencoded",
          dataType: "json",
          success: function (data, status) {
            // status: "success"
            // data: {"login_response":{"status":"success","message":"Authentication Successfull.","teacherid":"12186"}} 
            // status: "success"
            // data: {"login_response":{"status":"failure","message":"Invalid Username/Password.","teacherid":"NILL"}} 
            if(data.login_response.status==="success"){
              app.teacher.id = data.login_response.teacherid;
              localStorage.setItem("teacherID", data.login_response.teacherid);
              psAlert("Sync successful.", function () {
                $( this ).dialog( "close" );
                app.getStudentList(app.teacher.id, true);
              });
              /* do not hide login, instead use as sync interface
              $("#login").hide();
              */
              /* move call to getStudentList to Dialog callback to prevent dialog from being cleared by update chain.
              app.getStudentList(app.teacher.id, true);
              */
              /*
              setTimeout(
               function () {
                   $("#login").hide();
               }, 5000);
              */
            }else{
              psAlert("Your username and/or password were not recognized. Please try again.");
            }     
          },
          error: function (xhr, ajaxOptions, thrownError) {
            psAlert("Please check your network.");
          }
        });
      },
    // initialize login elements
    initLogin: function (hideLogin) {

      $("#container").html(login_template);

      this.cardReader = [];
      this.cardListener = {};
      this.readerTurn = 0;



        //
        //! 1 Student sees list of users to be designated as Card Reader
        //
        this.populateMenus();
        /*
        this.populateMenu("#card_reader1_select");
        //
        //! 2 More than one Card Reader can log into the app
        //
        this.populateMenu("#card_reader2_select");
        //
        //! 3 Student sees list of users to be designated Card Listener
        //
        this.populateMenu("#card_listener_select");
        */
        $("#go_button").click(function () {

            // validate reader selections
            // must be a listener and at least one reader
            // no selection may equal a different selection
            var validated = app.validateUsers();
            if (validated.success) {
              app.initGame(validated);
            }

          });

        // Teacher Login
        $("#login").submit(function () {
            { 
              // hide the keyboard so it doesn't conflict with the dialog display
              hideKeyboard();
              app.authenticateUser($("#username").val(), $("#pwd").val());
              // wait until the keyboard is hidden before calling authentication
                           
              return false;
            }
          });


        if(localStorage.teacherID){


          $("#username").val(localStorage.username);
          $("#pwd").val(localStorage.password);


          // fail silently to allow
          // move to initialize: this.getStudentList(localStorage.teacherID, false);
        }


        // POC BEGIN
        // POCremove show login page:
        // $("#header").show();
        // POC add immediate game page
        app.initGame(app.POC_validateUsers());
        // POC END



      },

    // load student names into menus
    populateMenus: function () {
      var menus=
      [
        "#card_reader1_select",
        "#card_reader2_select",
        "#card_listener_select"
      ];
      // first clear any existing options

      for(m=0;m<menus.length;m++){
        menu = menus[m];
        $("#container " + menu).html($("#login_template "+menu).html());
        var option = '';
        for (var i = 0; i < this.student_data.length; i++) {
          option += "<option value='" + i + "'>" + this.student_data[i].studentName + '</option>';
        }
        $("#container " + menu).append(option);
      }
    },

    validateUsers: function () {

      var listener = $("#card_listener_select option:selected");
      var reader1 = $("#card_reader1_select option:selected");
      var reader2 = $("#card_reader2_select option:selected");
      var li = listener.index();
      var r1i = reader1.index();
      var r2i = reader2.index();
      var retVal = {
        success: false
      };

      if (li === 0) {
        psAlert("Please select a card listener.");
        return retVal;
      } else if ((r1i === 0) && (r2i === 0)) {
        psAlert("Please select a card reader.");
        return retVal;
      } else if ((li === r1i) || (li === r2i) || (r1i === r2i)) {
        psAlert("Please be sure nobody is chosen more than once.");
        return retVal;
      }

      var reader = [];

      if (r1i !== 0) reader.push(reader1.val());
      if (r2i !== 0) reader.push(reader2.val());

      return {
        success: true,
        listener: listener.val(),
        reader: reader
      };
    },

    // POC replace validateUsers
    POC_validateUsers: function () {

      return {
        success: true,
        listener: 0,
        reader: [1,2]
      };
    },


    /////////////////////////////////////////////
    //
    //  initialize gameboard
    //
    /////////////////////////////////////////////

    initGame: function (users) {


      $("#container").html(gameboard_template);

      this.cardListener.user = this.student_data[users.listener];

      this.cardReader.push(new reader(this.student_data[users.reader[0]]));

        // initialize onscreen labels
        $("#card_listener.student_name_box div.student_name_label").text(this.student_data[users.listener].studentName);
        $(card_reader_name[0]).text(this.student_data[users.reader[0]].studentName);

        // if more than one reader selected, initialize the 2nd
        if (users.reader.length > 1) {
          this.cardReader.push(new reader(this.student_data[users.reader[1]]));
          $(card_reader_name[1]).text(this.student_data[users.reader[1]].studentName);
        } else {
          $("#card_reader2.student_name_box").hide();
        }

/* POC remove Yes, No, Review buttons

        //
        //! 4. A Listener can mark an answer as correct
        //
        $("#yes_button").click(function () {

          app.cardReader[app.readerTurn].doCorrect();
          app.nextReader();

        });
        //
        //! 5. A Listener can mark a Reader response as incorrect
        //
        $("#no_button").click(function () {

          app.cardReader[app.readerTurn].doIncorrect();

        });
        //
        //! 6. The Teacher can click on the Teacher Review button
        //
        $("#review_button").click(function () {

          app.initReview();

        });
*/
        //
        //! . A Listener can get clarification on a stimuli
        //
        $("#help_button").click(function () {

          app.cardReader[app.readerTurn].doHelp();

        });

        $(card_reader_name[this.readerTurn]).toggleClass("student_highlight");
        pv_ON_INTRO = new prompt(p_ON_INTRO, function () {app.nextReader();}, null);
        pv_ON_INTRO.start();
        
        // app.nextReader();

      },

      incorrect_words: function (target, source){
        var words = source.slice();
        var a = words.indexOf(target);
        words.splice(a,1); //remove target word
        var incorrect = [];
        for(i=0;i<3;i++){
          var j=Math.floor(Math.random()*words.length);
          incorrect.push(words[j]);
          words.splice(j,1)
        }
        return incorrect;
      },

      nextReader: function () {
        $("#face").css("visibility","visible");


        $("#stimulus").css("background", PARTNER_COLOR[app.readerTurn]);
        $(card_reader_name[this.readerTurn]).toggleClass("student_highlight");
        this.readerTurn = (this.readerTurn + 1) % this.cardReader.length;
        $(card_reader_name[this.readerTurn]).toggleClass("student_highlight");
        $("#score_label").text(this.cardReader[this.readerTurn].score);
        app.state.current = app.state.WAIT_FOR_DEVICE_VERTICAL;
        app.cardReader[app.readerTurn].nextStimulus();
        pv_PICK_UP_IPAD = new prompt(p_PICK_UP_IPAD[(app.readerTurn+1)%2], null, null);
        pv_PICK_UP_IPAD.start(PROMPT_DELAY, PROMPT_REPEAT_DELAY);

        // this.cardReader[this.readerTurn].nextStimulus();
      }

/* POC remove teacsherReview
      ,

    /////////////////////////////////////////////
    //
    //  initialize review
    //
    /////////////////////////////////////////////
    initReview: function () {
      // moved to init reader in TeacherReview so it can be called from report
      // $("#container").html(review_template);
      //
      this.review = new teacherReview(this.cardListener, this.cardReader);
    }
*/

  };
//
//! 7. The app links Reading Stage to each Card Reader
//

function reader(user) {
  this.user = user;
    var stage = Math.min(2, user.readingstage - 1); // -1 assuming system is 1 based; min since only 3 stages are supported


    this.score = 0;
    this.correctStimuli = [];
    this.revealStimuli = [];
    this.feedbackQueue=[];

    var stimuli = [];

    var doStage = [{
      init: initStage1,
      display: displayStage1,
      reveal: revealStage1,
      incorrect: incorrectStage1,
      stim: getStimStage1
    }, {
      init: initStage2,
      display: displayStage2,
      reveal: revealStage2,
      incorrect: incorrectStage2,
      stim: getStimStage2
    }, {
      init: initStage3,
      display: displayStage3,
      reveal: revealStage3,
      feedback: feedbackStage3,
      stim: getStimStage3
    }];
    //
    // Public Methods
    //



    this.nextStimulus = function () {
      doStage[stage].display();
      if (is_chrome){
        $("#stimulus #word").css({opacity:1.0});
       $("div.stage").one("click",function (event){
          pv_SELECT_STIMULUS = new prompt(p_SELECT_STIMULUS[app.readerTurn], null, null);
          doStage[stage].reveal();
          //app.cardReader[app.readerTurn].reveal();
        });
      }else{
        var options={frequency: 500 };
        if(accelerometer.watchID === null){
          accelerometer.start(
          function (acceleration) {
            /* success */
            if(accelerometer.watchID){
              switch (app.state.current) {
                case app.state.WAIT_FOR_DEVICE_VERTICAL:
                if( Math.abs(acceleration.x) > 9){
                  $("#stimulus #word").css({opacity:1.0});


                  app.state.current = app.state.WAIT_FOR_DEVICE_FLAT;
                  // let media system complete the stop before beginning the next audio
                  pv_PICK_UP_IPAD.stop(function () {
                    pv_READ_THE_WORD = new prompt(p_READ_THE_WORD, null, null);
                    pv_READ_THE_WORD.start(PROMPT_DELAY, PROMPT_REPEAT_DELAY);                    
                  }, 50);

                }
                break;
                case app.state.WAIT_FOR_DEVICE_FLAT:
                if( Math.abs(acceleration.z) > 4){
                  app.state.current = app.state.WAIT_FOR_ANSWER;
                  accelerometer.stop();
                  doStage[stage].reveal();

                  pv_READ_THE_WORD.stop(function () {
                    pv_SELECT_STIMULUS = new prompt(p_SELECT_STIMULUS[app.readerTurn], null, null);
                    pv_SELECT_STIMULUS.start(PROMPT_DELAY, PROMPT_REPEAT_DELAY);

                  }, 500);

                  
                }
                break;
                default:
                break;
              }
            }
          }, 
          function () {
            /*failure */
          },
          options
          );
        }       
      }
    };

    this.isStimCorrect = function (stim){
      return stim === doStage[stage].stim();
    }

    this.doCorrect = function () {
         this.feedbackQueue=[{stimulus: stimuli[0], selector: ".correct"}];
       //
        //! 4.1 A Listener can mark an answer as correct
        //
        //
        // The Card Reader orally says the letter/word. 
        // If the Card Listerner thinks it's correct he hits the correct button, 
        // and the score is incremented once, and the item is not tested again in that round.
        //
        $("#score_label").text(++this.score);
        // add this stim to the correct list to review
        // IFF it is not already on the list
        var correctStimulus = stimuli.shift();
        //alert("doCorrect:stimulus:"+stimulus.word)
        //alert("doCorrect:correctStimuli.indexOf(stimulus):"+this.correctStimuli.indexOf(stimulus))
        if(this.correctStimuli.indexOf(correctStimulus)===-1){
          this.correctStimuli.push(correctStimulus);
          //alert("doCorrect:correctStimuli:"+this.correctStimuli.join())
        }
        //
        //! 9. The app will randomly pick words to retest (if all items are correct)
        //
        //
        // If all items are correctly identified before the end of the activity, 
        // then the app will randomly pick words to retest.
        //
        if (stimuli.length === 0) {
          initStimuli();
        }
        //this.fadeIncorrect(doStage[stage].feedback);
        pv_SELECT_STIMULUS.stop();
        this.fadeIncorrect(function () {
          pv_CORRECT_SELECTION=new prompt(p_CORRECT_SELECTION,
            function () {
              doStage[stage].feedback();
            });
          pv_CORRECT_SELECTION.start();
        });
      };

      this.doIncorrect = function (incorrectStimulus) {
        //
        //! 5.1 A Listener can mark a Reader response as incorrect
        //
        // If the Card Listerner hits the wrong button, 
        // the item goes back at the end of the queue, 
        // no point is incremented, and there is oral feedback from the app
        // (as applicable, the letter name is sounded, 
        // the letter sound is sounded, the sight word is sounded, 
        // and if its a phonogram the word is visually segmented between onset and rime, 
        // each part is highlighted and sounded, and then the word is put back together 
        // and sounded as a whole word.)
        //
        

        this.feedbackQueue=[];
  
        this.feedbackQueue.push({stimulus:stimuli[0], selector:".correct"});
        this.feedbackQueue.push({stimulus:{word:incorrectStimulus, type:stimuli[0].type}, selector:".selected"});
        //this.fadeIncorrect(doStage[stage].feedback);
        pv_SELECT_STIMULUS.stop();

        this.fadeIncorrect(function () {
          pv_CORRECT_STIMULUS = new prompt(p_CORRECT_STIMULUS, 
            function () {
              doStage[stage].feedback();
            });
          pv_CORRECT_STIMULUS.start();
        });


      };
      this.finishFeedback = function () {
        stimuli.push(stimuli.shift());
      };

    //
    //! 6.1 A Listener can get clarification on a stimuli
    //
    //
    // If the card listener is not sure of a letter/word, 
    // he can hit the help button and hear the letter/word.
    //
    this.doHelp = function () {
      doStimSound(doStage[stage].stim());
    };


    this.fadeIncorrect = function (callback){

      var a=$("#reveal .incorrect");
      a.animate({
        "opacity": "0"
      },"slow");

      setTimeout(
         function () {
             callback();
         }, 1000);
    }


    //
    // Private Methods
    //
    //
    //! 8. The app presents the appropriate stimulus based on Student Reading Stage
    //

    function initStimuli() {
      doStage[stage].init();
    }

    function randomize(stimuli) {
      var i, j, k, l;

        // randomize stimuli
        l = stimuli.length;
        for (i = 0; i < l; i++) {
          j = Math.floor(Math.random() * l);
          k = stimuli[i];
          stimuli[i] = stimuli[j];
          stimuli[j] = k;
        }
        return stimuli;
      }

      function doStimSound(stimulus) {
        var stage_snd_type = ["name", "onset", "word"]; // path to audio by stage
        var snd_type;
        if(stage===1 && (stimulus.length>1)){
          snd_type="word"
        }else{
          snd_type=stage_snd_type[stage];
        }
        doSound(stimulus, snd_type);
      }

      function onSuccess() {
        console.log("playAudio():Audio Success");
      }

    // onError Callback 
    //
    function onError(error) {
      var es = 'code: ' + error.code + '\n' +
      'message: ' + error.message + '\n';

      console.log(es);
    }


    function doSound(stimulus, type) {
      stimulus = stimulus.toLowerCase();
      if (is_chrome) {


        var audio_html;

        audio_html = audio_template.replace("_id_", stimulus);
        audio_html = audio_html.replace("_type_", type);
        $("#audio_template").remove();
        $("#container").append(audio_html);

      } else {

        var src;
        src = audio_template.replace("_id_", stimulus);
        src = src.replace("_type_", type);
            var media = new Media(src, onSuccess, onError);
            media.play();

          }

        }


        function initStage1() {
          stimuli = randomize(stimStage1.split(","));
          
        }


        function initStage2() {
          var words=stimStage2.split(",");
          stimuli=stimStage2.split(",");;
          for(var i=0;i<words.length;i++){
            stimuli.push(words[i].charAt(0));
          }
          stimuli = randomize(stimuli);

        }

        function initStage3() {

          var sw = stimStage3Sight.split(",");
          var or = stimStage3OR.split(",");
          var stimStage3 = [];
          var i;
          for (i = 0; i < sw.length; i++) {
            var incorrect = app.incorrect_words(sw[i], sw);
            stimStage3.push({
              word: sw[i],
              incorrect: incorrect,
              type: "sw"
            });
          }
          for (i = 0; i < or.length; i++) {
            var incorrect = app.incorrect_words(or[i], or);
            stimStage3.push({
              word: or[i],
              incorrect: incorrect,
              type: "or"
            });
          }
          stimuli = randomize(stimStage3);

        }

        function displayStage1() {
          $("#stimulus").html(stimHTMLStage1);

          $("#stage1 #letter").text(stimuli[0]);

        }

        function displayStage2() {

          $("#stimulus").html(stimHTMLStage1);
          $("#stage1 #letter").text(stimuli[0]);
        }

        function displayStage3() {

          $("#stimulus").html(stimHTMLStage3);
          $("#stimulus #word").text(stimuli[0].word);
          $("#stimulus #word").css({opacity:0});

        }

        function revealStage1() {
          $("#stimulus").html(stimHTMLStage3);
          //$("#stimulus #word").text(stimuli[0].word);
        }

        function revealStage2() {
          $("#stimulus").html(stimHTMLStage3);
          //$("#stimulus #word").text(stimuli[0].word);
        }

        function revealStage3() {
          $("#face").css("visibility","hidden");

          var reader =app.cardReader[app.readerTurn];
          reader.revealStimuli=[];
          for(var i=0;i<3;i++){
            reader.revealStimuli.push(stimuli[0].incorrect[i])
          }
          var correctIndex=Math.floor(Math.random()*3);
          reader.revealStimuli.splice(correctIndex,0,stimuli[0].word);
          var stim=stimReveal.slice();
          for(var i=0;i<4;i++){
            stim = stim.replace("Word"+i, reader.revealStimuli[i]);            
          }
          $("#stimulus").html(stim);
          $("#stimulus").css("background", COLORS.NEUTRAL);

          var colors=BOARD_COLOR.slice();

          colors= randomize(colors);
          for(var i=0; i<4; i++){
            $("#stim"+i).css({"background": colors[i]});
          }

          for(var r=0;r<4;r++){

            var stimClass;
            if(r===correctIndex){
              stimClass='correct';
              $("#stim"+r).one("click",function (){
                $("span").off("#reveal");
                app.cardReader[app.readerTurn].doCorrect();
                //app.nextReader();
              });

            }else{
              stimClass='incorrect';
              $("#stim"+r).one("click",function (){
                $("span").off("#reveal");
                 $(this).removeClass('incorrect');
                $(this).addClass('selected');
                var i = parseInt($(this).attr("id").slice(-1));
                var incorrectStim = app.cardReader[app.readerTurn].revealStimuli[i];
                app.cardReader[app.readerTurn].doIncorrect(incorrectStim);
              });

            }
            $("#reveal #stim"+r).addClass(stimClass);
 

          }
          $("#reveal").animate({
            "opacity": 1,
          }, "slow");
        }

        function getStimStage1() {
          return stimuli[0];
        }

        function getStimStage2() {
          return stimuli[0];
        }

        function getStimStage3() {
          return stimuli[0].word;
        }

        function incorrectStage1() {
          doStimSound(doStage[stage].stim());
          app.cardReader[app.readerTurn].feedbackEnd();
        }

        function incorrectStage2() {
          doStimSound(doStage[stage].stim());
          app.cardReader[app.readerTurn].feedbackEnd();
        }

        
        function feedbackStage3() {
          var reader = app.cardReader[app.readerTurn];
          var callback = reader.feedbackEnd;
        // if the word is an Onset Rime Word
        //  if (stimuli[0].type === "or") {
          if (reader.feedbackQueue[0].stimulus.type === "or") {
            callback = reader.feedbackStage3onset;
          }
          // highlight and say the word and then continue to split the word
          //var stim = doStage[stage].stim();
          var stim = reader.feedbackQueue[0].stimulus.word;
          var selector = reader.feedbackQueue[0].selector;
          doStimSound(stim);
          var size = (stim.length < 5 ?'200px' :'150px');

          var color;
          if(selector === ".correct"){
            color="#00FF00";
           }else{
            color = "#FF0000";
          }
          $(selector).css("color",color);

          $("#reveal "+ selector).animate({
            "font-size": size,
            "bottom": "-10px"
          }, "slow", function () {
             setTimeout(

             function () {
                 callback();
             }, 1000);
          });

      };

    //
    // make callbacks public 
    //
    this.feedbackStage3onset = function () {
      var reader = app.cardReader[app.readerTurn];

      // split the onset and rime, highlight the onset and pronounce it
      var selector = "#reveal "+ reader.feedbackQueue[0].selector;
      var stimulus = reader.feedbackQueue[0].stimulus;
      var onsetSelector = selector+ " #onset"; 
      $(selector).html(stimHTMLStage3Feedback);
      var or = splitOR(stimulus.word);
      $(onsetSelector).text(or.onset);
      $(selector+ " #rime").text(or.rime);

      // animate and sound out
      doSound(or.onset, "onset");
      $(selector).css("color","#000000");
      $(onsetSelector).css("color","#FFFF00");

      $(onsetSelector).animate({
        /*
        "font-size": "200px",
            "bottom": "-10px"
        */
          "left": "1%"
        }, "fast", function () {

           setTimeout(
            function () {
               app.cardReader[app.readerTurn].feedbackStage3rime();
           }, 1000);
        });



      };

      this.feedbackStage3rime = function () {
      var reader = app.cardReader[app.readerTurn];

      var selector = "#reveal "+ reader.feedbackQueue[0].selector;
      var stimulus = reader.feedbackQueue[0].stimulus;

      var onsetSelector = selector+ " #onset"; 
      var rimeSelector = selector+ " #rime"; 
       $(selector).html(stimHTMLStage3Feedback);
        var or = splitOR(stimulus.word);
        $(onsetSelector).text(or.onset);
        $(rimeSelector).text(or.rime);

        // animate and sound out
        doSound(or.rime, "rime");
        $(onsetSelector).css("color","black");
        $(rimeSelector).css("color","#FFFF00");


        $(rimeSelector).animate({
/*
          "font-size": "200px",
            "bottom": "-10px"
*/
          "right": "1%"
        }, "fast", function () {

             setTimeout(

             function () {
                 app.cardReader[app.readerTurn].feedbackStage3word();
             }, 1000);
         });
      };

      this.feedbackStage3word = function () {
        var reader = app.cardReader[app.readerTurn];

        // restore the word html
        var selector = "#reveal "+ reader.feedbackQueue[0].selector;
        var stimulus = reader.feedbackQueue[0].stimulus;

        var wordSelector = selector + " #word";
        $(selector).html(stimHTMLStage3FeedbackWord);
        $(wordSelector).text(stimulus.word);
        // animate and sound out
        //doStimSound(doStage[stage].stim());
        doStimSound(stimulus.word);
        $(selector).animate({
          "font-size": "200px",
            "bottom": "-10px"
        }, "slow", app.cardReader[app.readerTurn].feedbackEnd);
      };


      this.feedbackEnd = function () {
        var reader = app.cardReader[app.readerTurn];

        reader.finishFeedback();

        // use closure to pass scope
        if(reader.feedbackQueue.length>1)
        {
          reader.feedbackQueue.shift();

          //pv_CORRECT_STIMULUS.stop();
          pv_INCORRECT_SELECTION = new prompt(p_INCORRECT_SELECTION,
            function () {doStage[stage].feedback();});

          // allow audio system to settle before starting the next audio
          setTimeout(function () { pv_INCORRECT_SELECTION.start(); }, 1000);         

        }else{
          // if both partners have had a turn
          if((++app.turnCount >1) && (PROMPT_DELAY < MAX_PROMPT_DELAY) ){
            PROMPT_DELAY += PROMPT_DELAY_INC;
          }
          setTimeout(function () {
            $("#reveal").animate({"opacity": 0}, "slow", function () {
              app.nextReader();
            });
          }, 500);
        }
      };

      function splitOR(word) {
        return {
          onset: word.charAt(0),
          rime: word.slice(1)
        };
      }


    //
    // Initialization
    //

    initStimuli();
    //this.nextStimulus();

  }

/* POC remove teacherReview
  function teacherReview(cardListener, cardReader) {
    this.cardListener = cardListener;
    this.cardReader = cardReader;
    this.currentReader = 0;
    this.ppfr = 0;
    this.reviewState=[["unset","unset"],["unset","unset"]]; // [reader][reviewState]

    // maintain the new score within the review process
    
     this.reviewScore= {listener:0, listenerUpdate:0, reader:[0,0], readerUpdate:[0,0]};

     var s;
      for(i=0;i<cardReader.length;i++){
        s = parseInt(cardReader[i].user.partnerscore);
        if(!isNaN(s)){
          this.reviewScore.reader[i]=s;
        }else{
          cardReader[i].user.partnerscore="0";
        }
      }
      
      s = parseInt(cardListener.user.partnerscore);
      if(!isNaN(s)){
        this.reviewScore.listener=s;
      }else{
        cardListener.user.partnerscore="0";
      }

    this.initReader = function (index) {


      this.currentReader = index;
      var cr = cardReader[index];
     
      this.ppfr = cr.score;

      $("#reader.review_label").text(cr.user.studentName + ":");
      $("#listener.review_label").text(cardListener.user.studentName + ":");

      $("#current_score_reader").text(cr.user.partnerscore);
      $("#current_score_listener").text(cardListener.user.partnerscore);

      $("#ppfr_reader").text(cr.score);
      $("#ppfr_listener").text(cr.score);

      $("#new_score_listener").text(this.reviewScore.listener);
      $("#new_score_reader").text(this.reviewScore.reader[this.currentReader]);  

      for(var i=0;i<2;i++){
        for(var j=0;j<2;j++){
          this.setButtonState(i,j,"unset");
        }
      }

      for(i=0;i<2;i++){
        switch(this.reviewState[index][i]){
          case "yes":
          this.setButtonState(i,1,"set");
          break;
          case "no":
          this.setButtonState(i,0,"set");
          break;
        }
      }




        // stage1 and stage2 stimuli are strings stage3 are objects
        var words = [];
        //alert("initReader:cr.user.readingstage:"+cr.user.readingstage)
        switch (cr.user.readingstage) {
          case "1":
          case "2":
          words = cr.correctStimuli;
          break;
          default:
          for (i = 0; i < cr.correctStimuli.length; i++) {
            words.push(cr.correctStimuli[i].word);
          }
          //alert("initReader:words:"+words.join())
          break;
        }

        $("#container #correct_word_list textarea").text(words.sort().join("\n"));
        //alert("initReader:#container #correct_word_list textarea:"+$("#container #correct_word_list textarea").text())

      };

      function initButtons() {

        
        $("#yes_1").click(function () {
          app.review.doReview(0, 1);
        });
        $("#yes_2").click(function () {
          app.review.doReview(1, 1);
        });
        $("#no_1").click(function () {
          app.review.doReview(0, 0);
        });
        $("#no_2").click(function () {
          app.review.doReview(1, 0);
        });
        $("#review_exit_button").click(function () {
          app.review.updateUserScore(); // continues through app.initLogin(true) through callback
          // app.initLogin(true);
        });
        $("#review_report_button").click(function () {
          teacherReport.initialize();
        });
      }

      function initReaderMenu(cardReader) {


        var option = '';
        for (var i = 0; i < cardReader.length; i++) {
          option += "<option value='" + i + "'>" + cardReader[i].user.studentName + '</option>';
        }
        $("#card_reader_select").append(option);

        $("#card_reader_select").change(function () {
            { // create closure to teacherReview object
              app.review.initReader($("#card_reader_select").val());
            }
          });
      }

      this.updateUserScore = function(){

        var reviewUser = [
          { studentid: this.cardListener.user.studentid,  partnerscore: this.reviewScore.listener}
        ];
        for(var i=0;i< this.cardReader.length;i++){
          reviewUser.push({ studentid: this.cardReader[i].user.studentid, partnerscore: this.reviewScore.reader[i]});
        }

        if(app.teacher.id){
          // add listener's delta score to the student's existing record if any
          if(typeof app.scoreUpdates[this.cardListener.user.studentid] === "undefined"){
            app.scoreUpdates[this.cardListener.user.studentid]=0;
          }
          app.scoreUpdates[this.cardListener.user.studentid]+=this.reviewScore.listenerUpdate;

          // add readers' delta score to the students' existing record if any
          for(var i=0;i< this.cardReader.length;i++){
            var id=this.cardReader[i].user.studentid;
            if(typeof app.scoreUpdates[id] === "undefined"){
              app.scoreUpdates[id]=0;
            }
            app.scoreUpdates[id]+=this.reviewScore.readerUpdate[i];
          }
        }

        // update the local copy of the total score
        for(var rUser=0;rUser<reviewUser.length;rUser++){
          for (var i = 0; i < app.student_data.length; i++) {
            if (app.student_data[i].studentid === reviewUser[rUser].studentid.toString()){
              app.student_data[i].partnerscore = reviewUser[rUser].partnerscore.toString();
              break;
            }
          }
        }

        // copy the results of the review into localStorage
        app.updateLocalScores();

        //
        // start the update chain by attempting the download the freshest data
        // the chain will either succeed with the download and following upload of new scores
        // and then clear any pending updates
        // or will fail leaving pending updates for the next successfull update chain
        // in either case the start screen will be displayed
        //

        // app.updatePartnerStationScore(reviewUser, false);
        app.getStudentList(app.teacher.id, false);
      }

      this.setButtonState = function(revNum, correct, action){
        var revDig = ["_1", "_2"];
        var corStr = ["no", "yes"];
        var colStr = ["review_box_incorrect", "review_box_correct"];
        var defStr = "review_box";

        var sel = "#" + corStr[correct] + revDig[revNum] + "." + defStr;
        switch(action){
          case "toggle":
            var sel = "#" + corStr[correct] + revDig[revNum] + "." + defStr;
            $(sel).toggleClass(colStr[correct]);
            break;
          case "unset":
            var sel = "#" + corStr[correct] + revDig[revNum];
            $(sel).removeClass(colStr[0]);
            $(sel).removeClass(colStr[1]);
            break;
          case "set":
            var sel = "#" + corStr[correct] + revDig[revNum];
            $(sel).removeClass(colStr[0]);
            $(sel).removeClass(colStr[1]);
            $(sel).addClass(colStr[correct]);
            break;
        }
      }

      this.setReviewStatus = function (revNum, correct, state, sign, toggle){
       
          var pts = this.cardReader[this.currentReader].score;
          
          var newPts = 0;


          this.reviewState[this.currentReader][revNum] = state;


          if(toggle){

            var iCorrect = (correct===0?1:0);
            
            this.setButtonState(revNum,iCorrect,"toggle");
          }

          if (revNum === 0) {
              newPts = Math.ceil(pts / 2);
          } else {
              newPts = Math.floor(pts / 2);
          }
          newPts *= sign;

          this.reviewScore.reader[this.currentReader] += newPts;
          this.reviewScore.readerUpdate[this.currentReader] += newPts;
          
          this.reviewScore.listener += newPts;
          this.reviewScore.listenerUpdate += newPts;
          
          $("#new_score_listener").text(this.reviewScore.listener);
          $("#new_score_reader").text(this.reviewScore.reader[this.currentReader]);
      }

      this.doReview = function (revNum, correct) {

          var state = this.reviewState[this.currentReader][revNum];

          this.setButtonState(revNum,correct,"toggle");
          
          if (correct === 0) {
            switch (state) {
              case "no":
                this.reviewState[this.currentReader][revNum] = "unset";
                break;
              case "unset":
                this.reviewState[this.currentReader][revNum] = "no";
                break;
              case "yes":
                this.setReviewStatus(revNum, correct, "no", -1, true);
              
                break;
            }
          } else if (correct === 1) {
              switch (state) {
                case "no":
                this.setButtonState(revNum,0,"toggle");
                case  "unset":
                  this.setReviewStatus(revNum, correct, "yes", 1, false);
                  
                  break;
                  case "yes":
                  this.setReviewStatus(revNum, correct, "unset", -1, false);
                  
                  break;
              }
          }
      };

      // restoreReview to be called from Report to restore the view and state of the review 

      this.restoreReview = function (){
        $("#container").html(review_template);
        this.initReader(this.currentReader);
        initReaderMenu(this.cardReader);
        initButtons();

      }

      this.restoreReview();

    }

     var teacherReport= {

      sortedData:[],
      sortDirection: {name: true, score: true},

      compareNameUp: function (a,b) {
        if (a.name < b.name)
           return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      },

      compareScoreUp: function (a,b) {
        return a.score-b.score;
      },

      compareNameDown: function (a,b) {
        if (a.name > b.name)
           return -1;
        if (a.name < b.name)
          return 1;
        return 0;
      },

      compareScoreDown: function (a,b) {
        return b.score-a.score;
      },

      initialize: function (){
        this.sortedData=[];
        this.sortDirection= {name: true, score: true};

        $("#container").html(report_template);
        var score="0";
        var id="0";
        for (var i = 0; i < app.student_data.length; i++) {
          id = app.student_data[i].studentid;
          score = app.student_data[i].partnerscore;
          // replace the score of the listener with the provisional review score
          if(app.review.cardListener.user.studentid === id){
            score= app.review.reviewScore.listener;
          }else{
            for(var j=0;j<app.review.cardReader.length;j++){
              if(app.review.cardReader[j].user.studentid === id){
                score=app.review.reviewScore.reader[j];
                break;
              }
            }
          }

          // replace the score of the reader(s) with the provisional review score
        

          this.sortedData.push({
            name: app.student_data[i].studentName, 
            score: Number(score)
          });
        }

        this.display(this.compareScore);

        $("#student_name").click(function () {
          sort = (teacherReport.sortDirection.name? teacherReport.compareNameUp: teacherReport.compareNameDown);
          teacherReport.sortDirection.name = !teacherReport.sortDirection.name;
          teacherReport.display(sort);
        });

        $("#student_score").click(function () {
          sort = (teacherReport.sortDirection.score? teacherReport.compareScoreUp: teacherReport.compareScoreDown);
          teacherReport.sortDirection.score = !teacherReport.sortDirection.score;
          teacherReport.display(sort);
        });

        $("#report_exit_button").click(function () {
          app.review.updateUserScore(); // continues to app.initLogin(true) on callback
          // app.initLogin(true);
        });

        $("#report_scoring_button").click(function () {
          app.review.restoreReview();
          $("#card_reader_select").val(app.review.currentReader)
        });

      },

      display: function (sort) {
        var template = '<tr><td class="name_col">/name</td><td class="score_col">/score</td></tr>';


        this.sortedData= this.sortedData.sort(sort);
        $("#report_tab tbody").empty();
        for (var i = 0; i < this.sortedData.length; i++) {
          var tmp = template.replace("/name", this.sortedData[i].name);
          tmp = tmp.replace("/score", this.sortedData[i].score);
          tmp = tmp.replace("null","--")
          $("#report_tab tbody").append(tmp);
        }

      }

    }
*/