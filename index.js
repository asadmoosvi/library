// capitalize the first letter of each word in str
function capitalize(str) {
  return str
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
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
      'https://via.placeholder.com/800x600?text=Missing+Cover+Image';
  }
}

let books = [];
const booksRow = document.querySelector('#books');

function addBook(book) {
  books.push(book);
}

function renderBooks() {
  booksRow.innerHTML = '';
  books.forEach((book, idx) => {
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
    cardAuthor.textContent = book.author;

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card-text', 'mt-2');
    cardDescription.textContent = book.description;

    const cardFooter = document.createElement('div');
    cardFooter.classList.add(
      'card-footer',
      'd-flex',
      'justify-content-between'
    );

    const cardPages = document.createElement('small');
    cardPages.classList.add('text-muted');
    cardPages.textContent = `${book.pages} pages`;

    const cardSwitch = document.createElement('div');
    cardSwitch.classList.add('form-switch', 'form-check');

    const cardCheckbox = document.createElement('input');
    cardCheckbox.setAttribute('type', 'checkbox');
    cardCheckbox.classList.add('form-check-input');
    cardCheckbox.dataset.index = idx;

    const readStatus = document.createElement('small');
    if (book.read) {
      readStatus.classList.add('text-success');
      readStatus.textContent = '✅ Read';
      cardCheckbox.checked = true;
    } else {
      readStatus.classList.add('text-muted');
      readStatus.textContent = 'Not read';
      cardCheckbox.checked = false;
    }

    cardCheckbox.addEventListener('change', () => {
      if (cardCheckbox.checked) {
        readStatus.textContent = '✅ Read';
        readStatus.setAttribute('class', 'text-success');
        console.log('setting index ' + cardCheckbox.dataset.index + ' to true');
        books[cardCheckbox.dataset.index].read = true;
      } else {
        readStatus.textContent = 'Not read';
        readStatus.setAttribute('class', 'text-muted');
        console.log('setting index ' + cardCheckbox.dataset.index + ' to false');
        books[cardCheckbox.dataset.index].read = false;
      }
    });

    col.appendChild(card);
    card.append(img, cardBody, cardFooter);
    cardBody.append(cardAuthor, cardDescription);
    cardFooter.append(cardPages, cardSwitch);
    cardSwitch.append(cardCheckbox, readStatus);
    booksRow.appendChild(col);
  });
}

function main() {
}

main();
