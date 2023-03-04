const fs = require('fs');
const https = require('https');
const Path = require('path');

module.exports = class File {
  constructor(path, logPrefix = 'FILE:') {
    this.path = path;
    this.logPrefix = logPrefix;

    this.createFolder();
  }

  log(...rest) {
    console.log(this.logPrefix, ...rest);
  }

  error(...rest) {
    console.error(this.logPrefix, ...rest);
  }
  
  createFolder() {
    const dir = Path.extname(this.path) ? Path.dirname(this.path) : this.path;
    if (!fs.existsSync(dir)){
      this.log(`Creating folder '${dir}'...`)
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async get(prop) {
    try {
      const stdout = fs.readFileSync(this.path, {encoding: 'utf-8'});
      const data = JSON.parse(stdout);
      return prop ? data[prop] : data;
    } catch (e) {
      this.error(`Can't read/parse the file '${this.path}', creating a new one...`);
      this.set({});
      return prop ? undefined : {};
    }
  }

  set(data) {
    return fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
  }

  getBasenameFromUrl(urlStr) {
    const url = new URL(urlStr);
    return Path.basename(url.pathname);
  }

  async download(url, i) {
    return new Promise((resolve, reject) => {
      const filename = this.getBasenameFromUrl(url);
      const absPath = Path.join(this.path, filename);

      if (fs.existsSync(absPath)) {
        this.log(i, `File '${filename}' already exists, skipping...`);
        resolve();
        return;
      }

      const file = fs.createWriteStream(absPath);
      https.get(url, (res) => {
        res.pipe(file);
        res.on('end', () => {
          file.close();
          this.log(i, `File '${filename}' downloaded`, absPath);
          resolve();
        });
      }).on('error', (err) => {
        file.close();
        this.error(i, `Error while downloading file '${filename}'`, err)
        reject(err);
      });
    });
  }

  async downloadMock(url, i) {
    const delay = Math.round(Math.random() * 2000)
    return new Promise((resolve) => {
      setTimeout(() => {
        this.log(`Downloaded mock ${i} in ${delay}ms: ${url}`);
        resolve(url);
      }, delay);
    });
  }

  async downloadAll(urls, threads = 10) {
    let position = 0;
    let counter = 0;

    let results = [];
    this.log(`Downloading ${urls.length} files with ${threads} threads...`)
    while (position < urls.length) {
      const urlsSlice = urls.slice(position, position + threads);
      results = results.concat(await Promise.allSettled(urlsSlice.map((url) => this.download(url, `${counter++}/${urls.length}`))));
      position += threads;
    }

    this.log(`Downloaded ${results.length} files.`)
  }
};
