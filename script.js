// Get joke from Joke API
async function getJoke() {
   let joke = '';
   try {
      const jokeApiUrl = 'https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
      const resp = await fetch(jokeApiUrl);
      const jokeData = await resp.json();
      if(jokeData.setup) {
         joke = `${jokeData.setup} ... ${jokeData.delivery}`;
      } else {
         joke = jokeData.joke;
      }
      return joke;
   } catch(err) {
      // Catch error
      console.log('Error occured', err);
   }
}

// Passing joke to VoiceRSS API
function tellJoke(VoiceRSS, joke) {
   // console.log(joke);
   VoiceRSS.speech({
      key: '',
      src: joke,
      hl: 'en-us',
      v: 'Linda',
      r: 0, 
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false
  });
}

// Disable / Enable Button
function toggleButton(button) {
   button.disabled = !button.disabled;
}


// main function to run
function main() {
   // Declare DOM elements
   const button = document.getElementById('btn');
   const audioElement = document.getElementById('audio');

   // VoiceRSS Javascript SDK, can be moved to another module
   const VoiceRSS = {speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};
   
   // test(VoiceRSS);

   // Event listener to get joke
   button.addEventListener('click', async () => {
      try {
         const joke = await getJoke();
         tellJoke(VoiceRSS, joke);

         // disable button when audio is playing 
         toggleButton(button);
      } catch(err) {
         console.log('Error occured:', err);
      }
   });

   // Event listener to enable button when audio finished playing
   audioElement.addEventListener('ended', () => toggleButton(button));
}

main();