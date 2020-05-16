const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');

const credentials = require('./credentials/tokens.json')
const config = require('./config/config.json');

async function getRecentMatches() {
    const res = await fetch(`https://api.opendota.com/api/players/${config.steam_id_32}/matches?api_key=${credentials.API_KEY}&limit=${config.amount_of_matches}`);
    return await res.json();
}

async function getMatches(matchIds) {
    const res = await fetch(`https://api.opendota.com/api/players/${config.steam_id_32}/matches?api_key=${credentials.API_KEY}&limit=${config.amount_of_matches}`);
    return await res.json();
}

getRecentMatches()
    .then( matches => {
        matchids = [];
        matches.forEach(element => {
            matchids.push(element.match_id);
        });
        return new Promise((resolve, reject) => {
            resolve(matchids);
        })
    })
    .then( ids => {
        console.log(ids);
        return new Promise( async (resolve, reject) => {
            let matches = [];
    
            ids.forEach(element => {
    
                fetch(`https://api.opendota.com/api/matches/${element}?api_key=${credentials.API_KEY}`)
                    .then( res => {
                        res.json()
                            .then( json => {
                                matches.push(json);
                            })
                    })
            });
            resolve(matches);
        })
    })
    .then( matches => {
        console.log(matches);
    })
/* 
function getElaborateMatches(matchIds) {

    return new Promise((resolve, reject) => {
        matches = [];

        matchIds.forEach(element => {

            fetch(`https://api.opendota.com/api/matches/${element}?api_key=${credentials.API_KEY}`)
                .then( res => {
                    res.json()
                        .then( json => {
                            matches.push(json);
                        })
                })
        });
        resolve(matches);
    })
}
 */










// below is canvas manipulation code
/* 
const width = 400;
const height = 400;

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

loadImage('./images/dotamap.PNG').then(image => {
    context.drawImage(image, 0, 0, 400, 400);
    



    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./dist/fixed.png', buffer)
})
 */



