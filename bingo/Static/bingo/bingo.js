"use strict";
//hello
let drawnNumbers = [];
let display, startTime, endTime, duration, interval, finalNumber, imageURL;
const lowerbound = 1;
const upperbound = 90;
let obj;

async function fetchData() {
    fetch("./api/data/numbers/")
        .then(response => response.json())
        .then(data => {
            data.forEach(number => {
                drawnNumbers.push(number.number);
            });
            startCycling();
        })
        .catch(error => console.error("Error fetching data:", error));
}

async function fetchObj() {
    return fetch("./api/data/numbers/" + finalNumber + "/")
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error("Error fetching data:", error));
}

async function postData(data, csrftoken) {
    await fetch("./api/data/numbers/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

async function startCycling() {
    display = document.querySelector(".image-container .image-text");
    duration = 4444; // miliseconds
    startTime = Date.now();
    endTime = startTime + duration;
    
    finalNumber = getUniqueRandomNumber();
    updateNumber();

    const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    postData({ number: finalNumber }, csrftoken);
    obj = await fetchObj();

    console.log(drawnNumbers);
    console.log(finalNumber);
}

function getUniqueRandomNumber() {
    let availableNumbers = [];
    for (let i = lowerbound; i <= upperbound; i++) {
        if (!drawnNumbers.includes(i)) {
            availableNumbers.push(i);
        }
    }
    if (availableNumbers.length === 0) {
        alert("All numbers have been drawn!");
        return;
    }
    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let number = availableNumbers[randomIndex];
    drawnNumbers.push(number);
    return number;
}

function getRandomNumber() {
    return Math.floor(Math.random() * upperbound) + 1;
}

function updateNumber() {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;
    let remainingTime = endTime - currentTime;
    let progress = elapsedTime / duration;

    if (remainingTime <= 0) {
        display.innerText = finalNumber;
        clearTimeout(interval);
        updateImage();
        updateBall();
    } else {
        display.innerText = getRandomNumber();
        let intervalTime = Math.pow(progress, 2) * 100; // slows down over time
        interval = setTimeout(updateNumber, intervalTime);
    }
}

function updateBall() {
    document.getElementById("ball_" + finalNumber).classList = "bingo-ball on";
}

function updateImage() {
    const image = document.querySelector(".image-container img");
    image.src = obj.url;
    image.alt = obj.text;
}

function start(event) {
    event.preventDefault();
    fetchData();
}

const button = document.querySelector(".button-container button");
button.addEventListener("click", start);


const wipe_form = document.getElementById("wipe_form_id");
wipe_form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const yes = confirm("If you click OK, all drawn numbers will be undrawn.\nAlso i get all fuzzy inside when you click me.\nIs that what you want?\nI don't mind, I'm just a button.\nAlthouth I do have feelings too, you know.\nFeelings for you.\nPress me, I'm yours.\nPress me all your want...\nPress me hard with the big cursor of yours.\nI'm ready and exposed, just for you");
    if (yes) {
        const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    await fetch("./api/data/numbers/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
    window.location.reload();
    } else {
        console.log("No wipe"); 
    }    
});