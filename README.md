<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">AI4Seniors</h3>

  <p align="center">
    AI4Seniors is a 501c3 non-profit organization dedicated to empowering the elderly to live indepdently via the use of technology. 
    This project addresses the difficulties of shopping: a daily necessity. 
  </p>
</p>
By Jonathan Park (jonathanxpark)

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#model-performance">Model Performance</a>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Seniors must carefully read ingredient labels on medication and food products to avoid allergens and follow a diet. 
However, it is difficult for many individuals, especially seniors to read ingredient labels as the text on these products is in small print. 
ReSight is a mobile application that identifies drug and food allergens for seniors. 
It has two features: a conversational agent that provides voice interaction to help a senior predefine a list of ingredients to avoid, 
and a convolutional neural network (CNN) that analyzes photos of ingredient labels, taken by the senior using the app, to detect the predefined ingredients. 
After detecting allergens, ReSight highlights the allergens on the screen and verbally informs the user of their presence.
Instead of bringing reading glasses and spending time identifying allergens, 
seniors can now use ReSight, which automatically detects and notifies them of any predefined restricted ingredients.

The structure of the application below:

<img width="559" alt="Screen Shot 2021-10-11 at 12 15 23 AM" src="https://user-images.githubusercontent.com/21136258/136733059-7f30fe7e-bcd5-427b-a309-623e5f8e6837.png">

Live demo:

https://user-images.githubusercontent.com/21136258/136733138-5d31d315-d219-4430-8d63-a3342509a1ec.mp4

<!-- MODEL PERFORMANCE -->
## Model Performance
The CNN model was compared with two baselines: Tesseract, one of the most accurate open-source optical character recognition (OCR) systems 
and Google Vision API, an industry-leading OCR system. 
Experimental results demonstrate that the CNN model performed significantly better than Tesseract and performed as well as Google Vision API. 

Compatibility:
Compatible on both IOS and Android.
