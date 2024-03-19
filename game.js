var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;



function nextSequence(){
    
    $("#level-title").text("Level " + level);
    level++;
    userClickedPattern.length = 0;
    var randomNumber = Math.floor(Math.random()*4);
    var randomColourChosen = buttonColours[randomNumber];
    gamePattern.push(randomColourChosen);
    console.log(randomColourChosen);
    $("#"+randomColourChosen).fadeOut(100).fadeIn(100);
    var audio = new Audio("./sounds/" + randomColourChosen + ".mp3");
    audio.play();
    
    
}
$(document).on("keydown", function(event){
    if(event.key == "a" || event.key == "A"){
    $("#level-title").text("Level " + level);
    nextSequence();}
    else alert("you pressed wrong key");
    
})

function playSound(name){
    var audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

$(".btn").on("click", function(){
    var userChosenColor = this.getAttribute("id");
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
    console.log(userClickedPattern);
    animatePress(userChosenColor);
    var index = userClickedPattern.length-1;
    checkAnswer(index);
});

function animatePress(currentColor){
    $("#" + currentColor).addClass("pressed");
    setTimeout( function(){
        $("#" + currentColor).removeClass("pressed");
    }, 100);

}

function checkAnswer(currentLevel){
    if(userClickedPattern[currentLevel] == gamePattern[currentLevel]){
        console.log("success");
        if(userClickedPattern.length == gamePattern.length){
        setTimeout(function(){
            nextSequence();
        }, 1000);
    }
    }
    else {
        console.log("wrong");
        var audio = new Audio("./sounds/wrong.mp3");
        audio.play();
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
}
}

function startOver(){
    level = 0;
    gamePattern.length = 0;
}






