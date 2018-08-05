var starWarsRPG = {
    characters: {
        luke: {
            name: "luke", 
            charName:"Luke Skywalker" , 
            health: 100, 
            damage: 14, 
            model: "assets/images/characters/LukeSkywalker.png",
            fightMusic: "lamusica",
            background: "assets/images/background/lukebg2.jpg",
            winMusic: "music"
        },
        obiwan: {
            name: "obiwan", 
            charName:"Obi-Wan Kenobi", 
            health: 120 ,
            damage: 10, 
            model: "assets/images/characters/obiwankenobi.webp",
            fightMusic: "assets/sounds/battlemusic/battle_of_the_heroes.mp3",
            background: "assets/images/background/jeditemple.jpg",
            winMusic: "music"
        },
        maul: {
            name: "maul", 
            charName:"Darth Maul", 
            health: 180, 
            damage: 25, 
            model: "assets/images/characters/DarthMaul.jpeg",
            fightMusic: "assets/sounds/battlemusic/duel_of_the_fates.mp3",
            background: "assets/images/background/Theed_Generator_Complex.png",
            winMusic: "music"
        },
        sidious: {
            name: "sidious", 
            charName:"Darth Sidious", 
            health: 150, 
            damage: 20, 
            model: "assets/images/characters/darthSidious.jpg",
            fightMusic: "assets/sounds/battlemusic/emperor_theme.mp3",
            background: "assets/images/background/ROTJ_Throne_Room.png",
            winMusic: "music"
        },
    },
    attacker: {
        attackerCount: 0,
        attackersAllowed: 1,
        id: "",
        attackerName: "",
        health: 0,
        damage: 0,
        staticDamage: 0,
        victoryTune: "",
        background: "",
        attackCalculation: function(){
            let attackValue = this.damage;
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
        music: "",
        background: "",
    },
    resetGame: function() {
    // clean up code to reduce repeated naming
    starWarsRPG.attacker.attackerCount = 0;
    starWarsRPG.defender.defenderCount = 0;
    //Set characters you need to defeat to total characters less one(the player character) 
    characterCount = Object.keys(starWarsRPG.characters).length - 1;

        for (let key in starWarsRPG.characters) {

            let obj = starWarsRPG.characters[key];
            let characterBox = $("<div>");

            characterBox.addClass("characterBox");
            characterBox.attr("data-damage", obj["damage"]);
            characterBox.attr("data-health", obj["health"]);
            characterBox.attr("data-name", obj["charName"]);
            characterBox.text(obj["charName"])
            characterBox.attr("id", obj["name"]);

            let characterBoxImg = $("<img>");

            characterBoxImg.addClass("characterBoxImg");
            characterBoxImg.attr("src", obj["model"]);

            $("#begin-location").append(characterBox);
            $(`#${obj["name"]}`).append(characterBoxImg);
            $(`#${obj["name"]}`).append(`<div id=${obj["name"]}healthPool>${obj["health"]}</div>`)
        }  
    },
    theme: {
        lightsaberNoises: ["noise1","noise2","noise3","noise4"],
        music:"assets/sounds/star_wars_main_theme.mp3",
        background:"assets/images/background/starwarstitlescreen.png",
        playAudio: function() {
            document.getElementById("audio").play();
        },
        pauseAudio: function() {
            document.getElementById("audio").pause();
        }
    }
}  

//Initiate game with inital board layout
starWarsRPG.resetGame();

// Click event for the attack button. 
$("body").on("click","#attack", function(){
    let attacker = starWarsRPG.attacker;
    let defender = starWarsRPG.defender;

    if( attacker.attackerCount < 1){
        $("#attack-dialogue").text("Please choose a character to play as.");

    } else if (defender.defenderCount < 1) {
        if (characterCount > 0) {
        $("#attack-dialogue").text("Please choose a character to attack.");
        } else {
            $("#attack-dialogue").html("You have defeated all the enemies! Click the reset button if you would like to play again!");
        }

    } else if(attacker.health <= 0) {
        $("#attack-dialogue").html(`You have been defeated by ${defender.defenderName}. You lose!`);
        } else {
        let attackerDmg = attacker.attackCalculation();
        let defenderDmg = defender.damage;

        defender.health = defender.health - attackerDmg;
        $(`#${defender.id}healthPool`).html(defender.health);

        if (defender.health <= 0){
            $(".currentEnemy").removeClass("enemy")
            $(".currentEnemy").remove();
            defender.defenderCount = 0;
            characterCount--;

            if( characterCount === 0){
                $("#attack-dialogue").text("Congratulations! You've defeated all enemies you are the most powerful force user!");
                $("body").css("background-image", `url(${attacker.background})`);
                $(".resetButton").removeAttr("id");
            } else {
            $("#attack-dialogue").text(`Well done! You defeated ${defender.defenderName}! Choose another enemy to fight!`)
            $("body").css("background-image", `url(${attacker.background})`);
            starWarsRPG.theme.pauseAudio;
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

$("#playAudio").on("click", starWarsRPG.theme.playAudio);
$("#pauseAudio").on("click", starWarsRPG.theme.pauseAudio);

//First click event for choosing your character
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
        attacker.background = starWarsRPG.characters[attacker.id].background;
        $("body").css({
            "background-image":`url(${attacker.background})`,
            // TODO: Was trying to get images to stretch and not repeat but couldn't get to work.
            // "background-repeat":"no-repeat",
            // "background-position":"center",
            // "-webkit-background-size":"cover",
            // "-moz-background-size":"cover",
            // "-o-background-size":"cover"
        });
    }
})

//Enemy click event to choose your enemy
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
        $("#attack-dialogue").html(`You have selected ${defender.defenderName} to be your opponent.<br>
        Click the attack button to start the fight.`)
        defender.background = starWarsRPG.characters[defender.id].background;
        $("body").css("background-image", `url(${defender.background})`);
        $("#audio").attr("src", starWarsRPG.characters[defender.id].fightMusic);
        $("#audio")[0].play();

    }
})

//Reset button click event
$("body").on("click",".resetButton", function(){
    $("#attack-dialogue").empty();
    $("#selected-character").empty();
    $("#non-selected-character").empty();
    $("#current-enemy").empty();
    starWarsRPG.resetGame();
    $(".resetButton").attr("id","resetKey");
    $("body").css("background-image", `url(${starWarsRPG.theme.background})`);
    $("#audio").attr("src", starWarsRPG.theme.music);
    $("#audio")[0].play();
})

$("#playAudio").on("click", starWarsRPG.theme.playAudio);
$("#pauseAudio").on("click", starWarsRPG.theme.pauseAudio);