<template>
  <b-container>

    <b-row>
      <b-col>
        <h4>Input steam32 id:</h4>
        <InputForm @buttonClicked="handleSteamIdSubmit"></InputForm>
      </b-col>
      <b-col>
        <DisplayInfo :matches="this.matches" :shownWards="wards_shown" :time="time"></DisplayInfo>
      </b-col>
    </b-row>

    <hr>

    <b-row v-if="matches.length">
      
      <b-col>

        <b-row>
          <b-col><Slider @sliderChanged="updateWards"></Slider></b-col>
        </b-row>

        <b-row>
          <b-col><TeamCheckBox @teamChanged="updateTeams" :team="'Radiant'"></TeamCheckBox></b-col>
          <b-col><TeamCheckBox @teamChanged="updateTeams" :team="'Dire'"></TeamCheckBox></b-col>
        </b-row>

      </b-col>

      <b-col > 
        <div v-if="show_dire == true || show_radiant == true"  class="heatmapjs-container">
          <div id="heatmap" class="heatmapjs-canvas" />
        </div>
      </b-col>

    </b-row>

  </b-container>
</template>
 
<script>
import DisplayInfo from '../components/DisplayInfo';
import InputForm from '../components/InputForm';
import TeamCheckBox from '../components/TeamCheckBox';
import Slider from '../components/Slider';
import tokens from '../config/tokens.json';
import config from'../config/config.json';
import h337 from 'heatmapjs';

export default {
  components: {
    InputForm,
    Slider,
    TeamCheckBox,
    DisplayInfo
  },
  data() {
    return {
      matches: [],
      elaborateMatches: [],
      wards: [],
      time: 5 * 60,
      heatmap: null,
      show_radiant: true,
      show_dire: true,
    }
  },
  computed: {
    matchIds() {
      return this.matches.map(match => match.match_id);
    },
    wards_dire() {
      return this.wards.filter(ward  => !ward.isRadiant)
    },
    wards_radiant() {
      return this.wards.filter(ward  => ward.isRadiant)
    },
    wards_shown() {
      let wards = this.filterWardsOnTime(this.wards);
      return this.filterWardsonTeams(wards);
    }
  },
  methods: {
    filterWardsOnTime(wards) {
      return this.wards.filter(ward => this.time-360 < ward.time && ward.time < this.time)
    },
    filterWardsonTeams(wards) {
      if(this.show_radiant && this.show_dire) {
        return wards;
      } else if (this.show_radiant) {
        return wards.filter(ward => ward.isRadiant == true);
      } else {
        return wards.filter(ward => ward.isRadiant == false);
      }
    },
    updateTeams(team) {
      if(team == 'Radiant') {
        this.show_radiant = !this.show_radiant;
      } else {
        this.show_dire = !this.show_dire;
      }
      this.updateHeatMap();
    },
    updateWards(value) {
      this.time = value * 60;
      this.updateHeatMap();
    },
    updateHeatMap() {
      if(this.show_radiant || this.show_dire){
        const adjustedData = this.scaleAndExtrema(this.wards_shown, 500 / 127, 20);
        this.heatmap.setData(adjustedData);
      }
    },
    generateHeatmap() {
      this.heatmap = h337.create({
        container: document.getElementById('heatmap'),
        radius: 15 * (500 / 600) * 1.2,
        width: 500,
        height: 500,
      });
      const adjustedData = this.scaleAndExtrema(this.wards_shown, 500 / 127, 50);
      this.heatmap.setData(adjustedData);
    },
    sortWards() {
    },
    extractWards() {
      const wards = [];
      this.elaborateMatches.forEach(match => {

        const towerTimings = this.getTowerDeaths(match);

        match.players.forEach(player => {
          if(player.obs_log){

            player.obs_log.forEach(ward => {

              

              const aliveTowers = this.getAliveTowersAtTime(ward, towerTimings)
              wards.push({x: ward.x, y: ward.y, time: ward.time, isRadiant: player.isRadiant, aliveTowers: aliveTowers})
            })

            //wards.push(...player.obs_log.map(obs => ({x: obs.x, y: obs.y, time: obs.time, isRadiant: player.isRadiant, aliveTowers: towerTimings.map(objective => objective.time < obs.time)})));
          }
        })
      })
      this.wards = wards;
    },
    getAliveTowersAtTime(w, timings) {

      console.log(timings);
      let aliveTowers = [];

      // give me a list of objective events that occured AFTER the provided ward is placed (towers that are the key of these objectives are alive if the event.time is greater than wards time)
      const acceptedObjectives = timings.filter(objective => objective.time > w.time)
      acceptedObjectives.forEach(objective => {
        aliveTowers.push(objective.building);
      })

      return aliveTowers;
    },
    getTowerDeaths(match) {
      let towerkills = [];
      match.objectives.forEach(objective => {
        if(objective.key){
          if(objective.key.toString().includes("tower")){
            towerkills.push({"building": objective.key.toString().substring(9), "time":objective.time});
          }
        }
      })
      return towerkills;
    },
    scaleAndExtrema(points, scalef, max) {
      const newPoints = points.map(p => {
        return {
          x: Math.floor(p.x * scalef) - 250,
          y: 500 - (Math.floor(p.y * scalef) - 250),
          value: 12,
        };
      });
      const vals = newPoints.map(p => p.value);
      const localMax = Math.max(...vals);
      return {
        min: 0,
        max: max || localMax,
        data: newPoints,
      };
    },
    async handleSteamIdSubmit(steamId) {
      await this.fetchRecentMatches(steamId);
      await this.fetchElaborateMatches();
      await this.extractWards();
      await this.generateHeatmap();
    },
    async fetchRecentMatches(steamId) {
      const res = await this.$axios.get(`https://api.opendota.com/api/players/${steamId}/matches?api_key=${tokens.API_KEY}&limit=${config.amount_of_matches}`);
      this.matches = res.data;
    },
    async fetchElaborateMatches() {
      const matchPromises = this.matchIds.map(id => this.$axios.get(`https://api.opendota.com/api/matches/${id}?api_key=${tokens.API_KEY}`))
      const responses = await Promise.all(matchPromises);
      this.elaborateMatches = responses.map(response => response.data);
    }
  }
}
</script>

<style>

.heatmapjs-container {
    position: relative;
    width: 500px;
    height: 500px;
    background-image: url('https://github.com/odota/web/blob/master/public/assets/images/dota2/map/detailed_723.jpg?raw=true');
    background-size: 100% 100%;
    background-position: top left;
  }
 
  .heatmapjs-canvas {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .rotated {
    transform: translateX(180deg)
  }

.container {
  margin-top: 20px;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
