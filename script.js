'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
            </div>
            </article>`;

  console.log(html);
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};
/*
const getCountryAndNeighbour = function (country) {
  // OLD SCHOOL OF REQUESTING

  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    //   console.log(this.responseText);

    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    // Get Neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};
////////////////* IMPORTANT ALWAYS USE THIS URL: https://countries-api-836d.onrender.com/countries/

// getCountryAndNeighbour('portugal');
getCountryAndNeighbour('usa');

// CALLBACK HELL: Messy and hard to understand is a bad code. This will lead to more bugs.

setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
        setTimeout(() => {
          console.log('5 second passed');
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
*/

/*
////* PROMISES
// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v2/name/${country}`);
// request.send();

const request = fetch('https://restcountries.com/v2/name/portugal');
console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

//////* CONSUMING PROMISES
// Simplified version

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      // const neighbour = data[0].borders?.[0];
      const neighbour = 'dsdsdsds';

      if (!neighbour) return;

      // Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      // console.log(neighbour);

      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

////////* HANDLING REJECTED PROMISES

btn.addEventListener('click', function () {
  getCountryData('portugal');
});

getCountryData('australia');

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀


//////////////////*  MY ANSWER

const whereAmI = function (lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  )
    .then(response => {
      console.log(response);
      if (!response.ok)
        throw new Error(`Problem with geocoding (${response.status})`);

      return response.json();
    })
    // .then(data => {
    //   console.log(data);
    //   console.log(`You are in ${data.city}, ${data.countryName}.`);

    //   if (!data.city && !data.countryName) return;
    // })
    .then(data => {
      fetch(
        `https://restcountries.com/v2/name/${data.countryName.toLowerCase()}`
      )
        .then(response => {
          console.log(response);

          if (!response.ok)
            throw new Error(`Country not found (${response.status})`);

          return response.json();
        })
        .then(data => {
          renderCountry(data[0]);
          const neighbour = data[0].borders?.[0];

          if (!neighbour) return;

          return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
        })
        .then(response => {
          if (!response.ok)
            throw new Error(`Country not found (${response.status})`);

          return response.json();
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(err => {
          console.error(`${err}`);
          renderError(`Something went wrong ${err.message}. Try again!`);
        })
        .finally(() => {
          countriesContainer.style.opacity = 1;
        });
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again!`);
    });
};

btn.addEventListener('click', function () {
  // whereAmI(52.508, 13.381);
  // whereAmI(19.037, 72.873);
  whereAmI(-33.933, 18.474);
});

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);


//////////////////* JONAS' ANSWER


const whereAmI = function (lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  )
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);

      return fetch(
        `https://restcountries.com/v2/name/${data.countryName.toLowerCase()}`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);
*/

//////////////* ASYNCHRONOUS BEHIND THE SCENES: THE EVENT LOOP
/*
Runtime in the Browser - "Container" which includes all the pieces necessary to execute Javascript code

PARTS
1. JS Engine - "Heart" of the runtime
  a. HEAP - where object are stored in memory
  b. CALL STACK - where code is actually executed. Only ONE thread of execution. No multitasking!
2. WEB APIs - APIs provided to the engine
3. EVENT LOOP - sends callbacks from queue to call stack
4. CALLBACK QUEUE - ready-to-be-executed callback functions (coming from events)

*/

//////////////* ASYNCHRONOUS BEHIND THE SCENES: THE EVENT LOOP IN PRACTICE

/* 
1. The first to run is anything top level code (outside the callbacks)
2. Second is from  the microtasks queue (this should be resolve first before the callback queue)
3. Then, from the callback queue (because of the timer)


console.log('Test start');

setTimeout(() => console.log('O sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));
console.log('Test end');
*/
/*
console.log('Test start');

setTimeout(() => console.log('O sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('Test end');


//////////////* BUILDING A SIMPLE PROMISES
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening 🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      // Fulfilled Promise
      resolve('You WIN! 💰');
    } else {
      reject(new Error('You lose your money! 💩'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

/// Promisifying means to convert callback based asynchrounous behaviour to promise based
// PROMISIFYING setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// CONSUME the promise
wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('4 seconds passed');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 second'));

// OLD CALLBACK HELL
// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 second passed');
//       setTimeout(() => {
//         console.log('4 second passed');
//         setTimeout(() => {
//           console.log('5 second passed');
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

/// EASY FULFILLED AND REJECT PROMISE

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.error(x));
*/

// Promise based API
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // Callback based API
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    // The same above...
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);

      return fetch(
        `https://restcountries.com/v2/name/${data.countryName.toLowerCase()}`
      );
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};

btn.addEventListener('click', whereAmI);

// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. // When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. // The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

SOLUTION:
 
  1. What is the function?
    a. Pass the imgPath as an input.
  2. How to return a promise that creates a new image and sets the .src attribute to the provided image path?
    a. 
  3. How to append the DOM element after the image done loading?
  4. How to fulfill the value (iamge element)?
  5. How to reject the promise if there is an error?


If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

// PART 1
const imagesContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    // create a new image
    const img = document.createElement('img');

    // src attribute of the image element to the provided 'imgPath'
    img.src = imgPath;

    // Event listeners
    // load
    // Solution #1
    // img.onload = () => {
    //   imagesContainer.appendChild(img);
    //   resolve(img);
    // };

    // Solution #2
    img.addEventListener('load', function () {
      imagesContainer.append(img);
      resolve(img);
    });

    // Listen to error
    // Solution #1
    // img.onerror = () => {
    //   reject(new Error('Failed to load image'));
    // };

    // Solution #2
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

// PART 2
// Handle the successful promise
createImage('img/img-1.jpg').then(img => {
  console.log('Image 1 loaded');
});
