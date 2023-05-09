import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// the URl to my database
const appSettings = {
  databaseURL:
    "https://playground-2806b-default-rtdb.europe-west1.firebasedatabase.app/",
};

const inputFieldEl = document.querySelector("#input-field");
const addButtonEl = document.querySelector("#add-button");
const shoppingListEL = document.querySelector(".shopping-list");

// initializes the app and connects it with the project in Firebase DB
const app = initializeApp(appSettings);
const database = getDatabase(app);

// ref gets 2 arguments: 1st - which DB are we working with, 2nd - what the reference should be called
const shoppingListInDB = ref(database, "shoppingList");

const clearShoppingListEl = () => {
  shoppingListEL.innerHTML = "";
};

const renderList = (itemValue) => {
  const listItem = `<li>${itemValue}</li>`;
  shoppingListEL.insertAdjacentHTML("beforeend", listItem);
};

// reads static snapshots of the contents whenever DB changes. 1st arg - DB ref from where we're fetching the data, 2nd - is the snapshot callback, that gets a snapshot of DB collection
onValue(shoppingListInDB, (snapshot) => {
  clearShoppingListEl();

  // val() extracts the contents of the snapshot
  if (!snapshot.val()) return;

  let shoppingItems = Object.values(snapshot.val());
  shoppingItems.forEach((item) => renderList(item));
});

const resetInputField = () => {
  inputFieldEl.value = "";
};

const addItemToDB = () => {
  let inputValue = inputFieldEl.value.trim();

  // pushes input value to DB. 1st - the reference name, 2nd - input value
  push(shoppingListInDB, inputValue);
  resetInputField();
};

const onEnterKey = (e) => {
  if (e.keyCode !== 13) return;
  addItemToDB();
  inputFieldEl.blur();
};

addButtonEl.addEventListener("click", addItemToDB);
window.addEventListener("keydown", onEnterKey);
