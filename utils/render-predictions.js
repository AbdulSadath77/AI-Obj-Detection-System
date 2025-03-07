import { throttle } from "lodash";

// Initialize the pause state
let isPaused = false;

// Function to update the pause state - will be called from the component
export const updatePauseState = (paused) => {
  isPaused = paused;
};

export const renderPredictions = (predictions, ctx) => {
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

    if (isPerson) {
      playAudio();
    }
  });
};

// Throttled function to play audio
const playAudio = throttle(() => {
  if (isPaused) return;

  try {
    const audio = new Audio("/alert-alarm.wav");
    audio.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  } catch (error) {
    console.log("Error creating audio:", error);
  }
}, 6000);
