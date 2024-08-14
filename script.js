const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const screenPreview = document.getElementById('screenPreview');

let mediaRecorder;
let recordedChunks = [];

// Function to start screen recording
startButton.addEventListener('click', async () => {
    try {
        // Ask user whether they want to include audio
        const includeAudio = confirm("Do you want to include audio in the screen recording?");

        // Define constraints for screen capture
        const screenConstraints = {
            video: true,
            audio: includeAudio // Include audio based on user's choice
        };
        
        // Capture the screen and optionally audio
        const screenStream = await navigator.mediaDevices.getDisplayMedia(screenConstraints);

        screenPreview.srcObject = screenStream;

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(screenStream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);

            // Automatically trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'screen-recording.webm';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Free up memory

            // Stop all tracks in the stream to release the screen share
            screenPreview.srcObject.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (err) {
        console.error('Error: ' + err);
    }
});

// Function to stop screen recording
stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});
