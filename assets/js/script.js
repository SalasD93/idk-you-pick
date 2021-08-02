var body = document.body;
// This is the Map Embed API
var getMap = function(){
    var convertAddress = localStorage.getItem("Address");
    // This replaces the spaces with + to be used in API call
    var linkAddress = convertAddress.replace(/\s/g,"+");
    var mapContainer = document.createElement('div');
    $(mapContainer).attr('id', "map-container");
    $(mapContainer).addClass("container");
    var map = document.createElement('iframe');
    $(map).addClass("map");
    $(map).attr("src",`https://www.google.com/maps/embed/v1/place?key=AIzaSyBGjt8MdI_N4adowcL8ig1YcWWSkzGm3Tg&q=${linkAddress}+loading=lazy+allowfullscreen`);
    body.append(mapContainer);
    mapContainer.appendChild(map);
}
// This is for the questions
var questionContainer = document.createElement('div');
$(questionContainer).attr('id', "question-container");
var question = document.createElement('p');
$(question).attr('id', "question");
var answers = document.createElement('div');
$(answers).attr('id', "sine");
$(answers).addClass("buttons is-centered");
$(question).text("What are you in the mood for?");
body.append(questionContainer);
questionContainer.appendChild(question);
questionContainer.appendChild(answers);
// This will load items when page starts
$(document).ready(function(){
    // This holds the intro display
    var introContainer = document.createElement('div');
    $(introContainer).attr('id', "intro-container");
    $(introContainer).addClass("column has-text-white");
    // This is for the intro paragraph
    var introP = document.createElement('p');
    $(introP).attr('id', "intro");
    $(introP).addClass("column notifcation is-size-5 has-text-weight-semibold");
    // This is for the start button
    var startBtn = document.createElement('button');
    $(startBtn).attr('id', "start");
    $(startBtn).addClass("button is-info is-link");
    introP.innerHTML = "This application allows you to randomly generate a restaurant in your area when you are having a hard time choosing where to eat." + "<br/>" + "To use this app, enter your zip code on the next page and answer the following questions.";
    startBtn.innerHTML = "START";
    body.append(introContainer);
    introContainer.appendChild(introP);
    introContainer.appendChild(startBtn);
    // This function will hide the intro so we can display new info
    function hideIntro() {
        $(introContainer).hide();
    }
    // This is the container for the zip code info
    var zipContainer = document.createElement('div');
    $(zipContainer).attr('id', "zip-container");
    $(zipContainer).addClass("column");
    // This is the zip code text
    var zipP = document.createElement('p');
    $(zipP).attr('id', "zip-text");
    $(zipP).addClass("is-info is-link");
    zipP.innerText = "Please enter your ZIP CODE:";
    var inputContainer = document.createElement('div');
    $(inputContainer).attr('id', "input-container");
    $(inputContainer).addClass("container is-3");
    // This is for the text input field for the zip code
    var zipInput = document.createElement('textarea');
    $(zipInput).attr('id', "zip-input");
    $(zipInput).addClass("is-small");
    // This is for the zip code submit button
    var submitBtn = document.createElement('button');
    $(submitBtn).attr('id', "zip-button");
    $(submitBtn).addClass("button is-info");
    submitBtn.innerHTML = "SUBMIT";
    body.append(zipContainer);
    zipContainer.appendChild(zipP);
    zipContainer.appendChild(inputContainer);
    inputContainer.appendChild(zipInput);
    zipContainer.appendChild(submitBtn);
    // These functions show and hide different sets of information
    function hideZip() {
        $(zipContainer).hide();
    }
    function showZip() {
        $(zipContainer).show()
    }
    $(startBtn).on('click', function () {
        hideIntro();
        showZip();
    });
    $(submitBtn).on('click', function () {
        var postalCode = $(zipInput).val().trim();
        localStorage.setItem("zip_code", postalCode);
        hideZip();
        showQuestions();
        // this calls the API to start
        getData();
    });    
    // Hide Zip until Start Button clicked to call showZip function
    hideZip();
    hideQuestions();
});
// These funtions show and hide different sets of information
function showQuestions() {
    $(questionContainer).show();
}
function hideQuestions() {
    $(questionContainer).hide();
}
// This funtion holds the restaurant data
function showRestaurant() {
    // This is for the generated restuarant to be displayed
    var displayContainer = document.createElement('div');
    $(displayContainer).attr('id', "display-container");
    var displayRestaurant = document.createElement('p');
    $(displayRestaurant).attr('id', "restaurant-name");
    var restaurantName = localStorage.getItem("Name");
    // if you are trying to style just the restaurant name use the class restaurant in this span
    displayRestaurant.innerHTML = "Your restaurant is:" + "<br/>" + `<span class="restaurant">${restaurantName}</span>`
    // This is a link for the address to link to directions to the restaurant
    var displayAddress = document.createElement('a');
    $(displayAddress).attr('id', "restaurant-address");
    var restaurantAddress = localStorage.getItem("Address");
    $(displayAddress).text(restaurantAddress);
    // This link calls and displays the map API
    $(displayAddress).on('click',function(){
        $(displayContainer).hide();
        getMap();
    })
    //This function is to hide the restaurant's address and display it on the map.
    //The user will see where the restaurant is located.
    var directionsButton = document.createElement('button');
    $(directionsButton).addClass("button is-link is-light");
    directionsButton.innerHTML = "MAP VIEW";
    body.append(displayContainer);
    displayContainer.appendChild(displayRestaurant);
    displayContainer.appendChild(displayAddress);
    displayContainer.appendChild(directionsButton);
    $(displayContainer).show();
    // This button calls and displays the map API
    $(directionsButton).on('click', function(){
        $(displayContainer).hide();
        getMap();
    });
}
// API for restuarants and menus by zip code
async function getData() {
    var zipCode = localStorage.getItem("zip_code");
    const api_url = `https://api.documenu.com/v2/restaurants/zip_code/${zipCode}?size=20&fullmenu=true&top_cuisines=false&key=8605e155e88b861cf10db384d0dfa34d`;
    const response = await fetch(api_url, {
        "method": "GET",
        "headers": {
            "x-api-key": "8605e155e88b861cf10db384d0dfa34d",
            "x-rapidapi-host": "documenu.p.rapidapi.com"
        }
    });
    const totalRestaurants = await response.json();
    // This loops through restaurants / gets the cuisines and puts them in buttons
    // Empty object to store like cuisines
    var cuisineList = {};
    // Empty array to store all cuisines
    var restCuisine = [];
    // This loops through available restaurants
    for (var i = 0; i < totalRestaurants.data.length; i++) {
        var currentRestaurant = totalRestaurants.data[i];
        restCuisine = restCuisine.concat(currentRestaurant.cuisines);
        // This prevents duplicate cuisines
        for (var z = 0; z < currentRestaurant.cuisines.length; z++) {
            if (currentRestaurant.cuisines[z] != '') {
                document.querySelector('#sine').innerHTML += `<button class="button cuisine">${currentRestaurant.cuisines[z]}</button>`;
            }
        }
    }
    // This will display the cuisine names for the cuisine object of restaurants onto the buttons
    for (cuisine in cuisineList) {
        document.querySelector('#sine').innerHTML += `<button class="cuisine">${cuisine}</button>`;
    }
    // This gets the selected cuisine
    $('.cuisine').on('click', function (e) {
        selectedCuisine(e.target.innerText);
        $('.cuisine').hide();
        hideQuestions();
        showRestaurant();
    });
    // This function get the information that matches the random restaurant / gets restaurant name and address
    function selectedCuisine(cuisine) {
        var chosenRestaurant = cuisineList[cuisine][Math.floor(Math.random() * cuisineList[cuisine].length)];
        // This stores restaurant info to be shown on page
        const restName = chosenRestaurant.restaurant_name;
        localStorage.setItem("Name", restName);
        const restAddress = chosenRestaurant.address.formatted;       
        localStorage.setItem("Address", restAddress);
    }
}
