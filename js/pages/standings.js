const clickedButtonTotal = () => {
  $('#standings-total').show("toggle");
  $('#standings-home').hide("toggle");
  $('#standings-away').hide("toggle");
}

const clickedButtonHome = () => {
  $('#standings-total').hide("toggle");
  $('#standings-home').show("toggle");
  $('#standings-away').hide("toggle");
}

const clickedButtonAway = () => {
  $('#standings-total').hide("toggle");
  $('#standings-home').hide("toggle");
  $('#standings-away').show("toggle");
}

window.clickedButtonTotal = clickedButtonTotal;
window.clickedButtonHome = clickedButtonHome;
window.clickedButtonAway = clickedButtonAway;

export default {
  clickedButtonTotal,
  clickedButtonHome,
  clickedButtonAway
}