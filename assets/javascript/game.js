var starWarsRPG = {
//     CharCreator: function(name,health,attackDmg,model) {
//     this.name = name;
//     this.health = health;
//     this.attackDmg = attackDmg;
//     this.model = model;
// },
    characters: {
    luke: {name: "luke", charName:"Luke" , health: 100, damage: 5, model: "assets/images/characters/LukeSkywalker.png"},
    obiwan: {name: "obiwan", charName:"Obi-Wan", health: 120 ,damage: 8, model: "assets/images/characters/obiwankenobi.webp"},
    maul: {name: "maul", charName:"Darth Maul", health: 180, damage: 25, model: "assets/images/characters/DarthMaul.jpeg"},
    sidious: {name: "sidious", charName:"Darth Sidious", health: 150, damage: 20, model: "assets/images/characters/darthSidious.jpg"}
    },
    attacker: {
        attackerCount: 0,
        attackersAllowed: 1,
        id: "",
        health: 0,
        damage: 0,
    },
    defender: {
        defendersAllowed: 1,
        id: "",
        health: 0,
        damage: 0,
    }
}  

    
    // on load, create imgs for each and append to the top div
        //add a $click to move to Your character div and move the other cards to the enemies available to attack div
        //when in enemies div, have $click to move to defender div and if there is a defender there, do nothing on click
    
    //$button click for attack to grab the attack values for hero and defender and subtract for health appropriately. 
        //If heroHP <= 0 lose, else if enemy hp is <=0 remove from game / hide, else reduce hp by attack values
        //If lose or all enemies are gone, show reset button

    //reset button function to be called on reset click. Set all game values back to original.
for (var key in starWarsRPG.characters) {

    var obj = starWarsRPG.characters[key];

    var characterBox = $("<div>");

    characterBox.addClass("characterBox");
    characterBox.attr("data-damage", obj["damage"]);
    characterBox.attr("data-health", obj["health"]);
    characterBox.attr("data-name", obj["charName"]);
    characterBox.text(obj["charName"])
    characterBox.attr("id", obj["name"]);

    var characterBoxImg = $("<img>");

    characterBoxImg.addClass("characterBoxImg");
    characterBoxImg.attr("src", obj["model"]);

    
    $("#begin-location").append(characterBox);
    $(`#${obj["name"]}`).append(characterBoxImg);

}

$(".characterBox").click(function(){
    if (starWarsRPG.attacker.attackerCount < starWarsRPG.attacker.attackersAllowed){
        starWarsRPG.attacker.attackerCount++ 
        $("#selected-character").append(this);
        $("non-selected-character").append(".characterBox");
    }
})