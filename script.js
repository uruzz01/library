// const libraryContainer = document.querySelector(".library_container");

const addNewBookBtn = document.querySelector(".add_new_book_btn");
const cancelBtn = document.querySelector(".cancel_btn");
const modal = document.querySelector(".modal");
const newBookFormBtn = document.querySelector(".new_book_form_btn");
const usersAuthor = document.querySelector("#users_author");
const usersBook = document.querySelector("#users_book");
const userPages = document.querySelector("#user_pages");
const userRead = document.querySelector("#user_read");

let myLibrary = [];

addNewBookBtn.addEventListener("click", () => {
    openModal();
});

newBookFormBtn.addEventListener("click", () => {
    addBookToLibrary();
    closeModal();
    displayBook(myLibrary);
});

cancelBtn.addEventListener("click", () => {
    closeModal();
});

function openModal() {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
}

function closeModal() {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

function addBookToLibrary() {
    let bookVal = usersBook.value;
    let authorValue = usersAuthor.value;
    let pagesVal = userPages.value;
    let readValue = userRead.checked ? "finished" : "not finished yet";
    myLibrary.push(new Book(bookVal, authorValue, pagesVal, readValue));

    addBookToLocalStor();
    console.log(myLibrary);
}

function addBookToLocalStor() {
    if (localStorage.hasOwnProperty("myLibrary")) {
        let localStorageLibArr = JSON.parse(window.localStorage.getItem("myLibrary"));
        localStorageLibArr.push(myLibrary.at(-1));

        localStorage.setItem("myLibrary", JSON.stringify(localStorageLibArr));
    } else {
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
        return;
    }
}

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function displayBook(arr) {
    const libraryСontainer = document.querySelector(".library_container");

    const bookCard = document.createElement("div");
    const deleteCardBtn = document.createElement("button");
    const authorSection = document.createElement("div");
    const titleSection = document.createElement("div");
    const pagesSection = document.createElement("div");
    const finishSection = document.createElement("div");

    let authorCard = document.createElement("p");
    let authorLabel = document.createElement("label");

    let titleCard = document.createElement("p");
    let titleLabel = document.createElement("label");

    let pagesCard = document.createElement("p");
    let pagesLabel = document.createElement("label");

    let finishCard = document.createElement("div");
    let finishLabel = document.createElement("label");
    let finishCheckbox = document.createElement("input");

    bookCard.classList.add("book_card");
    if (arr == myLibrary) {
        bookCard.dataset.index = arr.indexOf(arr.at(-1));
    }

    deleteCardBtn.classList.add("delete_card_btn");
    deleteCardBtn.innerHTML =
        '<img src="icons/book-remove.svg" class="book_remove" alt="delete" />';

    authorSection.classList.add("author_section");
    titleSection.classList.add("title_section");
    pagesSection.classList.add("pages_section");
    finishSection.classList.add("finish_section");

    authorCard.classList.add("authorCard");
    authorCard.setAttribute("id", "authorCard");
    if (arr == myLibrary) {
        authorCard.innerText = arr.at(-1).author;
    } else {
        authorCard.innerText = arr.author;
    }
    authorLabel.setAttribute("for", "authorCard");
    authorLabel.innerText = "Author:";

    titleCard.classList.add("titleCard");
    titleCard.setAttribute("id", "titleCard");
    if (arr == myLibrary) {
        titleCard.innerText = arr.at(-1).title;
    } else titleCard.innerText = arr.title;
    titleLabel.setAttribute("for", "titleCard");
    titleLabel.innerText = "Books title:";

    pagesCard.classList.add("pagesCard");
    pagesCard.setAttribute("id", "pagesCard");
    if (arr == myLibrary) {
        pagesCard.innerText = arr.at(-1).pages;
    } else pagesCard.innerText = arr.pages;
    pagesLabel.setAttribute("for", "pagesCard");
    pagesLabel.innerText = "Pages Amount:";

    finishCard.classList.add("finishCard");
    finishCard.setAttribute("id", "finishCard");
    if (arr == myLibrary) {
        finishCard.innerText = arr.at(-1).read;
    } else finishCard.innerText = arr.read;
    finishLabel.setAttribute("for", "finishCard");
    finishLabel.innerText = "Book finished:";

    finishCheckbox.setAttribute("type", "checkbox");
    finishCheckbox.classList.add("finish_checkbox");

    if (finishCard.innerText === "not finished yet") {
        bookCard.classList.add("unread");
    } else {
        finishCheckbox.checked = true;
    }

    libraryСontainer.appendChild(bookCard);

    bookCard.append(deleteCardBtn, authorSection, titleSection, pagesSection, finishSection);

    authorSection.append(authorLabel, authorCard);
    titleSection.append(titleLabel, titleCard);
    pagesSection.append(pagesLabel, pagesCard);
    finishSection.append(finishLabel, finishCheckbox, finishCard);

    //////////////////////////////////////////////////
    deleteCardBtn.addEventListener("click", () => {
        let el = deleteCardBtn.nextElementSibling;
        let localStorageLib = JSON.parse(window.localStorage.getItem("myLibrary"));

        let currentBookObj = {};

        while (el) {
            if (el.hasChildNodes) {
                console.log(el.lastChild.innerText);
                if (el.lastChild.classList.contains("titleCard")) {
                    currentBookObj.title = el.lastChild.innerText;
                }
                if (el.lastChild.classList.contains("authorCard")) {
                    currentBookObj.author = el.lastChild.innerText;
                }
                if (el.lastChild.classList.contains("pagesCard")) {
                    currentBookObj.pages = el.lastChild.innerText;
                }
                if (el.lastChild.classList.contains("finishCard")) {
                    currentBookObj.read = el.lastChild.innerText;
                }
                el = el.nextElementSibling;
            }
        }

        console.log(currentBookObj);

        for (let i = 0; i < localStorageLib.length; i++) {
            if (hasSameDataObj(localStorageLib[i], currentBookObj)) {
                console.log("same data");

                localStorageLib.splice(localStorageLib.indexOf(i), 1);
                console.log(localStorageLib);
                break;
            }
        }

        deleteCardBtn.parentNode.remove();

        parsePage();
    });
    ///////////////////////////////////////////////////
    finishCheckbox.addEventListener("change", function () {
        let currentBookCard = this.parentNode.parentNode;
        if (this.checked) {
            currentBookCard.classList.remove("unread");
            this.nextElementSibling.innerText = "finished";
        } else {
            currentBookCard.classList.add("unread");
            this.nextElementSibling.innerText = "not finished yet";
        }
        parsePage();
    });
}

function parsePage() {
    let parsedPageArr = [];

    let books = document.querySelectorAll(".book_card");

    for (let i = 0; i < books.length; i++) {
        let bookVal = books[i].children[2].children[1].innerText;
        let authorValue = books[i].children[1].children[1].innerText;
        let pagesVal = books[i].children[3].children[1].innerText;
        let readValue = books[i].children[4].children[2].innerText;
        parsedPageArr.push(new Book(bookVal, authorValue, pagesVal, readValue));
    }

    console.log(parsedPageArr);

    window.localStorage.setItem("myLibrary", JSON.stringify(parsedPageArr));
}

function hasSameDataObj(obj1, obj2) {
    let obj1Keys = Object.keys(obj1);

    if (obj1Keys.length === Object.keys(obj2).length) {
        return obj1Keys.every((key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]);
    }
    return;
}

function displayLibrary() {
    if (!localStorage.hasOwnProperty("myLibrary")) {
        return;
    }

    let localStorageLibArr = JSON.parse(window.localStorage.getItem("myLibrary"));

    console.log(localStorageLibArr);

    for (let i = 0; i < localStorageLibArr.length; i++) {
        displayBook(localStorageLibArr[i]);
    }
}

displayLibrary();
