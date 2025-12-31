let section = document.querySelector("section");
let errorMessage = document.getElementById("input-error-msg");
let firstPlayer = { id: "first-player-score", name: null, score: 0, turn: true };
let secondPlayer = { id: "second-player-score", name: null, score: 0, turn: false };

let categories;
let roundNumber = 0;
let selectedCategories = [];
let selectedCategory;
let questionsList = [];
let questionIndex = 0;

// fetch category from api and store it in categories variable
async function getCategory() {
    try {
        const response = await fetch("https://the-trivia-api.com/v2/categories");

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();
        categories = data;

    } catch (error) {
        section.innerHTML = `<p class="error-msg">Failed to load categories. " + ${error.message}</p>`;
    }

}

// Fetch questions from the api and push the data in questionList array
async function getQuestions(category, level) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=${level}&limit=2`);

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();
        questionsList.push(...data);
        return;

    } catch (error) {
        section.innerHTML = `<p class="error-msg">Failed to load question. " + ${error.message}</p>`;
    }
}

// Show categories on the UI
function showCategory(data) {

    const categoryContainer = document.createElement("div");
    categoryContainer.setAttribute("id", "category-container");

    for (let categoryName in data) {

        if (!selectedCategories.includes(categoryName)) {
            const button = document.createElement("button");
            button.innerText = categoryName;
            button.classList.add("option");
            button.setAttribute("data-category", data[categoryName][0]);

            button.addEventListener("click", () => {
                if (selectedCategory) {
                    selectedCategory.style.backgroundColor = "#b17d49";
                }

                selectedCategory = button;
                selectedCategory.style.backgroundColor = "#9c9c9cff";
                playButton.disabled = false;

            });

            categoryContainer.appendChild(button);
        }
    }

    const playButton = document.createElement("button");
    playButton.setAttribute("id", "playBtn");
    playButton.innerText = "Start Round";
    playButton.disabled = true;

    playButton.addEventListener("click", async () => {

        section.innerHTML = "Loading...";

        questionsList = [];
        questionIndex = 0;

        selectedCategories.push(selectedCategory.innerText);

        //  Call getQuestions function three times with different difficulty level
        await getQuestions(selectedCategory.getAttribute("data-category"), "easy");
        await getQuestions(selectedCategory.getAttribute("data-category"), "medium");
        await getQuestions(selectedCategory.getAttribute("data-category"), "hard");

        // Calling showQuestion function with arguments question and its index.
        showQuestion(questionsList[questionIndex]);
    });

    // remove content from the section 
    section.innerHTML = `<h2>Round: ${roundNumber += 1}</h2>
    <h2>Select a Category Below:</h2>`;

    // Append category container containing categories and Play button to start the Game.
    section.appendChild(categoryContainer);
    section.appendChild(playButton);
}


// Display the question and score cards on the UI and logic for checking the answer and updating score, turn, etc.
async function showQuestion(question) {

    const correctAnswer = question.correctAnswer;
    const options = [question.correctAnswer, ...question.incorrectAnswers];

    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    let correctAnswerOption;

    section.innerHTML = `<div id="score-turn-level">
                <div class="card">
                    <p>Round:</p>
                    <p>${roundNumber}</p>
                </div>
                <div class="card">
                    <p>Category:</p>
                    <p>${selectedCategories[selectedCategories.length - 1]}</p>
                </div>
                <div class="card">
                    <p>Difficulty:</p>
                    <p>${question.difficulty}</p>
                </div>
                <div class="card">
                    <p>Turn:</p>
                    <p>${firstPlayer.turn ? firstPlayer.name : secondPlayer.name}</p>
                </div>
                <div class="card">
                    <p>${firstPlayer.name}'s</p>
                    <p  id="first-player-score" >Score: ${firstPlayer.score}</p>
                </div>
                <div class="card">
                    <p>${secondPlayer.name}'s</p>
                    <p id="second-player-score">Score: ${secondPlayer.score}</p>
                </div>
                
            </div>
            <div id="question-container">

                <h2>${question.question.text}</h2>
                <button class="options">${options[0]}</button>
                <button class="options">${options[1]}</button>
                <button class="options">${options[2]}</button>
                <button class="options">${options[3]}</button>
            </div>
            <button id="next-btn" disabled >Next</button>
            `;


    const optBtns = document.getElementsByClassName("options");
    const nextBtn = document.getElementById("next-btn");

    if (questionIndex === (questionsList.length - 1)) {
        nextBtn.parentNode.removeChild(nextBtn);
    }

    for (let i = 0; i < optBtns.length; i++) {

        optBtns[i].style.backgroundColor = " #442b2b6e";
        optBtns[i].style.color = "white";

        if (optBtns[i].innerText === question.correctAnswer) {
            correctAnswerOption = optBtns[i];
        }

        optBtns[i].addEventListener("click", (e) => {

            if (e.target.innerText === correctAnswer) {

                e.target.style.backgroundColor = "#80f364ff";

                if (question.difficulty === "easy") {
                    firstPlayer.turn ? firstPlayer.score += 10 : secondPlayer.score += 10;
                } else if (question.difficulty === "medium") {
                    firstPlayer.turn ? firstPlayer.score += 15 : secondPlayer.score += 15;
                } else {
                    firstPlayer.turn ? firstPlayer.score += 20 : secondPlayer.score += 20;
                }

                if (firstPlayer.turn) {
                    document.getElementById(firstPlayer.id).innerText = `Score: ${firstPlayer.score}`;
                } else {
                    document.getElementById(secondPlayer.id).innerText = `Score: ${secondPlayer.score}`;
                }

            } else {
                e.target.style.backgroundColor = "#ff4f4fff";
                correctAnswerOption.style.backgroundColor = "#80f364ff";
            }

            if (questionIndex === (questionsList.length - 1)) {
                section.innerHTML = "Loading...";
                showSummery();
            } else {
                nextBtn.disabled = false;
            }

            for (let j = 0; j < optBtns.length; j++) {
                optBtns[j].disabled = true;
            }

        });
    }

    nextBtn.addEventListener("click", () => {

        questionIndex++;

        if (firstPlayer.turn) {
            secondPlayer.turn = true;
            firstPlayer.turn = false;
        } else {
            secondPlayer.turn = false;
            firstPlayer.turn = true;
        }

        showQuestion(questionsList[questionIndex]);

    });
}

// Shows scores and next steps
function showSummery() {
    section.innerHTML = `
        <p id="result"></p>
        <div id="show-result" ></div>
        <div id="btn">
            <button id="select-category-btn">Next Round</button>
            <button id="select-end-btn" >End Game</button>
        </div>
        `
    if (Object.keys(categories).length === selectedCategories.length) {
        document.getElementById("select-category-btn").disabled = true;

    } else {
        section.style.justifyContent = "flex-start";
        document.getElementById("select-category-btn").addEventListener("click", () => {
            section.innerHTML = "Loading...";
            showCategory(categories);
        });
    }

    document.getElementById("select-end-btn").addEventListener("click", () => {
        showResult();
    });

}

// Show result
function showResult() {

    const selectBtns = document.getElementById("btn");
    selectBtns.parentNode.removeChild(selectBtns);

    document.getElementById("show-result").innerHTML = `<div id="summery">
                <div>
                    <i class="fa-solid fa-user"></i>
                    <h2>${firstPlayer.name}'s</h2>
                    <p>Score: ${firstPlayer.score}</p>
                </div>
                <div>
                    <i class="fa-solid fa-user"></i>
                    <h2>${secondPlayer.name}'s</h2>
                    <p>Score: ${secondPlayer.score}</p>
                </div>
                </div>`;

    const result = document.querySelector("#result");

    if (firstPlayer.score > secondPlayer.score) {

        result.innerText = `🏆 Congratulations, ${firstPlayer.name} — you win! 🎉`

    } else if (firstPlayer.score < secondPlayer.score) {

        result.innerText = `🏆 Congratulations, ${secondPlayer.name} — you win! 🎉`

    } else {

        result.innerText = "It’s a tie! Well played both players.🤝"

    }

    result.style.display = "flex";
}

// Store first player name as he types in firstPlayer object's name property.
document.getElementById("player-one").addEventListener("input", (e) => {
    firstPlayer.name = e.target.value.trim();
});

// Store second player name when he types in secondPlayer object's name property.
document.getElementById("player-two").addEventListener("input", (e) => {
    secondPlayer.name = e.target.value.trim();
});

// Validate names of both user's and if incorrect show error message else call getCategory and showCaegory functions
document.getElementById("continue-btn").addEventListener("click", async () => {

    if (!(firstPlayer.name && secondPlayer.name)) {

        errorMessage.innerText = "Name cannot be empty.";
        errorMessage.style.display = "block";

    } else if (firstPlayer.name.length < 3 || secondPlayer.name.length < 3) {

        errorMessage.innerText = "Name must be at least 3 characters.";
        errorMessage.style.display = "block";

    } else if (firstPlayer.name.toLowerCase() === secondPlayer.name.toLowerCase()) {
        errorMessage.innerText = "Usernames must be unique. Please choose a different username.";
        errorMessage.style.display = "block";
    } else {

        section.innerHTML = "Loading...";
        await getCategory();
        showCategory(categories);

    }
});