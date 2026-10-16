const API_URL = "https://catfact.ninja/fact";
const ERROR_MSG = "Cat knocked the API off the table. Please try again.";

const factEL = document.querySelector("#fact");
const factBTN = document.querySelector("#new_fact");
const copyBTN = document.querySelector("#copy_fact");

let currentFact = null; // the real fact on screen (not "Loading..." or an error)
let nextFact = null; // prefetched fact, or null if we don't have one

async function fetchFact() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data.fact;
}

async function prefetch() {
  try {
    nextFact = await fetchFact();
  } catch (err) {
    console.error(err);
    nextFact = null;
  }
}

async function showFact() {
  factBTN.disabled = true;

  // No prefetched fact (first failure, or API was down): fetch now
  if (nextFact === null) {
    factEL.textContent = "Loading...";
    await prefetch();
  }

  // Still nothing: the API really is failing
  if (nextFact === null) {
    factEL.textContent = ERROR_MSG;
    currentFact = null;
    copyBTN.disabled = true;
    factBTN.disabled = false;
    return;
  }

  factEL.textContent = nextFact;
  currentFact = nextFact;
  copyBTN.disabled = false;
  nextFact = null;

  await prefetch(); // get the next one ready
  factBTN.disabled = false;
}

// Startup
factEL.textContent = "Try pressing the button below";
factBTN.disabled = true;
prefetch().then(() => {
  factBTN.disabled = false;
});

factBTN.addEventListener("click", showFact);
copyBTN.addEventListener("click", async () => {
  if (!currentFact) return;
  try {
    await navigator.clipboard.writeText(currentFact);
    copyBTN.textContent = "Copied!";
  } catch (err) {
    console.error(err);
    copyBTN.textContent = "Couldn't copy";
  }
  setTimeout(() => {
    copyBTN.textContent = "Copy fact";
  }, 1500);
});
