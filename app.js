let audioContainer;

async function convertTextToSpeech() {
    const textInput = document.getElementById('textInput').value;
    const outputElement = document.getElementById('output');
    audioContainer = document.getElementById('audioContainer');

    if (textInput.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    try {
        if (audioContainer) {
            audioContainer.parentNode.removeChild(audioContainer);
        }

        const response = await fetch('https://text-to-speech27.p.rapidapi.com/speech?text=' + encodeURIComponent(textInput) + '&lang=en-us', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'af21f92435mshab8b105b07cda31p138f82jsneeac105dfa6f',
                'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
            alert('Error converting text to speech. Please try again.');
            return;
        }

        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);

        audioContainer = document.createElement('div');
        audioContainer.id = 'audioContainer';

        const audioElement = new Audio(audioUrl);
        audioElement.controls = true;
        audioElement.autoplay = true;

        outputElement.textContent = textInput;

        audioContainer.appendChild(audioElement);
        outputElement.parentNode.insertBefore(audioContainer, outputElement.nextSibling);

    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Error converting text to speech. Please try again.');
    }
}

async function checkGrammar() {
    const textInput = document.getElementById('textInput').value.trim();
    const grammarResult = document.getElementById('grammarResult');

    if (textInput === '') {
        alert('Please enter text for grammar check.');
        return;
    }

    try {
        grammarResult.innerHTML = '<div class="audio-title">Grammar Check Result</div>';
        const encodedParams = new URLSearchParams();
        encodedParams.set('text', textInput);
        encodedParams.set('language', 'en-US');

        const options = {
            method: 'POST',
            url: 'https://grammarbot.p.rapidapi.com/check',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '5e2ccdc186msh5f6f488575d3757p125196jsn4ba6bcb25bed',
                'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com'
            },
            data: encodedParams,
        };

        const response = await axios.request(options);
        const result = response.data;

        if (result.matches && result.matches.length > 0) {
            const issuesHTML = result.matches.map((issue, index) => {
                return `
                    <div class="grammar-issue">
                        <div class="audio-title">Issue ${index + 1}</div>
                        <p><strong>Details:</strong> ${issue.message}</p>
                        <p><strong>Affected Text:</strong> ${issue.context.text}</p>
                        <p><strong>Suggested Replacements:</strong> ${issue.replacements.map(replacement => replacement.value).join(', ')}</p>
                        <hr>
                    </div>
                `;
            }).join('');

            grammarResult.innerHTML += issuesHTML;
        } else {
            grammarResult.innerHTML += '<p>No grammar issues found.</p>';
        }

    } catch (error) {
        console.error('Error checking grammar:', error);
        grammarResult.innerHTML += '<p>Error checking grammar. Please try again.</p>';
    }
}
let recognition;
let isListening = false;

function startSpeechRecognition() {
    const textInput = document.getElementById('textInput');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusMessage = document.getElementById('statusMessage');

    try {
        textInput.value = '';
        statusMessage.innerText = 'Recording...';  // Display status message

        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            startBtn.innerText = 'Listening...';
            stopBtn.disabled = false;
        };

        recognition.onresult = function(event) {
            const transcription = event.results[0][0].transcript;
            textInput.value = transcription;
        };

        recognition.onend = function() {
            isListening = false;
            startBtn.innerText = 'Start Listening';
            textInput.value += ' (Speech recognition completed.)';
            statusMessage.innerText = '';  // Clear status message
        };

        recognition.start();
    } catch (error) {
        console.error('Error starting speech-to-text:', error);
        textInput.value = 'Error during speech recognition. Please try again.';
        statusMessage.innerText = '';  // Clear status message
    }
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    isListening = false;

    // Check if the elements exist before modifying properties
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusMessage = document.getElementById('statusMessage');

    if (startBtn) {
        startBtn.innerText = 'Start Listening';
    }

    if (stopBtn) {
        stopBtn.disabled = true;
    }

    if (statusMessage) {
        statusMessage.innerText = 'Recording stopped';  // Display status message

        // Clear status message after a short delay (adjust as needed)
        setTimeout(() => {
            statusMessage.innerText = '';
        }, 2000);
    }
}


function populateLanguageDropdowns() {
    const fromLanguageDropdown = document.getElementById('fromLanguage');
    const toLanguageDropdown = document.getElementById('toLanguage');

    for (let country_code in countries) {
        const option = document.createElement('option');
        option.value = country_code;
        option.textContent = countries[country_code];

        fromLanguageDropdown.appendChild(option.cloneNode(true));
        toLanguageDropdown.appendChild(option);
    }

    // Set default languages
    fromLanguageDropdown.value = 'en-GB';
    toLanguageDropdown.value = 'es-ES';
}

function translateText() {
    const fromText = document.getElementById('textInput').value.trim();
    const toText = document.getElementById('translationResult');
    const fromLanguage = document.getElementById('fromLanguage').value;
    const toLanguage = document.getElementById('toLanguage').value;

    if (fromText === '') {
        alert('Please enter text for translation.');
        return;
    }

    try {
        toText.innerHTML = '<div class="audio-title">Translation Result</div><p>Translating...</p>';
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fromText)}&langpair=${fromLanguage}|${toLanguage}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.responseData) {
                    toText.innerHTML = `<div class="audio-title">Translation Result</div><p>${data.responseData.translatedText}</p>`;
                } else {
                    toText.innerHTML = '<div class="audio-title">Translation Result</div><p>Error translating text. Please try again.</p>';
                }
            });

    } catch (error) {
        console.error('Error translating text:', error);
        toText.innerHTML = '<div class="audio-title">Translation Result</div><p>Error translating text. Please try again.</p>';
    }
}

// Call the function to populate language dropdowns on page load
populateLanguageDropdowns();