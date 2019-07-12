// when pages loads i want this function to execute
$(document).ready(function() {
  var characters = {
    "Obi-Wan Kenobi": {
      name: "Obi-Wan Kenobi",
      health: 120,
      attack: 8,
      imageUrl: "assets/images/obiwan.png",
      enemyAttackBack: 5
    },
    "Luke Skywalker": {
      name: "Luke Skywalker",
      health: 100,
      attack: 14,
      imageUrl: "assets/images/lukeskywalker.jpg",
      enemyAttackBack: 5
    },
    "Darth Sidious": {
      name: "Darth Sidious",
      health: 150,
      attack: 8,
      imageUrl: "assets/images/darthsidious.jpg",
      enemyAttackBack: 5
    },
    "Darth Maul": {
      name: "Darth Maul",
      health: 180,
      attack: 7,
      imageUrl: "assets/images/darthmaul.jpg",
      enemyAttackBack: 25
    }
  };
  console.log(characters);
  // will be populated when the player selects the character
  var currSelectedCharacter;
  // populated with all the characters the player didn't select
  var combatants = [];
  // the area the character is rendered too
  var currDefender;
  // will keep track of turns during combat
  var turnCounter = 1;
  // tracks number of defeated opponents
  var killCount = 0;

  // this function will render a characters card onto the page
  var renderOne = function(character, renderArea, charStatus) {
    var charDiv = $(
      "<div class='character' data-name='" + character.name + "'>"
    );
    var charName = $("<div class='character-name'>").text(character.name);
    var charImg = $("<img alt='image' class='character-image'>").attr(
      "src",
      character.imageUrl
    );
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv
      .append(charName)
      .append(charImg)
      .append(charHealth);
    $(renderArea).append(charDiv);

    // the selected character is an enemy or defender (active opponent)
    if (charStatus === "enemy") {
      $(charDiv).addClass("enemy");
    } else if (charStatus === "defender") {
      currDefender = character;
      $(charDiv).addClass("target-enemy");
    }
  };

  //function to handle rendering the game messages
  var renderMessage = function(message) {
    // builds the message and appends it to the page.
    var gameMessageSet = $("#game-message");
    var newMessage = $("<div>").text(message);
    gameMessageSet.append(newMessage);

    // if we get this specific message passed in, clear the message area.
    if (message === "clearMessage") {
      gameMessageSet.text("");
    }
  };

  // this function will render the characters
  var renderCharacters = function(charObj, areaRender) {
    if (areaRender === "#character-section") {
      $(areaRender).empty();
      // loop through the character objects and calls
      for (var key in charObj) {
        if (charObj.hasOwnProperty(key)) {
          renderOne(charObj[key], areaRender, "");
        }
      }
    }

    // users selected character if true then render this to the page
    if (areaRender === "#selected-character") {
      renderOne(charObj, areaRender, "");
    }

    // available to attack is the div where the inactive character to pick as your enemys sit
    if (areaRender === "#available-to-attack") {
      // loop through the combatants array and call the renderOne function
      for (var i = 0; i < charObj.length; i++) {
        renderOne(charObj[i], areaRender, "enemy");
      }

      // creates on click event for available enemies to fight
      $(document).on("click", ".enemy", function() {
        var name = $(this).attr("data-name");

        // if there is no defender, the click enemy will become the last fight
        if ($("#defender").children().length === 0) {
          renderCharacters(name, "#defender");
          $(this).hide();
          renderMessage("clearMessage");
        }
      });
    }
    // defender is the div where the active opponent appears and if true, render the selected enemy to this location
    if (areaRender === "#defender") {
      $(areaRender).empty();
      for (var i = 0; i < combatants.length; i++) {
        if (combatants[i].name === charObj) {
          renderOne(combatants[i], areaRender, "defender");
        }
      }
    }

    // render defenders attack
    if (areaRender === "playerDamage") {
      $("#defender").empty();
      renderOne(charObj, "#defender", "defender");
    }

    // re-render players character when attacked
    if (areaRender === "enemyDamage") {
      $("#selected-character").empty();
      renderOne(charObj, "#selected-character", "");
    }

    // remove defeated enemy
    if (areaRender === "enemyDefeated") {
      $("#defender").empty();
      var gameStateMessage =
        "You have defeated " +
        charObj.name +
        ", you can choose to fight another enemy.";
      renderMessage(gameStateMessage);
    }
  };

  //  function which handles restarting the game after victory or defeat.
  var restartGame = function(inputEndGame) {
    // when restart button is clicked, reload the page.
    var restart = $("<button>Restart</button>").click(function() {
      location.reload();
    });

    // build div that will display the victory/defeat message.
    var gameState = $("<div>").text(inputEndGame);

    // render the restart button and victory/defeat message.
    $("body").append(gameState);
    $("body").append(restart);
  };

  // render all character to page when game starts
  renderCharacters(characters, "#character-section");

  // on click event for selecting our characters
  $(document).on("click", ".character", function() {
    var name = $(this).attr("data-name");
    console.log(name);
    // if player has not been selected yet
    if (!currSelectedCharacter) {
      // we populate populate with selected character
      currSelectedCharacter = characters[name];
      for (var key in characters) {
        if (key !== name) {
          combatants.push(characters[key]);
        }
      }

      // hide the character select div
      $("#character-section").hide();

      // then render our selected characters and our enemys
      renderCharacters(currSelectedCharacter, "#selected-character");
      renderCharacters(combatants, "#available-to-attack");
    }
  });

  // when you click the attack button run the following logic from this click function
  $("#attack-btn").on("click", function() {
    if ($("#defender").children().length !== 0) {
      // created message for our attack and our opponents attack.
      var attackMessage =
        "You attacked " +
        currDefender.name +
        " for " +
        currSelectedCharacter.attack * turnCounter +
        " damage.";
      var counterAttackMessage =
        currDefender.name +
        " attacked you back for " +
        currDefender.enemyAttackBack +
        " damage.";
      renderMessage("clearMessage");

      // reduce defenders health by your attack value
      currDefender.health -= currSelectedCharacter.attack * turnCounter;

      // if enemy still has health
      if (currDefender.health > 0) {
        // update enemy character card
        renderCharacters(currDefender, "playerDamage");

        // render combat messages
        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        // reduce your health by the opponent attack
        currSelectedCharacter.health -= currDefender.enemyAttackBack;

        // render the updated player card
        renderCharacters(currSelectedCharacter, "enemyDamage");

        if (currSelectedCharacter.health <= 0) {
          renderMessage("clearMessage");
          restartGame("You have been defeated... GAME OVER!!");
          $("#attack-btn").unbind("click");
        }
      }    else {
        // remove opponent charcter card if defeated
        renderCharacters(currDefender, "enemyDefeated");
        // increment kill count
        killCount++;
        // if you killed all the opponents you win.
        if (killCount >= 3) {
          renderMessage("clearMessage");
          restartGame("You Won!!!! GAME OVER!!");
        }
      }
    } 

    turnCounter++;
  });
});
