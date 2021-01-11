let fps = 25  // frames per sec. max 60
let video = document.getElementById('video_array');
let vid_src = [
  "Video/VC00-WEB.mp4",
  "Video/VC01-WEB.mp4",
  "Video/VC02-WEB.mp4",
  "Video/VC03-WEB.mp4",
  "Video/VC04-WEB.mp4",
  "Video/VC05-WEB.mp4",
  "Video/VC06-WEB.mp4",
  "Video/VC07-WEB.mp4",
  "Video/VC08-WEB.mp4",
  "Video/VC09-WEB.mp4",
  "Video/VC10-WEB.mp4",
  "Video/VC11-WEB.mp4",
  "Video/VC12-WEB.mp4",
  "Video/VC13-WEB.mp4",
  "Video/VC14-WEB.mp4",
  "Video/VC15-WEB.mp4",
  "Video/VC16-WEB.mp4",
  "Video/VC17-WEB.mp4",
  "Video/VC18-WEB.mp4",
  "Video/VC19-WEB.mp4",
  "Video/VC20-WEB.mp4",
  "Video/VC21-WEB.mp4",
  "Video/VC22-WEB.mp4",
  "Video/VC23-WEB.mp4"
];

let K01 = true;
let K02 = K03 = K04 = K05 = K06 = K07 = K08 = K09 = K10 = K11 = K12 = K13 = K14 = K15 = false;
let K16 = K17 = K18 = K19 = K20 = false;
let audioKadenz = document.getElementById('kadenz');
let ad = document.getElementById('AD');
let ad_src = [
  "assets/2020_01_17_Beethoven Kadenz_Korrektur.mp3", // [0]
  "assets/AD01.mp3", //     [1]
  "assets/AD02.mp3", //     [2]
  "assets/AD03.mp3", //     [3]
  "assets/AD01_2.mp3", //   [4]
  "assets/AD01_3.mp3", //   [5]
  "assets/AD01_4.mp3", //   [6]
  "assets/AD02_2.mp3", //   [7]
  "assets/AD02_3.mp3"  //   [8]
]
var noteQueue = [];  
var hdProcessQueue; // setInterval Handler
let videoPlays = false;

audioKadenz.src = "assets/2020_01_17_Beethoven Kadenz_Korrektur.mp3";
ad.muted=false;




// checking MIDI ability
//
// Variable which tell us what step of the game we're on. 
// We'll use this later when we parse noteOn/Off messages
let currentStep = 0;
// Request MIDI access
if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    console.log('WebMIDI is not supported in this browser.');
}

// creating an event to start processing Queue
var eventK01 = new Event('eventK01');
window.addEventListener('eventK01', function (e) { 
                hdProcessQueue = setInterval(processingQueue, 10);
                }, false);



// Function to run when requestMIDIAccess is successful
function onMIDISuccess(midiAccess) {
  console.log('000', midiAccess.inputs)
  // for (let output of midiAccess.outputs.values()) {
  //   console.log('000-output.name', output.name)
  // }

  // // Attach MIDI event "listeners" to each input
  for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
      console.log('111-input.name', input.name);
  }
}

// Function to run when requestMIDIAccess fails
function onMIDIFailure() {
  console.log('Error: Could not access MIDI devices.');
}

// Function to parse the MIDI messages we receive
// For this app, we're only concerned with the actual note value,
// but we can parse for other information, as well
function getMIDIMessage(message) {
  let command = message.data[0];
  let note = message.data[1];
  let velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
// console.log('message=', message);

// console.log('note =', note, 'command=', command);

// clear Channel-Nr information 
command = command >> 4;
command = command << 4;

// console.log('command=', command);
  switch (command) {
      case 144: // note on
          if (velocity > 0) {
              // console.log('testcom=', testcom);
              noteOn(note);
          } else {
              // ;
          }
          break;
      case 128: // note off
          // noteOffCallback(note);
          break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}

// Function to handle noteOn messages (ie. key is pressed)
// Think of this like an 'onkeydown' event
function noteOn(note) {
  
  
 
  switch(note) {  // on-line actions
  case 21: if (K01) {K01 = false; noteQueue.push(note); window.dispatchEvent(eventK01); 
                    }; break;
  case 71: break;
  case 105:break; // 105
  case 106:  // alles ausschalten und in die Ausgangsposition bringen, ist immer eingeschaltet.
              video.src = vid_src[0]; video.play(); videoPlays=true;
              // audioKadenz.pause(); ad.pause();
              K01=true; K02=K03=K04=K05=K06=K07=K08=K09=K10=K11=K12=K13=K14=K15=K16=K17=K18=K19=K20=false;
              noteQueue.length = 0; 
              // clearInterval(hdProcessQueue);
              console.log('Taste 106');
    break;
  
  case 108:   // Panictaste - alles ausschalten. Prepare to new play.
              video.src = vid_src[0]; video.play(); videoPlays=true;
              // audioKadenz.pause(); ad.pause();
              K01=K02=K03=K04=K05=K06=K07=K08=K09=K10=K11=K12=K13=K14=K15=K16=K17=K18=K19=K20=false;
              clearInterval(hdProcessQueue);
              console.log('panicTaste 108');
            break; //108
  }   // switch

  if (!K01 && note != 21) noteQueue.push(note);
  
}   // function noteOn


function processingQueue() {
  video.onended = () => videoPlays=false;
  if (noteQueue.length <1 || videoPlays)  return;

  let note = noteQueue.shift();
  console.log('note =', note, 'Queue=', noteQueue.length);
  
  switch(note) {   //  queue actions
    case 21: {K02=K16=K17=K18=true; video.src = vid_src[23]; video.play();
              audioKadenz.load(); audioKadenz.play(); audioKadenz.muted=false; } break;
    case 49: if(K02) {K02=false; K03 = true; video.src = vid_src[1]; video.play(); videoPlays=true;} break;
    case 56: if(K03) {K03=false; video.src = vid_src[2]; video.play(); videoPlays=true; setTimeout( ()=>{
                      console.log('settimeout');
                      if(Math.floor(Math.random() * 2)==0) {K04 = true; ad.src=ad_src[2]; ad.play();} // ende if - 1
                      else {K11 = true; ad.src=ad_src[3]; ad.play(); } // ende if - 0
                      }, 5000); // setTimeout
           } break; // 56
    case 66: if(K11) {K11=false; K12 = true; K13 = true; video.src = vid_src[3]; video.play();videoPlays=true;
            ad.src=ad_src[2]; ad.play();} break; // 66
    case 68: if(K12) {K12=false; K14 = true; K13 = false; video.src = vid_src[4]; video.play();videoPlays=true; } break;
    case 74: if(K14) {K14=false; video.src = vid_src[10]; video.play(); videoPlays=true;  setTimeout( ()=>{
            if(Math.floor(Math.random() * 2)==0) {K08 = true; ad.src=ad_src[1]; ad.play();} // ende if - 1
            else {K10 = true; ad.src=ad_src[2]; ad.play(); } // ende if - 0
            }, 10000); // setTimeout
          }  break; // 74
    case 63: if(K13) {K13=false; K08 = true; video.src = vid_src[5]; video.play(); videoPlays=true;
              ad.src=ad_src[1]; ad.play();} break; // 63
    case 54: if(K04) {K04=false; K11 = false; K06 = true; K05 = true; video.src = vid_src[6]; video.play(); videoPlays=true;} break;
    case 51: if(K05) {K05=false; K06 = false; K11 = false; video.src = vid_src[8]; video.play(); videoPlays=true;
              ad.src=ad_src[6]; ad.play(); setTimeout( ()=>{ 
                if(Math.floor(Math.random() * 2)==0) {K12 = true; ad.src=ad_src[5]; ad.play();} // ende if - 1
              else {K13 = true; ad.src=ad_src[3]; ad.play(); } // ende if - 0
              },10000); // setTimeout
            } break; // 51
    case 58: if(K06) {K06=false; K07 = !K07; video.src = vid_src[7]; video.play(); videoPlays=true;} break;
    case 60: if(K07) {K07=false; K08 = true; video.src = vid_src[5]; video.play();videoPlays=true; ad.src=ad_src[1]; ad.play();} break;
    case 70: if(K08) {K08=false; K09 = true; video.src = vid_src[9]; video.play(); videoPlays=true;} break;
    case 71: if(K09) {K10=true;  K09=false;  video.src = vid_src[10]; video.play(); videoPlays=true;} break;
    case 105:if(K10) {K10=false; K01=true; 
                video.src = vid_src[0]; video.play(); videoPlays=true;
                // audioKadenz.pause(); ad.pause();             
              } break; // 105
    case 77: if(K15) {video.src = vid_src[9]; video.play(); videoPlays=true;} break;
    case 92: if(K16) {K16=false; video.src = vid_src[15+eMein()]; video.play(); videoPlays=true;
                      setTimeout(()=>K16=true,4000); } break;
    case 84: if(K17) {K17=false; video.src = vid_src[11+eDein()]; video.play();videoPlays=true;
                      setTimeout(()=>K17=true,4000);} break;
    case 78: if(K18) {K18=false; video.src = vid_src[19+eUns()]; video.play(); videoPlays=true;
                      setTimeout(()=>K18=true,4000);} break;
    case 107: break; // 107
    case 106:
      // if(K20) {K20=false; K08 = !K08; video.src = vid_src[5]; video.play(); videoPlays=true; ad.src=ad_src[0]; ad.play();} 
      break;
    
    case 108:  // Panictaste - alles ausschalten. Prepare to new play.
              break; //108
  }   // switch


};   // function processingQueue


// counter for Baloon videos
function videoCounter() {
  let count = -1;
  return function() {count++; count = count&3; return count; };
}

let eDein = videoCounter();
let eMein = videoCounter();
let eUns  = videoCounter();

