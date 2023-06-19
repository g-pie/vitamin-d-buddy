// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================
var puffleHat;
var puffleGlasses;
var puffleBody;
var puffleName;
var glasses    = ["no_glasses", "red_heart_sunglasses", "3d_glasses"];
var hats       = ["no_hat", "cowboy_hat", "santa_hat"]
var tabs       = ["nav-body-color-tab", "nav-eye-color-tab", "nav-accessories-tab"];
var tabContent = ["body-color-grid", "eye-color-grid", "accessories-grid"]
var puffle = {
  "bodyColor": "purple",
  "glasses": "no_glasses",
  "hat": "no_hat",
  "name": "Buddy",
};

// ==============================================
// ============ Functional Code =================
// ==============================================

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  puffleBody = document.getElementById("puffle-body");
  puffleHat = document.getElementById("puffle-hat");
  puffleGlasses = document.getElementById("puffle-glasses");
  puffleName = document.getElementById("bud-name");

  puffle.name = puffleName.innerHTML;

  // add event listener for name input
  var nameGet = document.getElementById("name-input");
  nameGet.addEventListener("keyup", function(){
    if (event.keyCode === 13){
      editName();
    }
  });
});

function hideDiv(divID) {
  changeDivDisplay(divID, 'none');
}

function showDivBlock(divID) {
  console.log(`showing ${divID}`)
  changeDivDisplay(divID, 'block');
}

function showDivFlex(divID) {
  changeDivDisplay(divID, 'flex')
}

function changeDivDisplay(divID, val) {
  $(`#` + divID).css('display', val);
}

function showTab(divID) {
  // Change tabContent display to show
  // and hide all others
  tabs.forEach((tabID, idx) => {
    if (tabID === divID) {
      // console.log(`showing ${tabID}`)
      showDivFlex(tabContent[idx]);
      
      // show tab as active
      document.getElementById(tabID).className += " active";
    } else {
      // console.log(`hiding ${tabID}`)
      hideDiv(tabContent[idx]);

      // reset tab
      document.getElementById(tabID).className = "nav-link";
    }
  })
}

function updatePuffleBody(color) {
  puffle.bodyColor = color;
  puffleBody.src = `/static/src/puffle/${color}_puffle.png`;

  bodyColorGrid = document.getElementById("body-color-grid");
  for (let i = 0; i < bodyColorGrid.children.length; i++) {
    colorOption = bodyColorGrid.children[i];
    if (colorOption.title === color) {
      colorOption.className += " option-picked";
    } else {
      colorOption.className = "color-option";
    }
  }

  // $("input[type=hidden][name=bodyColor]")
  $("#color-input").val(`${color}_puffle.png`);
  // console.log(`/static/src/puffle/${color}_puffle.png`);
}

function updatePuffleHat(accessory) {
  puffle.hat = accessory;
  updateAccessory(accessory, false);
}

// TODO: fix repeated code
function updatePuffleGlasses(accessory) {
  puffle.glasses = accessory;
  updateAccessory(accessory, true);
}

function updateAccessory(accessory, isGlasses) {  
  // TODO: fix this
  const puffleAccessory = (isGlasses ? puffleGlasses : puffleHat);
  const puffleAccessoryId = (isGlasses ? "puffle-glasses" : "puffle-hat");
  const puffleInputId = (isGlasses ? "#glasses-input" : "#hat-input");
  const accessory_src = `/static/src/accessories/${accessory}.png`;
  puffleAccessory.src = accessory_src;

  // update class for all other accessories
  let accessoriesList = (isGlasses ? glasses : hats);
  accessoriesList.forEach((accessoryID) => {
    let accessoryOption = document.getElementById(accessoryID);
    if (accessoryID === accessory) {
      accessoryOption.className += " option-picked";
    } else {
      accessoryOption.className = "accessory-option";
    }
  })

  $(puffleInputId).val(`${accessory}.png`);

  showDivBlock(puffleAccessoryId);
  // console.log(puffle)
}

function hideGlasses() {
  hideAccessory(true);
}

function hideHat() {
  hideAccessory(false);
}

function hideAccessory(isGlasses) {
  const puffleAccessoryId = (isGlasses ? "puffle-glasses" : "puffle-hat");
  const puffleInputId = (isGlasses ? "#glasses-input" : "#hat-input");
  hideDiv(puffleAccessoryId);

  let accessoriesList = (isGlasses ? glasses : hats);
  let noAccessoryID = (isGlasses ? "no_glasses" : "no_hat");
  accessoriesList.forEach((accessoryID) => {
    let accessoryOption = document.getElementById(accessoryID);
    if (accessoryID === noAccessoryID) {
      accessoryOption.className += " option-picked";
    } else {
      accessoryOption.className = "accessory-option";
    }
  })

  $(puffleInputId).val("");
}

function postPuffle() {
  console.log('puffle: ');
  console.log(puffle);
  $.ajax({
    type: 'POST',
    url: '/customize/',
    contentType: "application/json",
    data: JSON.stringify(puffle),
    dataType: "json",
    success: () => { console.log('posted accessories'); }
    // error: (err) => { console.log(err); }
  });
}

function editName() {
  // Get new name value
  newName = document.getElementById('name-input').value;

  // update buddy info and html
  puffle.name = newName;
  puffleName.innerHTML = newName;

  $("#form-name-input").val(newName);
  
  // hide div
  console.log(puffle);
  hideDiv('edit-name-view');
}


// PASS JAVASCRIPT TO FLASK
/*

  -- .js --
  // some movie data
  var movies = {
      'title': movie_title,
      'release_date': movie_release_date
      }

  $.ajax({
  url: Flask.url_for('my_function'),
  type: 'POST',
  data: JSON.stringify(movies),   // converts js value to JSON string
  })
  .done(function(result){     // on success get the return object from server
      console.log(result)     // do whatever with it. In this case see it in console
  })

  -- .py --
  from flask import request, jsonify, render_template
  import sys

  @app.route("/function_route", methods=["GET", "POST"])
  def my_function():
      if request.method == "POST":
          data = {}    // empty dict to store data
          data['title'] = request.json['title']
          data['release_date'] = request.json['movie_release_date']

        // do whatever you want with the data here e.g look up in database or something
        // if you want to print to console

          print(data, file=sys.stderr)

          // then return something back to frontend on success

          // this returns back received data and you should see it in browser console
          // because of the console.log() in the script.
          return jsonify(data)
      else:
          return render_template('the_page_i_was_on.html')
*/