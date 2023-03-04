const Crawler = require('crawler');
const { JSDOM } = require('jsdom');

const File = require('./file.js');

const r = {
  basicURL: 'https://www.tastingpoland.com/language/verb/',
  cacheFile: `${__dirname}/src/verbs.json`,
  imageFolder: `${__dirname}/public/images/`,
  logPrefix: 'POLVERB:',
}

// Alias for short writing
const log = (...rest) => console.log(r.logPrefix, ...rest);

const request = (url) => {
  return new Promise((resolve, reject) => {
    const c = new Crawler({
      maxConnections: 10,
      jQuery: false,
      callback: (error, res, done) => {
        if (error) {
          reject(error);
        } else {
          resolve((new JSDOM(res.body)).window.document);
        }
        done();
      }
    });
    log('Requesting link: ', r.basicURL + url);
    c.queue(r.basicURL + url);
  });
}

const getVerbList = async () => {
  const listLinks = await request('verb_forms.html').then((document) => {
    return [...document.querySelectorAll('.pills a')].map((a) => a.href);
  });

  const verbsObj = {};
  await Promise.all(listLinks.map((link) => request(link)))
    .then((docs) => docs.forEach((doc) => {
      [...doc.querySelectorAll('.pills ~ .pills a')].forEach((a) => {
        const verb = a.href.replace('_verb.html', '')
        if (verbsObj[verb]) {
          verbsObj[verb].list.push(a.textContent);
        } else {
          verbsObj[verb] = {
            verb: verb.split('_')[0],
            fullVerb: verb,
            list: [a.textContent],
            link: a.href,
            img: verb + '_verb.png'
          }
        }
      });
    }))

  return verbsObj;
};

(async () => {
  const verbFile = new File(r.cacheFile, r.logPrefix);
  let verbList = await verbFile.get()

  if (Object.keys(verbList).length) {
    log('Using cache');
  } else {
    log('No cache found, getting data from the website...');
    verbList = await getVerbList();
    verbFile.set(verbList)
  }

  const imageFile = new File(r.imageFolder, r.logPrefix);

  const verbsImageLinks = Object.values(verbList).map((verb) => r.basicURL + verb.img);

  await imageFile.downloadAll(verbsImageLinks);
})();
