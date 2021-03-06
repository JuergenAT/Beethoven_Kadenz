let fps = 25  // frames per sec. max 60
let videoBL   = document.getElementById('video_BlueLine');
let video     = document.getElementById('video_array');
let video_alf = document.getElementById('video_alpha');
let vid_src = [
  "Video/VC00-WEB.mp4",       //  White BG
  "Video/VC01-WEB.webm",      //  Window Lisa
  "Video/VC02-WEB.webm",      //  Window Monument
  "Video/VC03-WEB.webm",      //  Window Capitol
  "Video/VC04-WEB.webm",      //  Window Rus Revol + Audio
  "Video/VC05-WEB.webm",      //  Window Beethovwen Monument + Audio
  "Video/VC06-WEB.webm",      //  Window GDR + Audio
  "Video/VC07-WEB.webm",      //  Window Pic-animation Beethoven go out + Audio
  "Video/VC08-WEB.webm",      //  Window Blue text
  "Video/VC09-WEB.webm",      //  Amsterdam Beethoven Duldet mutig Window Freude
  "Video/VC10-WEB.webm",      //  Window Monument (copy VC02)
  "Video/VC11-WEB.WebM",      //  [0] Baloon Ewig dein schwarz +Alpha
  "Video/VC12-WEB.WebM",      //  [1] Baloon Ewig dein rot +Alpha
  "Video/VC13-WEB.WebM",      //  [2] Baloon Ewig dein braun +Alpha
  "Video/VC14-WEB.WebM",      //  [3] Baloon Ewig dein grün +Alpha
  "Video/VC15-WEB.WebM",      //  [4] Baloon Ewig mein schwarz +Alpha
  "Video/VC16-WEB.WebM",      //  [5] Baloon Ewig mein rot +Alpha
  "Video/VC17-WEB.WebM",      //  [6] Baloon Ewig mein braun +Alpha
  "Video/VC18-WEB.WebM",      //  [7] Baloon Ewig mein grün +Alpha
  "Video/VC19-WEB.WebM",      //  [8] Baloon Ewig uns schwarz +Alpha
  "Video/VC20-WEB.WebM",      //  [9] Baloon Ewig uns rot +Alpha
  "Video/VC21-WEB.WebM",      //  [10] Baloon Ewig uns braun +Alpha
  "Video/VC22-WEB.WebM",      //  [11] Baloon Ewig uns grün +Alpha
  "Video/VC23-WEB.mp4",       //  Blue Line Crosses
  "Video/VC24-WEB.webm",      //  Beethoven Bee blow up Freude Ahndest du den Schöpfer
  "Video/VC25-WEB.webm",      //  Pic animation Beethoven go in Window Freude
  "Video/VC26-WEB.webm",      //  Polizei Window Freude
  "Video/VC27-WEB.webm",      //  Lisa Bee Boom
  "Video/VC28-WEB.webm",      //  Pflanze Beethoven text Auch die Toten
  "Video/VC29-WEB.webm",      //  Ersatz
  "Video/VC30-WEB.mp4 ",      //  Logo
  "Video/VC31-WEB.webm"       //  Transparent
];

let K00 = true;       // Turn on - turn off MIDI-keyboard processing
let K01 = true;
let K02 = K03 = K04 = K05 = K06 = K07 = K08 = K09 = K10 = K11 = K12 = K13 = K14 = K15 = false;
let K16 = K17 = K18 = K19 = K20 = false;
let audioKadenz = document.getElementById('kadenz');
let ad = document.getElementById('AD');
let ad_src = [
  "assets/AD00.mp3",   //   [0]  Kadenz
  "assets/AD01.mp3",   //   [1]  Deu
  "assets/AD02.mp3",   //   [2]  Rus
  "assets/AD03.mp3",   //   [3]  Sym09
  "assets/AD04.mp3",   //   [4]  Revers9
  "assets/AD05.mp3",   //   [5]  Signal
  "assets/AD06.mp3"    //   [6]  Explosion
]
var noteQueue = [];  
var hdProcessQueue; // setInterval Handler
let videoPlays = false;

// videoBL.src = vid_src[23];
audioKadenz.src = ad_src[0];
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
  // case 106:  // alles ausschalten und in die Ausgangsposition bringen, ist immer eingeschaltet.
  //             video.src = vid_src[0]; video.play(); videoPlays=true;
  //             videoBL.pause();
  //             audioKadenz.pause(); ad.pause();
  //             K01=true; K02=K03=K04=K05=K06=K07=K08=K09=K10=K11=K12=K13=K14=K15=K16=K17=K18=K19=K20=false;
  //             noteQueue.length = 0; 
  //             // clearInterval(hdProcessQueue);
  //             console.log('Taste 106');
  //   break;
  
  case 108:   // Panictaste - alles ausschalten. Prepare to new play.
            if (K00) {
              videoBL.pause();
              video.src = vid_src[0]; video.play(); videoPlays=true;
              audioKadenz.pause(); ad.pause();
              K01=K02=K03=K04=K05=K06=K07=K08=K09=K10=K11=K12=K13=K14=K15=K16=K17=K18=K19=K20=false;
              clearInterval(hdProcessQueue);
            };  //  end if
            break; //108


  case 92: if(K16) {K16=false; video_alf.src = vid_src[15+eMein()]; video_alf.play();
              setTimeout(()=>K16=true,4000); } return;
  case 85: if(K17) {K17=false; video_alf.src = vid_src[11+eDein()]; video_alf.play();
              setTimeout(()=>K17=true,4000);} return;
  case 78: if(K18) {K18=false; video_alf.src = vid_src[19+eUns()]; video_alf.play(); 
              setTimeout(()=>K18=true,4000);} return;

  }   // switch

  if (!K01 && note != 21) noteQueue.push(note);
  
}   // function noteOn


function processingQueue() {

  video.onended = () => videoPlays=false; 
  videoBL.onended = () => {
    clearInterval(hdProcessQueue);
    noteQueue.length = 0;
    if (videoPlays) {video.onended = () => {video_alf.src = vid_src[30]; video_alf.play(); }; 
        videoPlays=false;
      }
    else {video_alf.src = vid_src[30]; video_alf.play();};
    K00=K01=K02=K03=K04=K05=K06=K07=K08=K09=K10=K11=K12=K13=K14=K15=K16=K17=K18=K19=K20=false;  
  }
  if (noteQueue.length <1 || videoPlays)  return;

  let note = noteQueue.shift();
  console.log('note =', note, 'Queue=', noteQueue.length);
  
  switch(note) {   //  queue actions
    case 21: {K02=K16=K17=K18=true; 
      videoBL.src = vid_src[23]; videoBL.play();
      video.src = vid_src[31];   video.play();  videoPlays=true; //  To load transparent frame on z=0 level
      
            // video.src = vid_src[11];
            //   let videoPromise=video.play(); //  To load transparent frame on z=0 level
            //   if (videoPromise !== undefined) {
            //       videoPromise.then(() =>  video.pause()  ); 
            //     }  // if

              audioKadenz.load(); audioKadenz.play(); audioKadenz.muted=false; } break; // 21
    case 49: if(K02) {K02=false; K03 = true; video.src = vid_src[1]; video.play(); videoPlays=true;} break;
    case 56: if(K03) {K03=false; video.src = vid_src[2]; video.play(); videoPlays=true; setTimeout( ()=>{
                      if(Math.floor(Math.random() * 2)==0) {K04 = true; ad.src=ad_src[5]; ad.play();} // ende if - 1
                      else {K11 = true; ad.src=ad_src[6]; ad.play(); } // ende if - 0
                      }, 3000); // setTimeout
           } break; // 56
    case 66: if(K11) {K11=false; K12 = true; K13 = true; video.src = vid_src[3]; video.play();videoPlays=true;
            //  ad.src=ad_src[2]; ad.play();
          }  break; // 66
    case 68: if(K12) {K12=false; K14 = true; K13 = false; video.src = vid_src[4-vidK12()]; video.play();videoPlays=true; } break;
    case 74: if(K14) {K14=false; video.src = vid_src[10]; video.play(); videoPlays=true;  setTimeout( ()=>{
            if(Math.floor(Math.random() * 2)==0) {K08 = true; ad.src=ad_src[5]; ad.play();} // ende if - 1
            else {K10 = true; ad.src=ad_src[6]; ad.play(); } // ende if - 0
            }, 5000); // setTimeout
          }  break; // 74
    case 63: if(K13) {K13=false; K08 = true; video.src = vid_src[5+vidK13()]; video.play(); videoPlays=true;
            //  ad.src=ad_src[1]; ad.play();
            } break; // 63
    case 54: if(K04) {K04=false; K11 = false; K06 = true; K05 = true; video.src = vid_src[6]; video.play(); videoPlays=true;} break;
    case 51: if(K05) {K05=false; K06 = false; K11 = false; video.src = vid_src[8]; video.play(); videoPlays=true;
              setTimeout( ()=>{ 
                if(Math.floor(Math.random() * 2)==0) {K12 = true; ad.src=ad_src[4]; ad.play();} // ende if - 1
                else {K13 = true; ad.src=ad_src[3]; ad.play(); } // ende if - 0
              },5000); // setTimeout
            } break; // 51
    case 58: if(K06) {K06=false; K07 = true; video.src = vid_src[7]; video.play(); videoPlays=true;} break;
    case 61: if(K07) {K07=false; K08 = true; video.src = vid_src[24]; video.play();videoPlays=true;} break;
    case 70: if(K08) {K08=false; K09 = true; video.src = vid_src[8+vidK08()]; video.play(); videoPlays=true;} break;
    case 71: if(K09) {K10=true;  K09=false;  video.src = vid_src[25-vidK09()]; video.play(); videoPlays=true;} break;
    case 105:if(K10) {K10=false; video.src = vid_src[26+vidK10()]; video.play(); videoPlays=true;
              setTimeout( ()=>{ 
              if(Math.floor(Math.random() * 2)==0) {K12 = true; ad.src=ad_src[4]; ad.play();} // ende if - 1
              else {K13 = true; ad.src=ad_src[3]; ad.play(); } // ende if - 0
      },5000); // setTimeout
                    
              } break; // 105

    case 106:
      // if(K20) {K20=false; K08 = !K08; video.src = vid_src[5]; video.play(); videoPlays=true; ad.src=ad_src[0]; ad.play();} 
      break;
    
    case 108:  // Panictaste - alles ausschalten. Prepare to new play.
              break; //108
  }   // switch


};   // function processingQueue


// counter for Baloon videos and last Video VC26++
function videoCounter4() {
  let count = -1;
  return function() {count++; count = count&3; return count; };
}

function videoCounter2() {
  let count = -1;
  return function() {count++; count = count&1; return count; };
}

let eDein = videoCounter4();
let eMein = videoCounter4();
let eUns  = videoCounter4();
let vidK10= videoCounter4();
let vidK08= videoCounter2();
let vidK09= videoCounter2();
let vidK12= videoCounter2();
let vidK13= videoCounter2();

