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
}

function main() {
}

main();
