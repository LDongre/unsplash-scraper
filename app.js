
const fs = require('fs')
    cheerio = require('cheerio')
    axios = require('axios')

const SEARCH_TERM = process.env.SEARCH_TERM || 'love'
console.log(SEARCH_TERM);
//1.fetch the site
function fetchUnsplashData(){
    return axios.get(`https://unsplash.com/search/photos/${SEARCH_TERM}`)
    .then(res => res.data)
}

//2.grab images
function grabImages(data) {
    return new Promise((resolve, reject) => {
        
        if(data) {
            const $ = cheerio.load(data)
            const imageLinks = $('a[title="Download photo"]').map((index, image) => {
                return $(image).attr('href')
            })
            resolve(imageLinks)
        }
        else {
            reject();
        }
    });
}

//3.save images
function saveImages(images) {
    images.map((index, images) => {
        axios({
            method: 'get',
            responseType: 'stream',
            url: images
        }).then((item) => {
            item.data.pipe(fs.createWriteStream(`./images/${SEARCH_TERM}${index}.jpg`))
        })
    })
}
//4.put them all together
fetchUnsplashData()
.then(grabImages)
.then(saveImages)
.catch();