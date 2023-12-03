import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')
const movieImage = document.getElementById('output-img-container')
var downloadButton = document.getElementById('download-image-btn');
var copyButton = document.getElementById('copy-text-btn');

const configuration = new Configuration({
  apiKey: "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"
})


const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea')
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userInput)
    fetchSynopsis(userInput)
    console.log(userInput)
  }
})

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline:A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60 
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
  console.log(movieBossText)
  const response2 = await openai.createImage({
    prompt: outline,
    n: 1,
    size: '256x256',
    response_format: 'b64_json'
  })
  movieImage.innerHTML = `<img src="data:image/png;base64,${response2.data.data[0].b64_json}">`
  downloadButton.style.display = 'block';
  copyButton.style.display = 'block';
  console.log(outline)
} 

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',  

    prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role. 
    ###
    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.  
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 700
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',
    prompt: `Generate a catchy movie title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7
  })
  document.getElementById('output-title').innerText = response.data.choices[0].text.trim()
}

async function fetchStars(synopsis){
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',

    prompt: `Extract the names in brackets from the synopsis.
    ###
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    names: Tom Cruise, Val Kilmer, Kelly McGillis
    ###
    synopsis: ${synopsis}
    names:   
    `,
    max_tokens: 30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}


// Download Image Button
document.getElementById("download-image-btn").addEventListener("click", () => {
  const image = movieImage.querySelector("img");
  const imageUrl = image.getAttribute("src");
  downloadImage(imageUrl);
});

// Copy Text Button
document.getElementById("copy-text-btn").addEventListener("click", () => {
  const outputText = document.getElementById('output-text');
  copyTextToClipboard(outputText.innerText);
});

// Function to Download Image
function downloadImage(imageUrl) {
  const a = document.createElement('a');
  a.href = imageUrl;
  a.download = 'movie_image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to Copy Text to Clipboard
function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

document.getElementById('download-image-btn').addEventListener('click', function () {
  this.textContent = 'Downloaded';
});

document.getElementById('copy-text-btn').addEventListener('click', function () {
  this.textContent = 'Copied';
});
