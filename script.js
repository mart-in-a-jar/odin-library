const library = [];
const table = document.querySelector("table.library tbody");
const addBookModal = document.querySelector(".form.modal");
const deleteModal = document.querySelector(".delete.modal");
const bookCardModal = document.querySelector(".book.modal");
const blurred = document.querySelector(".blur");
const addBookButton = document.querySelector("header button.add");
const searchField = document.querySelector("input[type='search'");
let currentBook;
let currentBookIndex;

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    toggleRead() {
        this.read = !this.read;
    }
}

// Import from localstorage
function importBooks() {
    const books = JSON.parse(localStorage.getItem("library"));
    if (books) {
        books.map(book => {
            library.push(new Book(book.title, book.author, book.pages, book.read));
        });
    }
}

importBooks();
writeTable();

function showModal(modal) {
    modal.classList.add("active");
    blurred.classList.add("active");
    if (modal === addBookModal) {
        document.querySelector("form input:first-of-type").focus();
    } else if (modal === deleteModal) {
        document.querySelector("input#deleteConfirm").focus();
    }
}

function hideModal() {
    if (addBookModal.classList.contains("active")) {
        addBookModal.classList.remove("active");
        clearForm();
        document.querySelectorAll("form input").forEach(input => {
            input.blur();
        });
    } else if (deleteModal.classList.contains("active")) {
        deleteModal.classList.remove("active");
        document.querySelector("input#deleteConfirm").value = "";
        document.querySelector("input#deleteConfirm").blur();
    } else if (bookCardModal.classList.contains("active")) {
        bookCardModal.classList.remove("active");
    };
    blurred.classList.remove("active");
}

function addBookToLibrary() {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = +document.querySelector("#pages").value;
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
    hideModal(addBookModal);
    clearForm();
});

addBookButton.addEventListener("click", () => {
    showModal(addBookModal);
});

blurred.addEventListener("click", () => {
    hideModal();
});

// Hotkeys
window.addEventListener("keyup", e => {
    if (blurred.classList.contains("active")) {
        if (e.key === "Escape") {
            hideModal();
        }
        // Press "a" to add new book or "s" to search
    } else {
        if (!(searchField === document.activeElement) && !(e.ctrlKey || e.shiftKey)) {
            if (e.key.toLowerCase() === "a") {
                showModal(addBookModal);
            } else if (e.key.toLowerCase() === "s") {
                searchField.focus();
            }
        } else {
            if (e.key === "Escape") {
                searchField.blur();
                searchField.value = "";
                showAllRows();
            }
        }
    }
});

function writeTable() {
    document.querySelectorAll("table tr:not(tr:first-of-type)").forEach(row => {
        row.remove();
    });
    for (let book in library) {
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
    [readCheck, tableRow].forEach(item => {
        item.dataset.libraryIndex = library.indexOf(book);
    });

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
    addTableActions(readCell, titleCell, authorCell, pagesCell);
}

function putLocal() {
    localStorage.setItem("library", JSON.stringify(library));
}

// Delete all books
function deleteAll() {
    library.length = 0;
    writeTable();
    putLocal();
}

document.querySelector("button.delete").addEventListener("click", () => {
    showModal(deleteModal);
});

document.querySelector("button.deleteConfirm").addEventListener("click", () => {
    if (document.querySelector("input#deleteConfirm").value === "DELETE") {
        deleteAll();
        hideModal();
    }
});

function addTableActions(read, title, author, pages) {
    // Will have to disable pointer events on checkbox itself to prevent double clicks (done in css)
    read.addEventListener("click", (e) => {
        library[e.target.dataset.libraryIndex].toggleRead();
        // const checkBox = document.querySelector(`table.library td:last-of-type 
        // input[type="checkbox"][data-library-index="${e.target.dataset.libraryIndex}"]`);
        const checkBox = read.querySelector("input");
        checkBox.checked = !checkBox.checked;
        putLocal();
    });

    [title, author, pages].forEach(cell => {
        cell.addEventListener("click", (e) => {
            currentBook = library[e.target.dataset.libraryIndex];
            currentBookIndex = library.indexOf(currentBook)
            updateBookCard(currentBook);
            showModal(bookCardModal);
        });
    });
}

function updateBookCard(book) {
    const title = document.querySelector(".book.modal .title");
    const author = document.querySelector(".book.modal .author");
    const pages = document.querySelector(".book.modal span.pages");
    const read = document.querySelector(".book.modal #readOnCard");
    title.textContent = book.title;
    author.textContent = `by ${book.author}`;
    pages.textContent = book.pages;

    read.checked = book.read;
}

document.querySelector("#deleteOnCard").addEventListener("click", () => {
    library.splice(currentBookIndex, 1);
    putLocal();
    writeTable(); // So data-library-indexes updates correctly after array has changed
    hideModal();
});

document.querySelector(".book.modal #readOnCard").addEventListener("change", () => {
    currentBook.toggleRead();
    const tableCheckbox = document.querySelector(`table.library td:last-of-type 
    input[type="checkbox"][data-library-index="${currentBookIndex}"]`);
    tableCheckbox.checked = !tableCheckbox.checked;
    putLocal();
});


// Search/filtering
searchField.addEventListener("keyup", () => {
    searchString = searchField.value.toLowerCase();
    document.querySelectorAll("table.library tr:not(tr:first-of-type)").forEach(row => {
        let display;
        row.querySelectorAll("td:nth-child(-n+2)").forEach(cell => {
            if (cell.textContent.toLowerCase().indexOf(searchString) >= 0) {
                display = true;
            }
        });
        if (display) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

function showAllRows() {
    document.querySelectorAll("tr").forEach(row => {
        row.style.display = "";
    });
}