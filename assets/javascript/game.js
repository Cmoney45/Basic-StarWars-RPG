var starWarsRPG = {
//     CharCreator: function(name,health,attackDmg,model) {
//     this.name = name;
//     this.health = health;
//     this.attackDmg = attackDmg;
//     this.model = model;
// },
    characters: {
    luke: {
        name: "luke", 
        charName:"Luke Skywalker" , 
        health: 100, 
        damage: 14, 
        model: "assets/images/characters/LukeSkywalker.png"},
    obiwan: {
        name: "obiwan", 
        charName:"Obi-Wan Kenobi", 
        health: 120 ,
        damage: 10, 
        model: "assets/images/characters/obiwankenobi.webp"},
    maul: {
        name: "maul", 
        charName:"Darth Maul", 
        health: 180, 
        damage: 25, 
        model: "assets/images/characters/DarthMaul.jpeg"},
    sidious: {
        name: "sidious", 
        charName:"Darth Sidious", 
        health: 150, 
        damage: 20, 
        model: "assets/images/characters/darthSidious.jpg"}
    },
    attacker: {
        attackerCount: 0,
        attackersAllowed: 1,
        id: "",
        attackerName: "",
        health: 0,
        damage: 0,
        staticDamage: 0,
        attackCalculation: function(){
            var attackValue = this.damage;
            this.damage = this.damage + this.staticDamage;
            return attackValue;
        }
    },
    defender: {
        defenderCount:0,
        defendersAllowed: 1,
        id: "",
        defenderName: "",
        health: 0,
        damage: 0,
    },
}  

let characterCount = Object.keys(starWarsRPG.characters).length;


function resetGame() {
    starWarsRPG.attacker.attackerCount = 0;
    starWarsRPG.defender.defenderCount = 0;
    characterCount = Object.keys(starWarsRPG.characters).length - 1;


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
            $(`#${obj["name"]}`).append(`<div id=${obj["name"]}healthPool>${obj["health"]}</div>`)

        }
}

resetGame();

$("body").on("click","#attack", function(){
    let attacker = starWarsRPG.attacker;
    let defender = starWarsRPG.defender;

    if( attacker.attackerCount < 1){
        $("#attack-dialogue").text("Please choose a character to play as.");
    } else if (defender.defenderCount < 1) {
        $("#attack-dialogue").text("Please choose a character to attack.");
    } else {
        var attackerDmg = attacker.attackCalculation();
        var defenderDmg = defender.damage;
        defender.health = defender.health - attackerDmg;
        $(`#${defender.id}healthPool`).html(defender.health);
        if (defender.health <= 0){
            $(".currentEnemy").removeClass("enemy")
            $(".currentEnemy").remove();
            defender.defenderCount = 0;
            characterCount--;

            if( characterCount === 0){
                $("#attack-dialogue").text("Congratulations! You've defeated all enemies you are the Jedi Master!");
                $(".resetButton").removeAttr("id");
            } else {
            $("#attack-dialogue").text(`Well done! You defeated ${defender.id}! Choose another enemy to fight!`)
            }

        } else { 
            attacker.health = attacker.health - defenderDmg;
            if (attacker.health <= 0){
                attacker.health = 0;
                $(`#${attacker.id}healthPool`).html(attacker.health);
                $("#attack-dialogue").html(`You have been defeated by ${defender.defenderName}. You lose!`);
                $(".resetButton").removeAttr("id");
            } else {
                $(`#${attacker.id}healthPool`).html(attacker.health);
                $("#attack-dialogue").html(`You attacked ${defender.defenderName} for ${attackerDmg} damage.<br>
                ${defender.defenderName} attacked you for ${defenderDmg} damage.`)
            }
        }
    }
})

$("body").on("click", ".characterBox", function(){
    let attacker = starWarsRPG.attacker;

    if (attacker.attackerCount < attacker.attackersAllowed){
        attacker.attackerCount++ 
        $("#non-selected-character").append($(".characterBox"));
        $(".characterBox").addClass("enemy")
        $("#selected-character").append(this);
        $(this).removeClass("enemy");
        $(this).addClass("playerCharacter");
        attacker.id = $(this).attr("id");
        attacker.attackerName = $(this).attr("data-name");
        attacker.health = parseInt($(this).attr("data-health"));
        attacker.damage = parseInt($(this).attr("data-damage"));
        attacker.staticDamage = parseInt($(this).attr("data-damage"));

    }
})

$("body").on("click", ".enemy", function(){
    let defender = starWarsRPG.defender;

    if (defender.defenderCount < defender.defendersAllowed){
        defender.defenderCount++;
        $("#current-enemy").append(this);
        $(this).addClass("currentEnemy");
        defender.defenderName = $(this).attr("data-name");
        defender.id = $(this).attr("id");
        defender.health = parseInt($(this).attr("data-health"));
        defender.damage = parseInt($(this).attr("data-damage"));
        $("#attack-dialogue").html(`You have selected ${defender.id} to be your opponent.<br>
        Click the attack button to start the fight.`)

    }
})

$("body").on("click",".resetButton", function(){
    $("#attack-dialogue").empty();
    $("#selected-character").empty();
    $("#non-selected-character").empty();
    $("#current-enemy").empty();
    resetGame();
    $(".resetButton").attr("id","resetKey");
})