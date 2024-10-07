// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/c2qhXtExv/";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confiaza = 0;

// Variables for disco filter
let discoColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];
let discoColorIndex = 0;
let lastDiscoTime = 0;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(910, 700);
  // Create the video
  video = createCapture(VIDEO);
  video.size(910, 680);
  video.hide();

  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);

  // If the label is 'AirPods' and confidence is greater than 0.8, apply disco effect
  if (label === "airpods" && confiaza > 0.8) {
    // Apply disco filter effect
    applyDiscoEffect();
  } else {
    // No filter, show the normal video
    image(video, 0, 0);
  }

  // If the label is 'AirPods' and confidence is greater than 0.8
  if (label === "airpods" && confiaza > 0.8) {
    // Draw a rounded rectangle with a grey background
    fill(200); // Gray background
    stroke(255); // White stroke
    strokeWeight(2); // Border thickness
    rectMode(CENTER);
    rect(width / 2, 50, 200, 50, 20); // x, y, width, height, border radius

    // Draw the text 'AirPods Conect'
    fill(255); // White text
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text("AirPods Conect", width / 2, 50); // Show the text in the center of the rectangle
  }
  // Display the label and confidence at the bottom
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

  textSize(8);
  textAlign(LEFT);
  text(confiaza, 10, height - 4);
}

// Function to apply a disco filter effect
function applyDiscoEffect() {
  // Update color every 200ms
  if (millis() - lastDiscoTime > 200) {
    discoColorIndex = (discoColorIndex + 1) % discoColors.length;
    lastDiscoTime = millis();
  }

  // Apply a tinted filter to the video with changing colors
  tint(discoColors[discoColorIndex]);
  image(video, 0, 0);

  // Optional: Add some flashy ellipses for more disco effect
  noStroke();
  fill(discoColors[discoColorIndex]);
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    ellipse(x, y, random(30, 80));
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(results, error) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  confiaza = results[0].confidence;

  // Classify again
  classifyVideo();
}
