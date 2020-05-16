const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const fetch = require('node-fetch');

const credentials = require('./credentials/tokens.json')
const config = require('./config/config.json');

async function getRecentMatches() {
    const res = await fetch(`https://api.opendota.com/api/players/${config.steam_id_32}/matches?api_key=${credentials.API_KEY}&limit=${config.amount_of_matches}`);
    return await res.json();
}

let radiantWards = [];
let direWards = [];


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

        matchPromises = [];
        ids.forEach(element => {
            matchPromises.push(fetch(`https://api.opendota.com/api/matches/${element}?api_key=${credentials.API_KEY}`))
        });

        Promise.all(matchPromises)
            .then( responses => {
                return responses.map( (res) => {
                    res.json()
                        .then( data => {
                            data.players.map( player => {
                            
                                player.obs_log.forEach(element => {
                                    if(player.isRadiant){
                                        radiantWards.push(element);
                                    } else {
                                        direWards.push(element);
                                    }
                                });
                            })
                        })
                });
            })
            
            
     
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



