const API_URL = 'https://api-mongodb-dtnl.onrender.com/v1/books/'; // Troque para sua API real
let editingId = null;

window.onload = () => fetchBooks();


function fetchBooks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => renderBooks(data))
        .catch(err => console.error('Erro ao carregar livros:', err));
}


function renderBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const li = document.createElement('li');
        if (book.completed) li.classList.add('completed');

        const info = document.createElement('div');
        info.innerHTML = `<strong>${book.title}</strong><br>Autor: ${book.author}<br>Gênero: ${book.genre}<br><a href="${book.url}" target="_blank">Comprar</a>`;
        li.appendChild(info);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.addEventListener('click', () => toggleComplete(book.id, book.completed));
        li.appendChild(completeBtn);

    
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => fillForm(book));
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteBook(book._id));
        li.appendChild(deleteBtn);

        bookList.appendChild(li);
    });
}

document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const book = {
        title: document.getElementById('book-name').value.trim(),
        author: document.getElementById('book-author').value.trim(),
        genre: document.getElementById('book-genre').value.trim(),
        url: document.getElementById('book-link').value.trim(),
    };

    if (editingId) {
        fetch(`${API_URL}update/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        }).then(() => {
            document.getElementById("button").innerText = "Salvar Livro";
            editingId = null;
            fetchBooks();
            clearForm();
        }).catch(err => console.error('Erro ao atualizar:', err));
    } else {
        // Create
        fetch(API_URL+"create/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        }).then(() => {
            fetchBooks();
            clearForm();
        }).catch(err => console.error('Erro ao adicionar:', err));
    }
});

function fillForm(book) {
    document.getElementById('book-name').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-genre').value = book.genre;
    document.getElementById('book-link').value = book.url;
    editingId = book._id;
    document.getElementById("button").innerText = "Editar Livro"
}

// Deletar
function deleteBook(id) {
    if (confirm('Deseja deletar este livro?')) {
        fetch(`${API_URL}delete/${id}`, { method: 'DELETE' })
            .then(() => fetchBooks())
            .catch(err => console.error('Erro ao deletar:', err));
    }
}

// Marcar como comprado
function toggleComplete(id, completed) {
    fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
    }).then(() => fetchBooks())
      .catch(err => console.error('Erro ao atualizar status:', err));
}

function clearForm() {
    document.getElementById('book-name').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('book-genre').value = '';
    document.getElementById('book-link').value = '';
}

function createBook(){
    const newBook = {
        title: document.getElementById('book-name').value,
        author: document.getElementById('book-author').value,
        genre: document.getElementById('book-genre').value,
        link: document.getElementById('book-link').value,
        completed: false
    };
}