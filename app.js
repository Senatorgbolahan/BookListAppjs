// UI variables

let title = document.querySelector('#title')
let author = document.getElementById('author')
let isbn = document.querySelector('#isbn')
let form = document.querySelector("#book-form")
let submitBtn = document.querySelector(".submit-btn");
let list = document.querySelector('.table-width')
const alert = document.querySelector(".alert");
const clearBtn = document.querySelector(".clear-btn");




form.addEventListener('submit', submitData) // submit form
clearBtn.addEventListener('click', clearItems) //clear items
window.addEventListener('DOMContentLoaded', setUpItem) //setup items



let myTitle;
let myAuthor;
let myISBN;
let editID = "";
let editFlag = false;
let row;
let value;

let element;
let editElement;
let editTitleElement;
let editAuthorElement;
let si_ibn;
let editISBNElement;

// **************************** FUNCTIONS ************************************
function submitData(e) {
    e.preventDefault();

    const id = new Date().getTime().toString();
    myTitle = title.value;
    myAuthor = author.value;
    myISBN = isbn.value;

    if (myTitle && myAuthor && myISBN && !editFlag) {

        createListItem(id, myTitle, myAuthor, myISBN);
        displayAlert("item added to the list", "success")
            // add to local storage
        addToLocalStorage(id, myTitle, myAuthor, myISBN)
        setBackToDefault() //set back to default

    } else if (myTitle && myAuthor && myISBN && editFlag) {
        editAuthorElement.innerHTML = myTitle;
        editTitleElement.innerHTML = myAuthor
        editISBNElement.innerHTML = myISBN;
        displayAlert("Value changed", "success")
        editLocalStorage(editID, myTitle, myAuthor, myISBN) //edit local storage
        setBackToDefault() //set back to default
    } else {
        displayAlert('please enter value', 'danger')
    }
}

// delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    console.log(id);

    list.removeChild(element)
    displayAlert("Item removed", "danger")
    setBackToDefault();
    removeFromLocalStorage(id)

}
// edit function
function editItem(e) {

    const element = e.currentTarget.parentElement.previousElementSibling;
    const myElement = e.currentTarget.parentElement.parentElement;
    const elementID = e.currentTarget.parentElement.parentElement;
    editTitleElement = element.previousElementSibling;
    editAuthorElement = editTitleElement.previousElementSibling;
    editISBNElement = editTitleElement.nextElementSibling;

    console.log(editAuthorElement);
    console.log(editISBNElement);
    console.log(editTitleElement);

    // set form value
    title.value = editAuthorElement.innerHTML
    author.value = editTitleElement.innerHTML
    isbn.value = editISBNElement.innerHTML
    editID = elementID.dataset.id;
    editFlag = true;
    submitBtn.textContent = "Edit"


    // // set edit item
    // const elementID = e.currentTarget.parentElement.parentElement;
    // myEditElement1 = element.previousElementSibling;
    // myEditElement2 = myEditElement1.previousElementSibling;
    // myEditElement3 = myEditElement1.nextElementSibling;
    // // set form value
    // locationL.value = myEditElement1.innerHTML;
    // n_ame.value = myEditElement2.innerHTML;
    // myEditFlag = true;
    // myEditID = elementID.dataset.id;
    // submitBtn.textContent = "Edit"
}

// display alert 
function displayAlert(text, action) {
    // add alert
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}

function clearItems() {
    let items = document.querySelectorAll(".table-width");

    if (items.length > 0) {
        items.forEach(function(item) {
            list.remove(item)
        })
    }
    displayAlert("Empty list", "danger")
    setBackToDefault() //set back to default
    localStorage.removeItem("book")
}

function setBackToDefault() {
    title.value = ""
    author.value = ""
    isbn.value = ""
    editFlag = false;
    editID = ""
    submitBtn.textContent = "Submit"
}


// **************************** LOCAL STORAGE ************************************
function addToLocalStorage(id, myTitle, myAuthor, myISBN) {
    const book = {
        id: id,
        myTitle: myTitle,
        myAuthor: myAuthor,
        myISBN: myISBN
    }
    let items = getLocalStorage()

    items.push(book)
    localStorage.setItem("book", JSON.stringify(items)) //save to local storage
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("book", JSON.stringify(items)) //save to local storage
}

function editLocalStorage(id, myTitle, myAuthor, myISBN) {
    let items = getLocalStorage();

    items = items.map(function(item) {
        if (item.id === id) {
            item.myTitle = myTitle;
            item.myAuthor = myAuthor;
            item.myISBN = myISBN;

        }
        return item;
    });
    localStorage.setItem("book", JSON.stringify(items)) //save to local storage
}

function getLocalStorage() {
    return localStorage.getItem("book") ? JSON.parse(localStorage.getItem("book")) : []
}


function setUpItem() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(item => {
            createListItem(item.id, item.myTitle, item.myAuthor, item.myISBN)
        });
    }
}


// **************************** SETUP ITEMS ************************************

function createListItem(id, myTitle, myAuthor, myISBN) {
    //Create tr element
    row = document.createElement('tr');
    // add id
    let attr = document.createAttribute('data-id')
    attr.value = id;
    row.setAttributeNode(attr)

    // Insert row
    row.innerHTML = `
          <td>${myTitle}</td>
          <td>${myAuthor}</td>
          <td>${myISBN}</td>
          <td><button type="button" class="edit-btn"><i class="fas fa-edit"></i></button></td>
          <td><button type="button" class="delete-btn"><i class="fas fa-trash"></i></button></td>
          `;

    // accessing the edit-btn class 
    const editBtn = row.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)

    // accessing the delete-btn class
    const deleteBtn = row.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)


    list.appendChild(row);
}