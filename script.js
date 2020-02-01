const numDice = document.getElementById("numDice");
const numDiceAlert = document.getElementById("numDiceAlert");
const successValue = document.getElementById("successValue");
const successValueAlert = document.getElementById("successValueAlert");
const nineAgain = document.getElementById("nineAgain");
const eightAgain = document.getElementById("eightAgain");
const rollDice = document.getElementById("rollDice");
const resetForm = document.getElementById("resetForm");
const resultsDiv = document.getElementById("results");

// Event listeners
nineAgain.addEventListener("click", toggleEightAgain);
rollDice.addEventListener("click", calculateRoll);
resetForm.addEventListener("click", resetToDefault);

function toggleEightAgain(e) {
    if (nineAgain.checked == true) {
        eightAgain.disabled = false;
    } else {
        eightAgain.checked = false;
        eightAgain.disabled = true;
    }
}

// Functions
function calculateRoll(e) {
    e.preventDefault();

    let numSuccesses = 0;
    const dc = successValue.value;

    // Validate form
    // Check number of dice
    if (!validateNumber(numDice.value, 1)) {
        numDiceAlert.classList.remove("d-none");
        return;
    } else {
        numDiceAlert.classList.add("d-none");
    }

    // Check if success value is number between 1 and 10
    if (!validateNumber(successValue.value, 1, 10)) {
        successValueAlert.classList.remove("d-none");
        return;
    } else {
        successValueAlert.classList.add("d-none");
    }

    const numRolls = numDice.value;
    const rolls = [];

    // Always reroll a 10, but check to see if 8 again or 9 again is checked
    let rollAgainValue;
    if (nineAgain.checked && eightAgain.checked) {
        rollAgainValue = 8;
    } else if (nineAgain.checked) {
        rollAgainValue = 9;
    } else {
        rollAgainValue = 10;
    }

    for (let i = 0; i < numRolls; i++) {
        let currentRoll = singleRoll(1, 10);

        if (currentRoll < rollAgainValue) {
            if (currentRoll >= dc) numSuccesses++;
            rolls.push(currentRoll);
            continue;
        } else {
            const currentRollSet = [];

            if (currentRoll >= dc) numSuccesses++;

            // Get single roll
            currentRollSet.push(currentRoll);

            // Roll again while currentRoll >= rollAgainValue
            while (currentRoll >= rollAgainValue) {
                currentRoll = singleRoll(1, 10);
                if (currentRoll >= dc) numSuccesses++;
                currentRollSet.push(currentRoll);
            }

            // Add values to rolls array
            rolls.push(currentRollSet);
        }
    }

    showResults(rolls, numSuccesses);
}

function showResults(rolls, numSuccesses) {
    // Reset results div
    resultsDiv.innerHTML = "";

    // Create results display
    const resultsCardBody = document.createElement("div");
    resultsCardBody.setAttribute("class", "card-body");

    const resultsCardTitle = document.createElement("h2");
    resultsCardTitle.setAttribute("class", "card-title text-center");
    resultsCardTitle.textContent = `${numSuccesses} Successes`;

    resultsCardBody.appendChild(resultsCardTitle);

    let counter = 1;

    rolls.forEach(roll => {
        const resultRow = document.createElement("div");
        resultRow.setAttribute("class", "row");

        const resultRowTitle = document.createElement("div");
        resultRowTitle.setAttribute("class", "col-sm-4");
        resultRowTitle.textContent = `Die ${counter}:`;

        const resultRowData = document.createElement("div");
        resultRowData.setAttribute("class", "col-sm-8");

        if (typeof roll === "object") {
            const rollHTMLArray = [];
            let rollClass;
            roll.forEach(r => {
                if (r >= successValue.value) {
                    rollClass = "text-success";
                } else {
                    rollClass = "text-danger";
                }

                rollHTMLArray.push(`<span class="${rollClass}">${r}</span>`);
            });

            const compoundResult = document.createElement("span");
            compoundResult.innerHTML = rollHTMLArray.join(" &raquo; ");
            resultRowData.appendChild(compoundResult);
        } else {
            const singleResult = document.createElement("span");
            if (roll >= successValue.value) {
                singleResult.setAttribute("class", "text-success");
            } else {
                singleResult.setAttribute("class", "text-danger");
            }
            singleResult.textContent = roll;
            resultRowData.appendChild(singleResult);
        }

        resultRow.appendChild(resultRowTitle);
        resultRow.appendChild(resultRowData);
        resultsCardBody.appendChild(resultRow);

        counter++;
    });

    resultsDiv.appendChild(resultsCardBody);
}

function resetToDefault(e) {
    e.preventDefault();
    numDice.value = 1;
    successValue.value = 1;
    nineAgain.checked = false;
    eightAgain.checked = false;
    eightAgain.disabled = true;
    resultsDiv.innerHTML = "";
}

function isNumeric(value) {
    return /^(0|[1-9]*)$/.test(value);
}

function validateNumber(value, min, max = null) {
    const convertedValue = Number(value);

    if (!Number.isInteger(convertedValue)) {
        console.log("not numeric");
        return false;
    }

    if (max) {
        return convertedValue >= min && convertedValue <= max;
    } else {
        return convertedValue >= min;
    }
}

function singleRoll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
