import Api from '../api.js';
import Db from '../db.js';

let scheduleData = null;

const fetchScheduleData = () => {
  async function runFetchSchedule() {
    const tmpScheduleData = await Api.getAllSchedule(); // in api js
    scheduleData = tmpScheduleData;
  }

  runFetchSchedule();
}

window.scheduleData = scheduleData;

const showTeamFlag = (allTeam, data) => {
  const searchTeamById = (data, allTeam) => {
      for (let i = 0; i < allTeam.length; i++) {
          if (allTeam[i].id === data) {
              return allTeam[i].crestUrl;
          }
      }
  }

  const urlFlagImg = searchTeamById(data, allTeam);
  return urlFlagImg;
}

const getMatchById = (matchId, allMatch) => {
  let selectedMatchById = null;
  for (let i=0; i < allMatch.length; i++) {
    if (allMatch[i].id === matchId) {
      selectedMatchById = allMatch[i];
    }
  }
  return selectedMatchById;
}

const saveScheduleClicked = (matchId) => {
  const teams = scheduleData.allTeamData.teams;
  const match = getMatchById(matchId, scheduleData.matchData.matches);
  const urlHomeTeam = showTeamFlag(teams, match.homeTeam.id);
  const urlAwayTeam = showTeamFlag(teams, match.awayTeam.id);
  const saveMatchSchedule = {
    'matchId': match.id,
    'homeTeam': match.homeTeam,
    'awayTeam': match.awayTeam,
    'utcDate': match.utcDate,
    'urlHomeTeam': urlHomeTeam,
    'urlAwayTeam': urlAwayTeam
  }
  Db.dbSaveScheduleForLater(saveMatchSchedule);

  const buttonId = `button${matchId}`;
  const htmlToast = `
    <div class="center-align">
      <div>
        ${match.homeTeam.name} VS ${match.awayTeam.name}
      </div>
      <div>
        Saved Successfully
      <div>
    </div>
  `;
  
  M.toast({html: htmlToast});

  $(`#${buttonId}`).toggleClass('save-schedule-ahead saved-schedule-ahead').html('Saved');
}

window.saveScheduleClicked = saveScheduleClicked;

export default {
  scheduleData,
  fetchScheduleData
}

