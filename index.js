// capitalize the first letter of each word in str
function capitalize(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

async function getCoverUrl(title, author) {
  let searchUrl = `https://openlibrary.org/search.json?q=${title}`;
  return fetch(searchUrl)
    .then((response) => response.json())
    .then((json) => {
      let results = json.docs;
      let resultFound = null;
      let coverUrl = null;
      for (let result of results) {
        if (result.author_name) {
          for (let authorName of result.author_name) {
            let authorNameMin = authorName.toLowerCase().replaceAll(' ', '');
            if (author.toLowerCase().replaceAll(' ', '') === authorNameMin) {
              // only choose item if it has a valid cover image
              if (result.cover_i) {
                resultFound = result;
                break;
              }
            }
          }
        }
        if (resultFound) {
          break;
        }
      }

      if (resultFound) {
        coverUrl = `https://covers.openlibrary.org/b/id/${resultFound.cover_i}-L.jpg`;
      }
      return coverUrl;
    })
}

function Book(name, author, pages, read, description, coverUrl) {
  // make sure arguments are provided
  if (
    name == undefined ||
    author == undefined ||
    pages == undefined ||
    read == undefined ||
    description == undefined
  ) {
    throw new Error(
      'First 5 arguments are required: name, author, pages, read, and description'
    );
  }
  this.name = capitalize(name);
  this.author = capitalize(author);
  this.pages = pages;
  this.read = read;
  this.description = description;
  this.coverUrl = coverUrl;
  if (!this.coverUrl) {
    this.coverUrl =
      'https://via.placeholder.com/400x600?text=Missing+Cover+Image';
  }
}

let books = [];
const booksRow = document.querySelector('#books');
const bookForm = document.forms['book-form'];
const closeModalBtn = document.querySelector('#close-modal');
const tabs = document.querySelectorAll('#tabs .nav-link');

function saveToStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function addBook(book) {
  books.push(book);
  saveToStorage();

    // search for missing book covers
  if (book.coverUrl.match(/Missing/)) {
    book.coverUrl = 'https://via.placeholder.com/400x600?text=Searching+for+cover+image';
    renderBooks(getActiveTab());
    getCoverUrl(book.name, book.author).then(url => {
      if (url) {
        book.coverUrl = url;
      } else {
        book.coverUrl = 'https://via.placeholder.com/400x600?text=Cover+image+not+found';
      }
      renderBooks(getActiveTab());
    });
  }

}

function getActiveTab() {
  let activeTab = [...tabs].find(tab => tab.classList.contains('active'));
  return activeTab.textContent;
}

function renderBooks(type) {
  booksRow.innerHTML = '';
  books.forEach((book, idx) => {
    if (type === 'Read' && !book.read)
      return;
    else if (type === 'Unread' && book.read)
      return;
    const col = document.createElement('div');
    col.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = book.coverUrl;
    img.alt = 'Book cover image';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.textContent = book.name;

    const cardAuthor = document.createElement('small');
    cardAuthor.classList.add('card-text', 'text-muted');
    cardAuthor.textContent = `by ${book.author}`;

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card-text', 'mt-2');
    cardDescription.textContent = book.description;

    const cardFooter = document.createElement('div');
    cardFooter.classList.add(
      'card-footer',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );

    const cardPages = document.createElement('small');
    cardPages.classList.add('text-muted');
    cardPages.textContent = `${book.pages} pages`;

    const cardDelete = document.createElement('a');
    cardDelete.classList.add('text-danger');
    cardDelete.setAttribute('href', '#');
    cardDelete.dataset.index = idx;
    cardDelete.innerHTML = '<i class="bi bi-trash-fill"></i>';

    cardDelete.addEventListener('click', () => {
      books.splice(cardDelete.dataset.index, 1);
      renderBooks(getActiveTab());
    });

    const cardSwitch = document.createElement('div');
    cardSwitch.classList.add('form-switch', 'form-check');

    const cardCheckbox = document.createElement('input');
    cardCheckbox.setAttribute('type', 'checkbox');
    cardCheckbox.classList.add('form-check-input');
    cardCheckbox.dataset.index = idx;

    const readStatus = document.createElement('small');
    if (book.read) {
      readStatus.classList.add('text-success');
      readStatus.textContent = '✓ Read';
      cardCheckbox.checked = true;
    } else {
      readStatus.classList.add('text-muted');
      readStatus.textContent = 'Not read';
      cardCheckbox.checked = false;
    }

    cardCheckbox.addEventListener('change', () => {
      if (cardCheckbox.checked) {
        readStatus.textContent = '✓ Read';
        readStatus.setAttribute('class', 'text-success');
        books[cardCheckbox.dataset.index].read = true;
      } else {
        readStatus.textContent = 'Not read';
        readStatus.setAttribute('class', 'text-muted');
        books[cardCheckbox.dataset.index].read = false;
      }
      renderBooks(getActiveTab());
    });

    col.appendChild(card);
    card.append(img, cardBody, cardFooter);
    cardBody.append(cardTitle, cardAuthor, cardDescription);
    cardFooter.append(cardPages, cardSwitch, cardDelete);
    cardSwitch.append(cardCheckbox, readStatus);
    booksRow.appendChild(col);
  });
  saveToStorage();
}

// load books from local storage
let localBooks = localStorage.getItem('books');
if (localBooks) {
  books = JSON.parse(localBooks);
  renderBooks();
}

function main() {
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.querySelector('#name');
    let author = document.querySelector('#author');
    let pages = document.querySelector('#pages');
    let read = document.querySelector('#read');
    let description = document.querySelector('#description');
    let coverUrl = document.querySelector('#cover');

    let book = new Book(
      name.value,
      author.value,
      pages.value,
      read.checked,
      description.value,
      coverUrl.value
    );
    addBook(book);
    renderBooks(getActiveTab());

    name.value = '';
    author.value = '';
    pages.value = '';
    read.checked = false;
    description.value = '';
    coverUrl.value = '';
    closeModalBtn.click();
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(tabRemove => {
        tabRemove.classList.remove('active');
      });
      tab.classList.add('active');
      renderBooks(tab.textContent);
    });
  });
}

main();
