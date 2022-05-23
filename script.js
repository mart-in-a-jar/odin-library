const library = [];
const table = document.querySelector("table.library tbody");
const addBookModal = document.querySelector(".form.modal");
const blurred = document.querySelector(".blur");
const addBookButton = document.querySelector("header button.add");

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
}

function addBookToLibrary() {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const read = document.querySelector("#read").checked;

    //Returns the number of books in the library
    return library.push(new Book(title, author, pages, read));
}

function clearForm() {
    document.querySelectorAll("form input:not([type='checkbox']").forEach(input => {
        input.value = "";
    });
    document.querySelector("form input[type='checkbox']").checked = false;
}

document.querySelector("form.add-book").addEventListener("submit", (e) => {
    e.preventDefault();
    updateTable(addBookToLibrary() - 1);
    hideModal();
    clearForm();
});

addBookButton.addEventListener("click", () => {
    showModal();
});

blurred.addEventListener("click", () => {
    hideModal();
});

window.addEventListener("keydown", e => {
    if (blurred.classList.contains("active")) {
        if (e.key === "Escape") {
            hideModal();
        }
    };
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

    titleCell.textContent = book.title;
    authorCell.textContent = book.author;
    pagesCell.textContent = book.pages;
    readCell.appendChild(readCheck);

    if (book.read) {
        readCheck.checked = true;
    }


    [titleCell, authorCell, pagesCell, readCell].forEach(cell => {
        tableRow.appendChild(cell);
    });
    table.appendChild(tableRow);
}




/*
queryselectorall on checkboxes in table. change toggles library[data-id].toggleRead prototype

*/