const mic = document.querySelector(".mic-icon");
const info = document.getElementById('info');
const menuIcon = document.getElementById("menu-icon");
const navMenu = document.querySelector(".nav-menu");

menuIcon.onclick = () => {
    navMenu.classList.toggle("show-nav")
}

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  let isListening = false;

// stops the speech recognition service
  const startRecognition = () => {
    recognition.start(); // starts speech recognition service
  
    mic.classList.add('listening'); // adds the pulse animation to mic-icon
  
    isListening = true; // Indicate the speech recognition service is currently listening.
  }
  
  // starts the speech recogniiton service  
  const stopRecognition = () => {
    recognition.stop(); // stops the speech recognition service
  
    mic.classList.remove('listening'); // removes the pulse animation on the mic-icon
  
    isListening = false; // Indicates the speech recognition service is currently not listening
  }

  const displayInfo = (message, textColor) => {
    info.style.display = "inline-block";
    info.style.color = textColor;
    info.innerText = message;
  
    setTimeout(() => {info.style.display = "none"}, 3000);
  }

  mic.onclick=()=>{  
    if(isListening == false) {
      startRecognition();
      displayInfo("Speech navigation enabled", "#000");
    }
    else if(isListening == true) {
      stopRecognition();
      displayInfo("Speech navigation disabled","#000");         
    }
  }

  recognition.onend = () => {
    if(isListening == true){
      recognition.start();
    }
  }

  recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0];
    const transcript = command.transcript.toLowerCase();
    
    const commands = {
        'about': () => navigateToSection('about'),
        'home': () => navigateToSection('home'),
        'contact': () => navigateToSection('contact'),
        'footer': () => navigateToSection('footer'),
        'down': () => window.scrollBy(0, window.innerHeight),
        'up': () => window.scrollBy(0, -window.innerHeight),
        'stop': () => {stopRecognition(); displayInfo("Speech navigation disabled","#000")},
        'open menu': () => navMenu.classList.add('show-nav'),
        'close menu': () => navMenu.classList.remove('show-nav')
      };

    let commandFound = false;
      for (const command in commands) {
        if (transcript.includes(command)) {
          commands[command]();
          commandFound = true;
          break; // Stop searching after the first match
        }
    }

    if (!commandFound) {
        displayInfo("Unrecognized command: Try again", "#000");
      }

    function navigateToSection(sectionId) {
      const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
    }

  }

  let errorHandled = false;
  recognition.onerror = (event) => {
    if (!errorHandled) {
        if (event.error == "network") {
          recognition.stop();
          isListening= false;
          mic.classList.remove('listening'); 
        }
    }
    displayInfo(`Speech recognition error: ${event.error}`, "#800000");
    errorHandled = true;
  }

  recognition.onstart = () => {
    errorHandled = false;
  };

}
else {
    mic.style.display = "none";
}