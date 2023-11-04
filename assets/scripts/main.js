document.addEventListener("DOMContentLoaded", function () {
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const bookSubmit = document.getElementById("bookSubmit");
    const searchBookTitle = document.getElementById("searchBookTitle");
    const searchSubmit = document.getElementById("searchSubmit");
    const incompleteBookshelfList = document.getElementById(
        "incompleteBookshelfList"
    );
    const completeBookshelfList = document.getElementById(
        "completeBookshelfList"
    );

    // Mendapatkan data buku dari localStorage atau menginisialisasi jika belum ada
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Menampilkan buku pada rak berdasarkan status isComplete
    function renderBookshelf(filteredBooks = books) {
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        filteredBooks.forEach((book) => {
            const bookItem = document.createElement("article");
            bookItem.classList.add("book_item");
            const bookTitle = document.createElement("h3");
            bookTitle.textContent = book.title;
            const author = document.createElement("p");
            author.textContent = `Penulis: ${book.author}`;
            const year = document.createElement("p");
            year.textContent = `Tahun: ${book.year}`;
            const action = document.createElement("div");
            action.classList.add("action");

            const moveButton = document.createElement("button");
            moveButton.classList.add(book.isComplete ? "green" : "green");
            moveButton.textContent = book.isComplete
                ? "Belum selesai dibaca"
                : "Selesai dibaca";
            moveButton.addEventListener("click", () => {
                toggleReadStatus(book.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Hapus buku";
            deleteButton.classList.add("red");
            deleteButton.addEventListener("click", () => {
                deleteBook(book.id);
            });

            action.appendChild(moveButton);
            action.appendChild(deleteButton);

            bookItem.appendChild(bookTitle);
            bookItem.appendChild(author);
            bookItem.appendChild(year);
            bookItem.appendChild(action);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    // Menambahkan buku baru
    function addBook(title, author, year, isComplete) {
        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete,
        };
        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));
        renderBookshelf();
    }

    // Mengubah status membaca buku
    function toggleReadStatus(bookId) {
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            localStorage.setItem("books", JSON.stringify(books));
            renderBookshelf();
        }
    }

    // Menghapus buku
    function deleteBook(bookId) {
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
            // Tambahkan dialog konfirmasi sebelum menghapus
            const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
            if (isConfirmed) {
                books.splice(bookIndex, 1);
                localStorage.setItem("books", JSON.stringify(books));
                renderBookshelf();
            }
        }
    }


    // Menghandle perubahan status checkbox
    inputBookIsComplete.addEventListener("change", function () {
        const buttonText = inputBookIsComplete.checked
            ? "Masukkan Buku ke rak Selesai dibaca"
            : "Masukkan Buku ke rak Belum selesai dibaca";
        bookSubmit.textContent = buttonText;
    });

    // Menghandle pengiriman buku baru
    bookSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        // Memeriksa apakah input telah diisi
        if (title.trim() === "" || author.trim() === "" || year.trim() === "") {
            alert("Harap isi semua field sebelum menambahkan buku.");
            // Mengarahkan fokus ke input judul buku setelah menutup alert
            inputBookTitle.focus();
            return;
        }

        addBook(title, author, year, isComplete);

        // Reset form
        inputBookTitle.value = "";
        inputBookAuthor.value = "";
        inputBookYear.value = "";
        inputBookIsComplete.checked = false;
    });

    // Menghandle pencarian buku
    searchSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        const searchTerm = searchBookTitle.value.toLowerCase();
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(searchTerm)
        );
        renderBookshelf(filteredBooks);
    });


    // Render buku pertama kali
    renderBookshelf();
});
