const API_URL = "https://catfact.ninja/fact";

const factEL = document.querySelector("#fact");
const factBTN = document.querySelector("#new_fact");

async function fetchFact() {
  const respond = await fetch(API_URL);
  if (!respond.ok) throw new Error(`HTTP ${respond.status}`);
  const data = await respond.json();
  return data.fact;
}

async function showFact() {
  factBTN.disabled = true;
  factEL.textContent = "Loading...";
  try {
    factEL.textContent = await fetchFact();
  } catch (err) {
    console.error(err);
    factEL.textContent = "Cat knocked the API off the table. Please try again.";
  } finally {
    factBTN.disabled = false;
  }
}

factBTN.addEventListener("click", showFact);
showFact();
