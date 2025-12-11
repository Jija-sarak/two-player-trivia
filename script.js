let section = document.querySelector("section");
let errorMessage = document.getElementById("input-error-msg");
let firstPlayer = { id: "first-player-score", name: null, score: 0, turn: true };
let secondPlayer = { id: "second-player-score", name: null, score: 0, turn: false };
let selectedCategories = [];
let selectedCategory;
let questionsList = [];
let questionIndex = 0;


// fetch category from api and show on the UI 
async function getCategory() {
    try {
        const response = await fetch("https://the-trivia-api.com/v2/categories");

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        if (data.length === selectedCategories.length) {
            return true;
        }

        const categoryContainer = document.createElement("div");
        categoryContainer.setAttribute("id", "category-container")

        for (let categoryName in data) {
            const button = document.createElement("button")
            button.innerText = categoryName;
            button.classList.add("option");
            button.setAttribute("data-category", data[categoryName][0]);
            if (!selectedCategories.includes(categoryName)) {
                button.addEventListener("click", (e) => {
                    if (selectedCategory) {
                        selectedCategory.style.backgroundColor = "#b17d49";
                    }

                    selectedCategory = button;
                    selectedCategory.style.backgroundColor = "#9c9c9cff";
                });

            } else {
                button.disabled = true;
                button.style.backgroundColor = "#9c9c9cff"
            }

            categoryContainer.appendChild(button);
        }

        const playButton = document.createElement("button");
        playButton.setAttribute("id", "playBtn");
        playButton.innerText = "Play"

        playButton.addEventListener("click", async () => {
            questionsList = [];
            questionIndex = 0;

            selectedCategories.push(selectedCategory.innerText);

            //  Call getQuestions function three times with different difficulty level
            await getQuestions(selectedCategory.getAttribute("data-category"), "easy");
            await getQuestions(selectedCategory.getAttribute("data-category"), "medium");
            await getQuestions(selectedCategory.getAttribute("data-category"), "hard");

            // Calling showQuestion function with arguments question and its index.
            showQuestion(questionsList[questionIndex], questionIndex);
        });

        // remove content from the section 
        section.innerHTML = "<h2>Select a Category Below:</h2>";

        // Append category container containing categories and Play button to start the Game.
        section.appendChild(categoryContainer);
        section.appendChild(playButton)

    } catch (error) {
        section.innerHTML = `<p class="error-msg">Failed to load categories. " + ${error.message}</p>`;
    }
}


// Fetch questions from the api and push the data in questionList array
async function getQuestions(category, level) {
    section.innerHTML = "Loading...";

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
                    <p>${firstPlayer.name}</p>
                    <p  id="first-player-score" >Score: ${firstPlayer.score}</p>
                </div>
                <div class="card">
                    <p>${secondPlayer.name}</p>
                    <p id="second-player-score">Score: ${secondPlayer.score}</p>
                </div>
                <div class="card">
                    <p>Difficulty:</p>
                    <p>${question.difficulty}</p>
                </div>
                <div class="card">
                    <p>Turn:</p>
                    <p>${firstPlayer.turn ? firstPlayer.name : secondPlayer.name}</p>
                </div>
            </div>
            <div id="question-container">

                <h2>${question.question.text}</h2>
                <button class="options">${options[0]}</button>
                <button class="options">${options[1]}</button>
                <button class="options">${options[2]}</button>
                <button class="options">${options[3]}</button>
            </div>
            <button id="next-btn">Next</button>
            `;

    const optBtns = document.getElementsByClassName("options");

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
        });
    }

    document.getElementById("next-btn").addEventListener("click", () => {

        questionIndex++;

        if (firstPlayer.turn) {
            secondPlayer.turn = true;
            firstPlayer.turn = false;
        } else {
            secondPlayer.turn = false;
            firstPlayer.turn = true;
        }

        if (questionIndex < questionsList.length) {
            showQuestion(questionsList[questionIndex]);
        } else {
            section.innerHTML = "Loading...";
            showSummery();
        }
    });
}


function showSummery() {
    section.innerHTML = `
    <p id="show-result" ></p>
    <div id="summery">
                <div>
                    <i class="fa-solid fa-user"></i>
                    <h2>${firstPlayer.name}</h2>
                    <p>${firstPlayer.score}</p>
                </div>
                <div>
                    <i class="fa-solid fa-user"></i>
                    <h2>${secondPlayer.name}</h2>
                    <p>${secondPlayer.score}</p>
                </div>
            </div>
            <div id="btn">
                <button id="select-category-btn">Choose another category</button>
                <button id="select-end-btn" >End Game</button>
            </div>
            `
    section.style.justifyContent = "flex-start";
    document.getElementById("select-category-btn").addEventListener("click", () => {
        section.innerHTML = "Loading...";
        const result = getCategory();

        if (result) {
            showResult()
        }

    });

    document.getElementById("select-end-btn").addEventListener("click", () => {
        showResult()
    })
}

function showResult() {
    
    const selectBtns = document.getElementById("btn");
    selectBtns.parentNode.removeChild(selectBtns);

    const result = document.getElementById("show-result");

    if (firstPlayer.score > secondPlayer.score) {
        result.innerText = `🏆 Congratulations, ${firstPlayer.name} — you win! 🎉`
    } else if (firstPlayer.score < secondPlayer.score) {
        result.innerText = `🏆 Congratulations, ${secondPlayer.name} — you win! 🎉`
    } else {
        result.innerText = "It’s a tie! Well played both players.🤝"
    }

    result.style.display = "flex";
}

document.getElementById("player-one").addEventListener("input", (e) => {
    firstPlayer.name = e.target.value.trim();
});

document.getElementById("player-two").addEventListener("input", (e) => {
    secondPlayer.name = e.target.value.trim();
});

document.getElementById("continue-btn").addEventListener("click", () => {

    if (!(firstPlayer.name && secondPlayer.name)) {
        errorMessage.innerText = "Name cannot be empty.";
        errorMessage.style.display = "block";
    } else if (firstPlayer.name.length < 3 || secondPlayer.name.length < 3) {
        errorMessage.innerText = "Name must be at least 3 characters.";
        errorMessage.style.display = "block";
    } else {
        section.innerHTML = "Loading...";
        getCategory();
    }
});