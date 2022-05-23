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

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function () {
    if (this.read) {
        this.read = false;
    } else this.read = true;
}

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
    [readCheck, readCell, tableRow].forEach(item => {
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
    // Will have to disable pointer events on checkbox itself to prevent double clicks
    read.addEventListener("click", (e) => {
        library[e.target.dataset.libraryIndex].toggleRead();
        const checkBox = document.querySelector(`table.library td:last-of-type 
        input[type="checkbox"][data-library-index="${e.target.dataset.libraryIndex}"]`);
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

    if (book.read) {
        read.checked = true;
    } else read.checked = false;
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




/*
function myFunction() {
 204   │   var input, filter, table, tr, td, i, txtValue;
 205   │   input = document.getElementById("sok");
 206   │   filter = input.value.toUpperCase();
 207   │   table = document.getElementById("devices");
 208   │   tr = table.getElementsByTagName("tr");
 209   │   for (i = 0; i < tr.length; i++) {
 210   │     td = tr[i].getElementsByTagName("td")[1];
 211   │     if (td) {
 212   │       txtValue = td.textContent || td.innerText;
 213   │       if (txtValue.toUpperCase().indexOf(filter) > -1) {
 214   │         tr[i].style.display = "";
 215   │       } else {
 216   │         tr[i].style.display = "none";
 217   │       }
 218   │     }
 219   │   }
 220   │ }
 */