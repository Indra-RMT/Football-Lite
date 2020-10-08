import Db from './db.js';

const BASE_URL = `https://api.football-data.org`;
const HEADER = {
  headers: {
    'X-Auth-Token' : '92474c864b684f429e74213dfc6fdc45'
  }
};

const GET_TEAMS_ENDPOINT = `${BASE_URL}/v2/competitions/2021/teams`;
const GET_STANDINGS_ENDPOINT = `${BASE_URL}/v2/competitions/2021/standings`;
const GET_MATCHES_ENDPOINT = (dateNow, dateFinish) => {
  const result = `${BASE_URL}/v2/competitions/2021/matches?dateFrom=${dateNow}&dateTo=${dateFinish}`;
  return result;
}
const GET_MATCHES_BY_ID_ENDPOINT = (matchId) => {
  const result = `${BASE_URL}/v2/matches/${matchId}`;
  return result;
}

const FAILED_FETCH_MESSAGE = `
  <div class="center-align fetch-failed">
    <b>Sorry, failed fo fetch data</b>
    <br>
    <b>Please refresh the page.</b>
  </div>
`;

const loader = () => {
  const loadingAnimation = `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
    <br>
    <br>
    `;
  return loadingAnimation;
}

const datePlusSevenDays = (dateNow) => {
  const result = new Date(dateNow
    .setDate(dateNow.getDate() + 7))
    .toISOString().slice(0,10); // get +7 days

  return result;
}

const showTeamFlag = (allTeam, data) => {
  const searchTeamById = (data, allTeam) => {
      for (let i=0; i < allTeam.length; i++) {
          if (allTeam[i].id === data) {
              return allTeam[i].crestUrl;
          }
      }
  }

  const urlFlagImg = searchTeamById(data, allTeam);
  return urlFlagImg;
}

const getMatchByMatchId = (matchId, allMatch) => {
  let selectedMatchByMatchId = null;
  for (let i=0; i < allMatch.length; i++) {
    if (allMatch[i].matchId === matchId) {
      selectedMatchByMatchId = allMatch[i];
    }
  }
  return selectedMatchByMatchId;
}


// Blok kode untuk menampilkan data standings
const fillStandings = (data) => {
  const standingsTotal = fillStandingsHtml(data, 0);
  const standingsHome = fillStandingsHtml(data, 1);
  const standingsAway = fillStandingsHtml(data, 2);
  $('#standings-total').html(standingsTotal);
  $('#standings-home').html(standingsHome);
  $('#standings-away').html(standingsAway);
}

const fillStandingsHtml = (data, numberArray) => {
  let standingsRow = "";
  data.standings[numberArray].table.forEach((standing, count) => {
    standingsRow += `
      <tr>
        <td class="center-align">${count + 1}</td>
        <td class="center-align">
          <img src="${standing.team.crestUrl}" alt="${standing.team.name}-logo" height="35">
        </td>
        <td>${standing.team.name}</td>
        <td class="center-align">${standing.playedGames}</td>
        <td class="center-align">${standing.playedGames - standing.draw - standing.lost}</td>
        <td class="center-align">${standing.draw}</td>
        <td class="center-align">${standing.lost}</td>
        <td class="center-align"><b>${standing.points}</b></td>
      </tr>
    `;
  });

  const standings = `
    <table class="responsive-table" id="standings">
      <thead>
        <tr>
          <th class="center-align">Position</th>
          <th class="center-align" colspan="2">Club</th>
          <th class="center-align">P</th>
          <th class="center-align">W</th>
          <th class="center-align">D</th>
          <th class="center-align">L</th>
          <th class="center-align">Points</th>
          </tr>
      </thead>
      <tbody>
        ${standingsRow}
      </tbody>
    </table>
  `;

  return standings;
}

const fillScheduleHtml = (matchData, allTeamData, savedMatchSchedule) => {
  let sevenDaysAhead = '';
  matchData.matches.forEach((match, count) => {
    const isSaved = getMatchByMatchId(match.id, savedMatchSchedule);
    let buttonSave = `
      <div
        id="button${match.id}"
        class="save-schedule-ahead"
        onclick="saveScheduleClicked(${match.id})">
        Save Schedule
      </div>
    `;
    if(isSaved){
      buttonSave = `
        <div
          class="saved-schedule-ahead">
          Saved
        </div>
      `;
    }
    if(count === 0){
      getSinggleMatch(match, buttonSave);
    } else {
      sevenDaysAhead += `
      <div class="row card-schedule ahead">
        <div class="team-image home">
          <img
            src="${showTeamFlag(allTeamData.teams, match.homeTeam.id)}"
            alt="${match.homeTeam.name} image">
        </div>
        <div class="team-vs">
          <div>${match.homeTeam.name}</div>
          <div>VS</div>
          <div>${match.awayTeam.name}</div>
          <div>${match.utcDate}</div>
        </div>
        <div class="team-image away">
          <img
            src="${showTeamFlag(allTeamData.teams, match.awayTeam.id)}"
            alt="${match.awayTeam.name} image">
        </div>
        ${buttonSave}
      </div>
      `
    }
  }) 

  $('#schedule > .sc-next').replaceWith(sevenDaysAhead);
}

const fillSinggleScheduleHtml = (match, buttonSave, teamData, dataById) => {
  const sevenDaysAhead = `
    <div class="card-schedule">
      <div class="row">
        <div class="col m6 s12" id="containerSinggleMatch">
          <div class="home-team"><h5><b>${match.homeTeam.name}</b></h5></div>
          <div class="vs-text"><b>VS</b></div>
          <div class="away-team"><h5><b>${match.awayTeam.name}</b></h5></div>
          <div class="match-stadium">${dataById.match.venue}</div>
          <div class="match-date">${match.utcDate}</div>
        </div>
        <div class="col m6 s12" id="containerH2h">
          <div class="center-align">
            <h6><b>Head to Head<b></h6>
          </div>
          <table id="headToHead">
            <tbody>
              <tr>
                <td>Team</td>
                <td class="center-align">
                  <img
                    src="${showTeamFlag(teamData.teams, match.homeTeam.id)}"
                    alt="${match.homeTeam.name} image"
                    height="35px">
                </td>
                <td class="center-align">
                  <img
                    src="${showTeamFlag(teamData.teams, match.awayTeam.id)}"
                    alt="${match.homeTeam.name} image"
                    height="35px">
                </td>
              </tr>
              <tr>
                <td>Win</td>
                <td class="center-align">${dataById.head2head.homeTeam.wins}</td>
                <td class="center-align">${dataById.head2head.awayTeam.wins}</td>
              </tr>
              <tr>
                <td>Loses</td>
                <td class="center-align">${dataById.head2head.homeTeam.losses}</td>
                <td class="center-align">${dataById.head2head.awayTeam.losses}</td>
              </tr>
              <tr>
                <td>Draws</td>
                <td class="center-align">${dataById.head2head.homeTeam.draws}</td>
                <td class="center-align">${dataById.head2head.awayTeam.draws}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      ${buttonSave}
    </div>
  `;
  $('#schedule > .sc-first').replaceWith(sevenDaysAhead);
}

async function getStandings() {
  if ('caches' in window) {
    try {
      $('#standings-total').html(loader());
      $('#standings-home').html(loader());
      $('#standings-away').html(loader());
      const response = await caches.match(GET_STANDINGS_ENDPOINT);
      if (response){
        console.log(`Standings Data: ${response}`)
        const dataStandings = await response.json();
        fillStandings(dataStandings);
      }
    }catch{
    }
  }

  try {
    $('#standings-total').html(loader());
    $('#standings-home').html(loader());
    $('#standings-away').html(loader());
    const response = await fetch(GET_STANDINGS_ENDPOINT, HEADER);
    if (response.status === 200) {
      const dataStandings = await response.json();
      fillStandings(dataStandings);
    }
  } catch (e) {
    console.log("Error : " + e);
    $('#standings-total').replaceWith(FAILED_FETCH_MESSAGE);
  }
}

async function getAllSchedule() {
  const savedMatchSchedule = await Db.dbGetAllSavedSchedule();
  const dateNow = new Date().toISOString().slice(0,10);
  const tempConvertDateNow = new Date(dateNow);
  const dateFinish = datePlusSevenDays(tempConvertDateNow);

  const resultAllSchedule =  await (async function() {
    if ('caches' in window) {
      try {
        $('#schedule > .sc-first').html(loader());
        $('#schedule > .sc-next').html(loader());
        const responseTeam = await caches.match(GET_TEAMS_ENDPOINT);
        const responseMatch = await caches.match(GET_MATCHES_ENDPOINT(dateNow, dateFinish));
        if (responseTeam && responseMatch){
          const allTeamData = await responseTeam.json();
          const matchData = await responseMatch.json();
          fillScheduleHtml(matchData, allTeamData, savedMatchSchedule);
          const allFetchData = {
            'allTeamData': allTeamData,
            'matchData': matchData
          }
          return allFetchData
        }
      } catch {
      }
    }

    try {
      $('#schedule > .sc-first').html(loader());
      $('#schedule > .sc-next').html(loader());
      const responseTeam = await fetch(GET_TEAMS_ENDPOINT, HEADER);
      const responseMatch = await fetch(GET_MATCHES_ENDPOINT(dateNow, dateFinish), HEADER);
      if (responseTeam.status === 200 && responseMatch.status === 200) {
        const allTeamData = await responseTeam.json();
        const matchData = await responseMatch.json();
        fillScheduleHtml(matchData, allTeamData, savedMatchSchedule);
        const allFetchData = {
          'allTeamData': allTeamData,
          'matchData': matchData
        }
        return allFetchData
      }
    } catch (e) {
      console.log("Error : " + e);
      $('#schedule > .sc-next').replaceWith(FAILED_FETCH_MESSAGE);
    }
  })();

  return resultAllSchedule;
}

async function getSinggleMatch(match, buttonSave) {
  if ('caches' in window) {
    try {
      const responseTeam = await caches.match(GET_TEAMS_ENDPOINT);
      const responseById = await caches.match(GET_MATCHES_BY_ID_ENDPOINT(match.id));
      if(responseTeam && responseById) {
        const teamData = await responseTeam.json();
        const dataById = await responseById.json();
        fillSinggleScheduleHtml(match, buttonSave, teamData, dataById);
      }
    } catch {
    }
  }

  

  try {
    const responseTeam = await fetch(GET_TEAMS_ENDPOINT, HEADER);
    const responseById = await fetch(GET_MATCHES_BY_ID_ENDPOINT(match.id), HEADER);
    if (responseTeam.status === 200 && responseById.status === 200) {
      const teamData = await responseTeam.json();
      const dataById = await responseById.json();
      fillSinggleScheduleHtml(match, buttonSave, teamData, dataById);
    }
  } catch(e) {
    console.log("Error : " + e);
    $('#schedule > .sc-first').replaceWith(FAILED_FETCH_MESSAGE);
  }
}

export default {
  getStandings,
  getAllSchedule,
  getSinggleMatch,
}