// Onload functions
fetchAndRenderDogs();
initMouseUpEvents();

// Event Handling
function initMouseUpEvents() {
  const filterDogButton = document.getElementById("good-dog-filter");
  const dogBar = document.getElementById("dog-bar");
  const dogContainer = document.getElementById("dog-summary-container");

  filterDogButton.addEventListener("mouseup", toggleGoodDogFilter);
  dogBar.addEventListener("mouseup", dogBarMouseUp);
  dogContainer.addEventListener("mouseup", dogContainerMouseUp);
}

function toggleGoodDogFilter(event) {
  const dogFilterButton = event.target;
  dogFilterButton.dataset.filter = +dogFilterButton.dataset.filter ? "0" : "1";
  const filter = +dogFilterButton.dataset.filter;

  const dogBar = document.getElementById("dog-bar");
  filter ? hideBadDogs(dogBar) : showAllDogs(dogBar);

  updateDogFilterButton(dogFilterButton, filter);
}

function dogBarMouseUp(event) {
  if (event.target.matches("#dog-bar > span")) {
    displayDog(event.target.dataset.dogId);
  }
}

function dogContainerMouseUp(event) {
  if (event.target.matches(".dog-button")) {
    toggleDogButton(event.target);
  }
}

function toggleDogButton(dogButton) {
  const isGoodDog = !+dogButton.dataset.isGoodDog;

  patchGoodDog(dogButton.dataset.dogId, isGoodDog);
  updateGoodDogButton(dogButton, isGoodDog);
}

// Update DOM functions
function renderDogs(dogs) {
  for (dog of dogs) {
    renderDogToDogBar(dog);
    renderDogToDogContainer(dog);
  }

  displayDog(dogs[0].id);
}

function renderDogToDogBar(dog) {
  const dogBar = document.getElementById("dog-bar");

  const dogSpan = document.createElement("span");
  dogSpan.dataset.dogId = dog.id;
  dogSpan.dataset.isGoodDog = dog.isGoodDog ? "1" : "0";

  dogSpan.textContent = dog.name;

  dogBar.appendChild(dogSpan);
}

function renderDogToDogContainer(dog) {
  const dogContainer = document.getElementById("dog-summary-container");

  const dogDiv = document.createElement("div");
  dogDiv.dataset.dogId = dog.id;
  dogDiv.dataset.isGoodDog = dog.isGoodDog ? "1" : "0";
  dogDiv.classList.add("dog-info");
  dogDiv.classList.add("hidden");

  dogDiv.innerHTML = `
    <img src="${dog.image}"></img>
    <h1>${dog.name}</h2>
    <button class="dog-button" data-is-good-dog="${
      dog.isGoodDog ? 1 : 0
    }" data-dog-id="${dog.id}">${renderIsGoodDog(dog.isGoodDog)}</button>
  `;

  dogContainer.appendChild(dogDiv);
}

function renderIsGoodDog(isGoodDog) {
  if (isGoodDog === "false") {
    isGoodDog = false;
  }
  return isGoodDog ? "Good Dog!" : "Bad Dog!";
}

function updateDogFilterButton(dogFilterButton, filter) {
  dogFilterButton.textContent = `Filter Good Dogs: ${filter ? "ON" : "OFF"}`;
}

function updateGoodDogButton(dogButton, isGoodDog) {
  dogButton.dataset.isGoodDog = isGoodDog ? 1 : 0;

  dogButton.textContent = renderIsGoodDog(isGoodDog);
}

function hideBadDogs(dogBar) {
  const dogNodes = dogBar.childNodes;

  for (let i = 0; i < dogNodes.length; i++) {
    let dogNode = dogNodes[i];
    if (!+dogNode.dataset.isGoodDog && !dogNode.classList.contains("hidden")) {
      dogNode.classList.add("hidden");
    }
  }
}

function showAllDogs(dogBar) {
  const dogNodes = dogBar.childNodes;

  for (let i = 0; i < dogNodes.length; i++) {
    const dogNode = dogNodes[i];
    if (dogNode.classList.contains("hidden")) {
      dogNode.classList.remove("hidden");
    }
  }
}

function displayDog(dogId) {
  const dogContainer = document.getElementById("dog-summary-container");
  const dog = document.querySelector(`div.dog-info[data-dog-id="${dogId}"]`);

  if (!!dogContainer.dataset.dogId) {
    hideDog(dogContainer.dataset.dogId);
  }

  dogContainer.dataset.dogId = dogId;
  displayElement(dog);
}

function hideDog(dogId) {
  const dog = document.querySelector(`div.dog-info[data-dog-id="${dogId}"]`);

  hideElement(dog);
}

function displayElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

// API call functions
function fetchAndRenderDogs() {
  fetchDogs().then(renderDogs);
}

function fetchDogs() {
  return fetch("http://localhost:3000/pups").then((resp) => resp.json());
}

function patchGoodDog(dogId, isGoodDog) {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ isGoodDog: !!isGoodDog ? "true" : "false" }),
  };

  fetch(`http://localhost:3000/pups/${dogId}`, configObj)
    .then((resp) => resp.json())
    .catch(console.log);
}
