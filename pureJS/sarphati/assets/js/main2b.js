/*Variable Declaration*/    
    var dragItem = document.querySelector("#item");
    var container = document.querySelector("#container");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    
    var videoplay=false;
    
    //no auto-place; see css: https://jsfiddle.net/2pha/zka4qkt2/
    var gui = new dat.GUI({ autoPlace: false });
    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);   

/*Event Listeners*/
    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

/*Start Drag*/
   //... gateway to making our drag gesture actually work... when the mousedown/touchstart events are overheard
   /*
   [Something] to call out about the position. Calculating it involves both the current position along with subtracting the values for xOffset and yOffset. Both xOffset and yOffset are initially set to 0, but that won't be the case with subsequent drag operations.
   */
    function dragStart(e) {
     //setting the initial position of our pointer
      if (e.type === "touchstart") {              // is it a touch event?
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {                                     // if not...
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

     //check if the element we are clicking on is the element we would like to drag
     //Why? we are listening for our various mouse and touch events on the container, NOT the element we are dragging
      if (e.target === dragItem) {
        active = true;
      }
    }


/*Drag*/
    //When the mousemove or touchmove events get fired, drag
    function drag(e) {
      if (active) {               //check whether the drag is active
      
        //tell the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be (MDN)
        e.preventDefault();
      
       //set the value of currentX and currentY to the result of the current pointer position with an adjustment from initialX and initialY
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        //set the new Offset
        xOffset = currentX;
        yOffset = currentY;

        //set the new position for our dragged element
        setTranslate(currentX, currentY, dragItem);
      }
    }

/* Draw - transform translate */
    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

/* Resizing function */
    var reSizingItem = function(){
     this.w = 100;
     this.h = 100;
    }

/* Re-sizing control */
    var s = gui.addFolder('Size');
    var sItem = new reSizingItem();
    //console.log(sItem);
    var w = s.add(sItem,'w',10,500, 10);
    w.onChange(function(v){$('#item').css('width', v+'px');})
    //var h = s.add(sItem,'h',10,500, 10);
    //h.onChange(function(v){$('#item').css('height', v+'px');})
    s.open();
    gui.close();
    

/*End Drag*/
    function dragEnd(e) {
      //keep new position as starting one
      initialX = currentX;
      initialY = currentY;

      //set active to false
      active = false;
    }
    
    var video = document.getElementById('videostream');
    video.src = 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4';
    var captureVideoButton = document.querySelector('#capture-button');
    
    captureVideoButton.onclick = function() {
        if (videoplay === false) {
          //code
          video.play();
          //document.getElementById('capture-button').remove();
          document.getElementById('yes-camera').style.display = 'none';
          document.getElementById('no-camera').style.display = 'inline-block';
          videoplay = true;
        }else{
          video.pause();
          document.getElementById('no-camera').style.display = 'none';
          document.getElementById('yes-camera').style.display = 'inline-block';
          videoplay = false;
        }

        /*read...
         *for videos:
         *--- https://stackoverflow.com/questions/28140147/turn-off-webcam-camera-after-using-getusermedia
         * icons:
         * --- https://www.w3schools.com/icons/icons_reference.asp
         *for handling pseudo-elements and fontawesome stacking:
         *--- https://stackoverflow.com/questions/45857133/how-to-stack-fontawesome-icons
         *--- https://stackoverflow.com/questions/5041494/selecting-and-manipulating-css-pseudo-elements-such-as-before-and-after-usin
         *--- https://stackoverflow.com/questions/20353907/how-to-stack-overlap-more-than-2-icons-in-font-awesome
         *--- https://fontawesome.com/how-to-use/on-the-web/styling/layering
         *--- https://fontawesome.com/how-to-use/on-the-web/styling/stacking-icons
         *--- https://codepen.io/EeKay/pen/JYrGZg
         *--- https://jsfiddle.net/MrPolywhirl/25bfvxgo/
         * fontawesome resizing:
         * --- https://fontawesome.com/how-to-use/on-the-web/styling/sizing-icons
         *bootstrap icons:
         *--- https://mdbootstrap.com/docs/jquery/content/icons-usage/
         *fontawesome and d3js:
         *--- https://stackoverflow.com/questions/18416749/adding-fontawesome-icons-to-a-d3-graph/19385042#19385042
         * multiple backgrounds:
         * --- https://www.w3schools.com/css/css3_backgrounds.asp
         */
    };
    
    function openNav() {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("openmenu").style.zIndex = "-1";
    }
    
    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("openmenu").style.zIndex = "1";
    }
    
    //document.getElementById('play').addEventListener('click', function () {
    //    video.play();
    //});
    //document.getElementById('pause').addEventListener('click', function () {
    //    video.pause();
    //});
    
/*
REFERENCES:
--- https://teamtreehouse.com/community/htmlcss-linking
--- https://www.w3schools.com/css/css3_flexbox.asp
--- https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
--- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
--- https://www.sitepoint.com/community/t/overlay-image-on-embedded-video/291571/24
--- https://www.youtube.com/watch?v=yqmB7ar6Xaw
--- https://stackoverflow.com/questions/16823636/overlaying-a-div-on-top-of-html-5-video
--- http://www.play-hookey.com/htmltest/
*/