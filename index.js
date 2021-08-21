// capitalize the first letter of each word in str
function capitalize(str) {
  return str
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function Book(name, author, read, description, coverUrl) {
  // make sure arguments are provided
  if (
    name == undefined ||
    author == undefined ||
    read == undefined ||
    description == undefined
  ) {
    throw new Error(
      'First 4 arguments are required: name, author, read, and description'
    );
  }
  this.name = capitalize(name);
  this.author = capitalize(author);
  this.read = read;
  this.description = description;
  this.coverUrl = coverUrl;
}

function main() {
}

main();
