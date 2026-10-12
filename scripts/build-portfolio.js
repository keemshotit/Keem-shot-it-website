const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(__dirname, '../content/portfolio');
const outputFile = path.join(__dirname, '../portfolio.json');

function parseFrontMatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split('\n');
  const data = {};
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });
  return data;
}

function generatePortfolioJson() {
  if (!fs.existsSync(postsDirectory)) {
    fs.writeFileSync(outputFile, JSON.stringify([]));
    return;
  }

  const filenames = fs.readdirSync(postsDirectory);
  const items = filenames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const content = fs.readFileSync(path.join(postsDirectory, name), 'utf8');
      return parseFrontMatter(content);
    });

  fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));
}

generatePortfolioJson();
