// when pages loads i want this function to execute
$(document).ready(function(){
    var characters = {
        "Obi-Wan Kenobi": {
            name: "Obi-Wan Kenobi",
            heath: 120,
            attack: 8,
            imageUrl: "assets/images/obiwan.png",
            enemyAttackBack: 5
        },
        "Luke Skywalker": {
            name: "Luke Skywalker",
            heath: 100,
            attack: 14,
            imageUrl: "assets/images/lukeskywalker.jpg",
            enemyAttackBack: 5
        },
        "Darth Sidious": {
            name: "Darth Sidious",
            heath: 150,
            attack: 8,
            imageUrl: "assets/images/darthsidious.jpg",
            enemyAttackBack: 5
        },
        "Darth Maul": {
            name: "Darth Maul",
            heath: 180,
            attack: 7,
            imageUrl: "assets/images/darthmaul.jpg",
            enemyAttackBack: 25
        },
    };
    console.log(characters);

// the area the character is rendered too
 var renderOne = function(character, renderArea) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImg = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    charDiv.append(charName).append(charImg).append(charHealth);
    $(renderArea).append(charDiv);
 }
 // this function will render the characters
 var renderCharacters = function(charObi, areaRender) {
    if(areaRender === "#characters-section") {
        $(areaRender).empty();
        for(var key in charObi) {
            if(charObi.hasOwnProperty(key)) {
                renderOne(charObi[key], areaRender);
            };
        };
    };
 };

    // render all character to page when game starts 
    renderCharacters(characters, "#character-section");
});



