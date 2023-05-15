const forms = document.querySelectorAll("form");
// Here are all DOM elements you need
const valueInput = document.querySelector("#value");
const addBtn = document.querySelector(".add");
const table = document.querySelector("#item-list");

forms.forEach((form) =>
  form.addEventListener("submit", (e) => e.preventDefault())
);

let id = localStorage.getItem("id")
  ? JSON.parse(localStorage.getItem("id"))
  : 1;
const localStorageItems = JSON.parse(localStorage.getItem("items"));
let totalItems = localStorageItems ? localStorageItems : [];

// Reset id to 1 if there are no items in localStorage
if (totalItems.length === 0) {
  id = 1;
}
//add items to storage and array

const displayItems = (listItems) => {
  table.innerHTML = "";

  listItems.forEach((element) => {
    const row = document.createElement("tr");
    row.classList.add("text-center");
    const obj = JSON.stringify(element);
    row.innerHTML = ` 
        <td><div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input align-middle edit" id="customCheck${element.id}" data-index="${element.id}">
        <label class="custom-control-label" for="customCheck${element.id}"></label>
        </div></td>
        <td id="tditem${element.id}" >${element.key}</td>
        
        <td><button type="button" id=${obj} class="btn btn-primary edit" onclick="handleclick(this.id)">Edit</button></td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
    table.appendChild(row);
  });
};

function handleclick(ele) {
  const obj1 = JSON.parse(ele);
  const tditemID = document.querySelector(`#tditem${obj1.id}`);
  //   const key = obj1.key ? obj1.key : "  ";
  tditemID.innerHTML = `<input type="text"  onblur="editOnblur(this.value, ${obj1.id})" value=${obj1.key}>`;
}

function editOnblur(key, id) {
  console.log(key, id);
  const storagedata = JSON.parse(localStorage.getItem("items"));
  const newArray = storagedata.map((item) => {
    if (item.id === id) {
      return { ...item, key: key };
    } else {
      return item;
    }
  });
  localStorage.setItem("items", JSON.stringify(newArray));
  displayItems(newArray);
}

function addItem(element) {
  if (element.key === "") {
    showAlert("Please Enter the item", "success");
  } else {
    totalItems.push(element);

    localStorage.setItem("items", JSON.stringify(totalItems));
    localStorage.setItem("id", id);
  }
}

addBtn.addEventListener("click", () => {
  const inputItemName = valueInput.value;
  const inputItem = { id: id, key: inputItemName };
  addItem(inputItem);
  displayItems(totalItems);
  valueInput.value = "";
  showAlert("Item has been added", "success");
  id++;
});

document.querySelector("#item-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    // check if clicked element has class "delete"
    // console.log(e.target);
    deleteItem(e.target);
    showAlert("Item has been deleted", "danger");
  }
});

function deleteItem(button) {
  const itemRow = button.closest("tr"); // get the closest <tr> element
  const checkbox = itemRow.querySelector(".custom-control-input"); // get the checkbox element
  const itemIndex = checkbox.dataset.index; // get the index of the item in the array
  const allItems = JSON.parse(localStorage.getItem("items")); // accessing local storage
  console.log("itemIndex:", itemIndex);
  console.log("totalItems before:", allItems);
  if (checkbox.checked) {
    // check if the checkbox is checked
    // remove the item from the array
    const items = allItems.filter((item) => {
      return item.id != itemIndex;
    });
    // console.log("totalItems after:", items);
    // save the updated array to localStorage
    localStorage.setItem("items", JSON.stringify(items));
    // remove the item from the table
    itemRow.remove();
    // check if local storage is empty
    const itemsInLocalStorage = JSON.parse(localStorage.getItem("items"));
    console.log("itemsInLocalStorage:", itemsInLocalStorage);
    if (!itemsInLocalStorage || itemsInLocalStorage.length === 0) {
      // reset the value of id to 1
      id = 1;
      localStorage.setItem("id", id);
    }
    displayItems(items);
  }
}

function showAlert(message, classname) {
  const div = document.createElement("div");
  div.className = `alert  alert-${classname} col-12 text-center`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const form = document.querySelector("#list-form");
  let alert = document.querySelector(".alert");
  if (alert === null) {
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
}

displayItems(totalItems);
