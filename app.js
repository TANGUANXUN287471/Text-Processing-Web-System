let audioContainer; // Declare a global variable to store the container for speech text and audio

async function convertTextToSpeech() {
    const textInput = document.getElementById('textInput').value;
    const outputElement = document.getElementById('output');
    audioContainer = document.getElementById('audioContainer'); // Get the audio container

    if (textInput.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    try {
        // Remove the existing audio container if it exists
        if (audioContainer) {
            audioContainer.parentNode.removeChild(audioContainer);
        }

        const response = await fetch('https://text-to-speech27.p.rapidapi.com/speech?text=' + encodeURIComponent(textInput) + '&lang=en-us', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'x',
                'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            // Log the error status and text
            console.error('Error:', response.status, response.statusText);
            alert('Error converting text to speech. Please try again.');
            return;
        }

        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);

        // Create a new audio container dynamically
        audioContainer = document.createElement('div');
        audioContainer.id = 'audioContainer';

        // Create a new audio element dynamically
        const audioElement = new Audio(audioUrl);
        audioElement.controls = true; // Show audio controls
        audioElement.autoplay = true; // Autoplay the synthesized speech

        // Display the text in the output element
        outputElement.textContent = textInput;

        // Append the audio element to the container
        audioContainer.appendChild(audioElement);

        // Append the audio container below the output element
        outputElement.parentNode.insertBefore(audioContainer, outputElement.nextSibling);

    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Error converting text to speech. Please try again.');
    }
}

// Rest of the code remains unchanged


async function checkGrammar() {
    const textInput = document.getElementById('textInput').value;
    const grammarResultElement = document.getElementById('grammarResult');

    if (textInput.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    try {
        const encodedParams = new URLSearchParams();
        encodedParams.set('text', textInput);
        encodedParams.set('language', 'en-US');

        const response = await axios.post('https://grammarbot.p.rapidapi.com/check', encodedParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'x',
                'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com'
            },
        });

        const results = response.data.matches;

        // Clear previous results
        grammarResultElement.innerHTML = '';

        if (results.length > 0) {
            // Display grammar check results
            const resultContainer = document.createElement('div');
            resultContainer.innerHTML = '<h3>Grammar Check Results:</h3>';

            results.forEach((match, index) => {
                const matchElement = document.createElement('div');
                matchElement.classList.add('grammar-issue');

                const issueHeader = document.createElement('p');
                issueHeader.innerHTML = `<strong>Issue ${index + 1}:</strong>`;

                const issueDetails = document.createElement('p');
                issueDetails.innerHTML = `
                    <strong>Details:</strong> ${match.message}<br>
                    <strong>Affected Text:</strong> ${match.context.text}<br>
                    <strong>Suggested Replacements:</strong> ${match.replacements.map(rep => rep.value).join(', ')}
                `;

                matchElement.appendChild(issueHeader);
                matchElement.appendChild(issueDetails);

                resultContainer.appendChild(matchElement);
            });

            grammarResultElement.appendChild(resultContainer);
        } else {
            // No grammar issues found
            grammarResultElement.innerHTML = '<p>No grammar issues found.</p>';
        }

        // Notify the user that the grammar check is complete
        alert('Grammar check complete. Check the grammar result section for details.');
    } catch (error) {
        console.error(error);
        alert('Error checking grammar. Please try again.');
    }
}
