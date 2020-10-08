import Db from '../db.js';

function getAllSavedSchedule() {
  Db.dbGetAllSavedSchedule().then(function(allMatch) {
    let htmlMatch = `
      <div class="center-align">
        <br>
        <br>
        <span>*No Schedule Saved*</span>
        <br>
        <i class="material-icons">turned_in_not</i>
      </div>
    `;
    if(allMatch.length > 0){
      htmlMatch = ``;
    }
    allMatch.forEach((match, count) => {
      htmlMatch += `
      <div class="row card-schedule ahead">
        <div class="team-image home">
          <img
            src="${match.urlHomeTeam}"
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
            src="${match.urlAwayTeam}"
            alt="${match.awayTeam.name} image">
        </div>
        <div
          class="unsave-schedule-ahead"
          id="buttonUnsave${match.matchId}"
          onclick="unsaveScheduleClicked(${match.matchId})">
          Unsave Schedule
        </div>
      </div>
      `
    })
    $('#matchSaved').replaceWith(htmlMatch);
  });
}

const unsaveScheduleClicked = (matchId) => {
  const buttonId = `buttonUnsave${matchId}`;
  const htmlToast = `
    Match Schedule Unsaved Successfully
  `;

  Db.dbUnsaveMatchSchedule(matchId);

  M.toast({html: htmlToast});
  $(`#${buttonId}`).parent().remove();
}

window.unsaveScheduleClicked = unsaveScheduleClicked;

export default {
  getAllSavedSchedule,
  unsaveScheduleClicked
}