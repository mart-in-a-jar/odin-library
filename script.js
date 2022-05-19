const library = [];

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

function addBookToLibrary() {
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const read = document.querySelector("#read").checked;

    library.push(new Book(title, author, pages, read));
}

document.querySelector("form.add-book").addEventListener("submit", (e) => {
    e.preventDefault();
    addBookToLibrary();
})

function updateTable() {
    for(let book in library) {
        writeTableRow(book);
    }
}

function writeTableRow(book) {
    const tableRow = document.createElement("tr");
    const titleCell = document.createElement("td");

    const currentBook = library[book];
    const title = currentBook.title;
    const author = currentBook.author;
    const pages = currentBook.pages;
    const read = currentBook.read;
    console.log(title, author, pages, read);

}