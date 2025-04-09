import { throttle } from "lodash";

// Initialize the pause state
let isGlobalPaused = false;

// Initialize the selected audio output device ID
let selectedAudioOutputDeviceId = "";

// Store pause states for each camera
const pauseStates = new Map();

export const updatePauseState = (isPaused, cameraIndex = 0) => {
  pauseStates.set(cameraIndex, isPaused);
  isGlobalPaused = isPaused; // Keep the global state in sync for backward compatibility
};

export const isPaused = (cameraIndex = 0) => {
  return pauseStates.get(cameraIndex) || false;
};

// Function to update the selected audio output device
export const updateAudioOutputDevice = (deviceId) => {
  selectedAudioOutputDeviceId = deviceId;
};

export const renderPredictions = (predictions, ctx, cameraIndex = 0) => {
  // Skip rendering if this camera is paused
  if (isPaused(cameraIndex)) {
    return;
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Fonts
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];

    const isPerson = prediction.class === "person";

    // bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill the color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // Set the fill color to red
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);

    // Update analytics if the function exists
    if (typeof window !== 'undefined' && window.updateDetectionStats) {
      window.updateDetectionStats(prediction);
    }

    if (isPerson) {
      playAudio();
    }
  });
};

// Throttled function to play audio
const playAudio = throttle(() => {
  if (isGlobalPaused) return;

  try {
    const audio = new Audio("/alert-alarm.wav");

    // Set the audio output device if supported and selected
    if (selectedAudioOutputDeviceId && audio.setSinkId) {
      audio
        .setSinkId(selectedAudioOutputDeviceId)
        .then(() => {
          console.log(
            `Audio output device set to: ${selectedAudioOutputDeviceId}`
          );
        })
        .catch((err) => {
          console.error("Failed to set audio output device:", err);
        });
    }

    audio.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  } catch (error) {
    console.log("Error creating audio:", error);
  }
}, 6000);
