const library = JSON.parse(localStorage.getItem("library"));
const table = document.querySelector("table.library tbody");
const addBookModal = document.querySelector(".form.modal");
const blurred = document.querySelector(".blur");
const addBookButton = document.querySelector("header button.add");
const searchField = document.querySelector("input[type='search'");

writeTable();

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    if (this.read) {
        this.read = false;
    } else this.read = true;
}

function showModal() {
    addBookModal.classList.add("active");
    blurred.classList.add("active");
    document.querySelector("form input:first-of-type").focus();
}

function hideModal() {
    addBookModal.classList.remove("active");
    blurred.classList.remove("active");
    clearForm();
    document.querySelectorAll("form input").forEach(input => {
        input.blur();
    });
}

function addBookToLibrary() {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const read = document.querySelector("#read").checked;

    const newBook = new Book(title, author, pages, read);
    library.push(newBook);
    putLocal();
}

function clearForm() {
    document.querySelectorAll("form input:not([type='checkbox']").forEach(input => {
        input.value = "";
    });
    document.querySelector("form input[type='checkbox']").checked = false;
}

document.querySelector("form.add-book").addEventListener("submit", (e) => {
    e.preventDefault();
    addBookToLibrary();
    updateTable(library.length - 1);
    hideModal();
    clearForm();
});

addBookButton.addEventListener("click", () => {
    showModal();
});

blurred.addEventListener("click", () => {
    hideModal();
});

window.addEventListener("keyup", e => {
    if (blurred.classList.contains("active")) {
        if (e.key === "Escape") {
            hideModal();
        }
    // Press "a" to add new book or "s" to search
    } else {
        if (!(searchField === document.activeElement) && !(e.ctrlKey || e.shiftKey)) {
            if (e.key.toLowerCase() === "a") {
            showModal();
            } else if (e.key.toLowerCase() === "s") {
                searchField.focus();
            }
        } else {
            if (e.key === "Escape") {
                searchField.blur();
                searchField.value = "";
            }
        }
    }
});

function writeTable() {
    for(let book in library) {
        writeTableRow(library[book]);
    }
}

function updateTable(book) {
    writeTableRow(library[book]);
}

function writeTableRow(book) {
    const tableRow = document.createElement("tr");
    const titleCell = document.createElement("td");
    const authorCell = document.createElement("td");
    const pagesCell = document.createElement("td");
    const readCell = document.createElement("td");
    const readCheck = document.createElement("input");
    readCheck.type = "checkbox";
    readCheck.dataset.libraryIndex = library.indexOf(book);
    readCell.dataset.libraryIndex = library.indexOf(book);

    titleCell.textContent = book.title;
    authorCell.textContent = book.author;
    pagesCell.textContent = book.pages;
    readCell.appendChild(readCheck);

    if (book.read) {
        readCheck.checked = true;
    }


    [titleCell, authorCell, pagesCell, readCell].forEach(cell => {
        cell.dataset.libraryIndex = library.indexOf(book);
        tableRow.appendChild(cell);
    });
    table.appendChild(tableRow);
}

function putLocal() {
    localStorage.setItem("library", JSON.stringify(library));
}


/*
    queryselectorall on checkboxes in table. change toggles library[data-id].toggleRead prototype
    click book in table to view, delete etc.
    save and load from localstorage
*/