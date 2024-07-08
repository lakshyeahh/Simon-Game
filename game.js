var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;

var startTime, endTime;
var reactionTimes = [];
var numErrors = 0;
var gameStarted = false;

function nextSequence() {
    if (level === 0) {
        startTime = Date.now();
    }
    
    $("#level-title").text("Level " + level);
    level++;
    userClickedPattern.length = 0;
    var randomNumber = Math.floor(Math.random() * 4);
    var randomColourChosen = buttonColours[randomNumber];
    gamePattern.push(randomColourChosen);
    console.log(randomColourChosen);
    $("#" + randomColourChosen).fadeOut(100).fadeIn(100);
    var audio = new Audio("./sounds/" + randomColourChosen + ".mp3");
    audio.play();
}

$(document).on("keydown", function(event) {
    if (!gameStarted && (event.key == "a" || event.key == "A")) {
        $("#level-title").text("Level " + level);
        gameStarted = true;
        nextSequence();
    } else if (!gameStarted) {
        // alert("You pressed the wrong key");
    }
});

function playSound(name) {
    var audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

$(".btn").on("click", function() {
    if (!gameStarted) return;
    
    var userChosenColor = this.getAttribute("id");
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
    console.log(userClickedPattern);
    animatePress(userChosenColor);
    var index = userClickedPattern.length - 1;
    
    var currentTime = Date.now();
    var reactionTime = currentTime - (reactionTimes.length > 0 ? reactionTimes[reactionTimes.length - 1].timestamp : startTime);
    reactionTimes.push({ level: level, timestamp: currentTime, reactionTime: reactionTime });

    checkAnswer(index);
});

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length == gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        numErrors++;
        var audio = new Audio("./sounds/wrong.mp3");
        audio.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        endTime = Date.now();
        calculateStats();
        startOver();
    }
}
function calculateStats() {
    var totalTimeSpent = (endTime - startTime) / 1000; // in seconds
    var avgReactionTime = reactionTimes.reduce((sum, rt) => sum + rt.reactionTime, 0) / reactionTimes.length;
    var maxLevelAchieved = level - 1;
    var accuracyRate = ((level - 1 - numErrors) / (level - 1)) * 100; // Corrected accuracy rate
  
    // Update stats container
    var statsContainer = document.getElementById('stats');
    statsContainer.innerHTML =
      "<p>Total Time Spent: " + totalTimeSpent.toFixed(2) + " seconds</p>" +
      "<p>Average Reaction Time: " + avgReactionTime.toFixed(2) + " ms</p>" +
      "<p>Accuracy Rate: " + accuracyRate.toFixed(2) + " %</p>" +
      "<p>Number of Errors: " + numErrors + "</p>" +
      "<p>Maximum Level Achieved: " + maxLevelAchieved + "</p>";
  
    // Show stats container
    var modal = document.getElementById('statsContainer');
    modal.style.display = 'block';
  
    // Close modal when close button is clicked
    var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  
    // Close modal when clicking outside the modal content
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  }
  


function startOver() {
    level = 0;
    gamePattern.length = 0;
    numErrors = 0;
    reactionTimes = [];
    gameStarted = false;
}
