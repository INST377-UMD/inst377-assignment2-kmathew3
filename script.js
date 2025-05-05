function setupVoiceCommands() {
    if (typeof annyang !== 'undefined') {
      const commands = {
        'hello': () => alert('Hello World'),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const p = page.toLowerCase();
          if (p.includes('home')) window.location.href = 'index.html';
          else if (p.includes('stocks')) window.location.href = 'stocks.html';
          else if (p.includes('dogs')) window.location.href = 'dogs.html';
          else alert(`Unknown page: ${page}`);
        },
        'load dog breed *breed': (breed) => {
        const breedButton = Array.from(document.querySelectorAll('button[data-breed]'))
          .find(button => button.getAttribute('data-breed').toLowerCase() === breed.toLowerCase());

        if (breedButton) breedButton.click();
        else alert(`Breed "${breed}" not found.`);
      },

      'hello': () => alert('Hello World'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to home': () => window.location.href = 'index.html',
      'navigate to dogs': () => window.location.href = 'dogs.html',
    };
      annyang.addCommands(commands);
      annyang.start();
      console.log("Annyang voice recognition started.");
    } else {
      console.warn("Annyang not supported in this browser.");
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    setupVoiceCommands();
  
    document.getElementById('toggleAudio')?.addEventListener('click', () => {
        if (annyang) {
          annyang.abort();
          console.log('Audio turned off');
        }
      });
    
      document.getElementById('toggleOnAudio')?.addEventListener('click', () => {
        if (annyang) {
          annyang.start();
          console.log('Audio turned on');
        }
      });
    
      if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        fetch('https://zenquotes.io/api/random')
          .then(res => res.json())
          .then(data => {
            const quote = data[0].q + " — " + data[0].a;
            document.getElementById('quoteText').textContent = quote;
          })
          .catch(err => {
            console.error("Failed to fetch quote:", err);
            document.getElementById('quoteText').textContent = "Could not load quote.";
          });
      }
    
      if (window.location.pathname.includes("stocks.html")) {
        const polygonAPI = "8PewlNoXQTG3sq_xs7eMpFYWvukKrozA";
        let stockChart;
    
        function formatDate(epoch) {
          const date = new Date(epoch);
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
    
        async function fetchStockData(ticker, days = 30) {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - days);
    
          const from = start.toISOString().split('T')[0];
          const to = end.toISOString().split('T')[0];
    
          const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${polygonAPI}`;
          const res = await fetch(url);
          const data = await res.json();
    
          if (!data.results) return alert("Stock data not found");
    
          const labels = data.results.map(r => formatDate(r.t));
          const prices = data.results.map(r => r.c);
    
          drawChart(ticker, labels, prices);
        }
    
        function drawChart(ticker, labels, prices) {
          const ctx = document.getElementById('stockChart').getContext('2d');
          if (stockChart) stockChart.destroy();
    
          stockChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: `${ticker.toUpperCase()} Closing Prices`,
                data: prices,
                borderColor: 'blue',
                fill: false
              }]
            }
          });
        }
    
        async function fetchRedditStocks() {
          const url = `https://tradestie.com/api/v1/apps/reddit?date=2022-04-03`;
          const res = await fetch(url);
          const data = await res.json();
    
          const top5 = data.slice(0, 5);
          const tbody = document.getElementById('redditStockList');
          tbody.innerHTML = "";
    
          top5.forEach(stock => {
            const row = document.createElement('tr');
            const sentimentIcon = stock.sentiment === "Bullish" ? "📈" : "📉";
            row.innerHTML = `
              <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
              <td>${stock.no_of_comments}</td>
              <td>${stock.sentiment} ${sentimentIcon}</td>
            `;
            tbody.appendChild(row);
          });
        }
    
        fetchRedditStocks();
    
        document.getElementById('loadChartButton').addEventListener('click', () => {
          const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
          const days = parseInt(document.getElementById('timeRange').value);
          if (!ticker) return alert("Please enter a ticker.");
          fetchStockData(ticker, days);
        });
    
        if (annyang) {
          annyang.addCommands({
            'lookup *ticker': (ticker) => {
              document.getElementById('tickerInput').value = ticker.toUpperCase();
              fetchStockData(ticker, 30);
            }
          });
        }
      }


const dogImagesContainer = document.getElementById('dogCarousel');
const breedButtonsContainer = document.getElementById('breedButtons');
const breedInfoContainer = document.getElementById('breedInfo');
const breedNameElem = document.getElementById('breedName');
const breedDescriptionElem = document.getElementById('breedDescription');
const minLifeElem = document.getElementById('minLife');
const maxLifeElem = document.getElementById('maxLife');

const randomDogImagesAPI = 'https://dog.ceo/api/breeds/image/random/10';
const dogBreedsAPI = 'https://api.thedogapi.com/v1/breeds';
const apiKey = 'live_btnW6tjf46eDI5EIZNt2lGW4WsIzAFTallxDwLWCn89kYHvPDFDgwswr93GhHdqM';

async function fetchRandomDogImages() {
  try {
    const res = await fetch(randomDogImagesAPI);
    const data = await res.json();
    const images = data.message;

    images.forEach(image => {
      const img = document.createElement('img');
      img.src = image;
      img.alt = "Random Dog Image";
      img.classList.add('slider-item');
      dogImagesContainer.appendChild(img);
    });

    new SimpleSlider('#dogCarousel', {
      auto: true,
      interval: 3000,
      transition: 'fade',
      arrows: false
    });

  } catch (err) {
    console.error('Failed to fetch dog images:', err);
  }
}

async function fetchDogBreeds() {
  try {
    const res = await fetch(dogBreedsAPI);
    const data = await res.json();

    data.forEach(breed => {
      const button = document.createElement('button');
      button.textContent = breed.name;
      button.classList.add('button-61');
      button.setAttribute('data-breed', breed.name);
      button.addEventListener('click', () => displayBreedInfo(breed));
      breedButtonsContainer.appendChild(button);
    });
  } catch (err) {
    console.error('Failed to fetch dog breeds:', err);
  }
}

function displayBreedInfo(breed) {
  breedNameElem.textContent = breed.name;
  breedDescriptionElem.textContent = breed.description;
  minLifeElem.textContent = breed.life_span.split(' - ')[0];
  maxLifeElem.textContent = breed.life_span.split(' - ')[1];

  breedInfoContainer.style.display = 'block';
}

const breedAPI = `https://api.thedogapi.com/v1/breeds?api_key=live_btnW6tjf46eDI5EIZNt2lGW4WsIzAFTallxDwLWCn89kYHvPDFDgwswr93GhHdqM`;

fetch(breedAPI)
    .then(response => response.json())
    .then(data => {
        const breedButtons = document.getElementById('breedButtons');
        
        data.forEach(breed => {
            const breedButton = document.createElement('button');
            breedButton.textContent = breed.name;
            breedButton.classList.add('button-61');
            breedButton.setAttribute('data-breed', breed.name);
            
            breedButton.addEventListener('click', () => {
                showBreedInfo(breed);
            });

            breedButtons.appendChild(breedButton);
        });
    })
    .catch(error => {
        console.error('Error fetching breed data:', error);
    });

function showBreedInfo(breed) {
    const breedInfo = document.getElementById('breedInfo');
    breedInfo.style.display = 'block';
    document.getElementById('breedName').textContent = breed.name;
    document.getElementById('breedDescription').textContent = breed.description;
    document.getElementById('minLife').textContent = breed.life_span.split(' - ')[0];
    document.getElementById('maxLife').textContent = breed.life_span.split(' - ')[1];
}


function setupVoiceCommands() {
  if (annyang) {
    const commands = {
      'load dog breed *breed': (breed) => {
        const breedButton = Array.from(document.querySelectorAll('button[data-breed]'))
          .find(button => button.getAttribute('data-breed').toLowerCase() === breed.toLowerCase());

        if (breedButton) breedButton.click();
        else alert(`Breed "${breed}" not found.`);
      },

      'hello': () => alert('Hello World'),
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'navigate to home': () => window.location.href = 'index.html',
      'navigate to dogs': () => window.location.href = 'dogs.html',
    };

    annyang.addCommands(commands);
    annyang.start();
  }
}

function toggleAudioControl() {
  const toggleAudioBtn = document.getElementById('toggleAudio');
  const toggleOnAudioBtn = document.getElementById('toggleOnAudio');
  
  toggleAudioBtn.addEventListener('click', () => {
    if (annyang) annyang.abort();
  });

  toggleOnAudioBtn.addEventListener('click', () => {
    if (annyang) annyang.start();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchRandomDogImages();
  fetchDogBreeds();
  setupVoiceCommands();
  toggleAudioControl();
});

});