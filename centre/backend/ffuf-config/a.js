const fs = require('fs');
const f = fs.readFileSync('./time-based.txt','utf-8');
const content = f.split('\n');
let s = '';
for (let i = 0; i < content.length; ++i) {
  s += content[i] + '\n';
  s += encodeURIComponent(content[i]) + '\n';
  if (content[i].includes('"')) {
    const cur = content[i].replace(/\"/g, '\\"');
    s += cur + '\n';
  }
}

fs.writeFileSync('./time-based-2.txt', s);
