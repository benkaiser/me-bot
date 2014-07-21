var csv = require('ya-csv');
var fs = require('fs');
var async = require('async');

var filename = process.argv[2];
var username = process.argv[3];

var convo = [];
var replies = [];

var reader = csv.createCsvFileReader(filename, {
    'separator': ',',
    'quote': '',
    'escape': '+',
    'comment': '',
});

reader.addListener('data', function(data) {
  convo.push(data);
  if(data.length > 3){
    console.log(data[3]);
  }
});

reader.addListener('end', function(){
  process_data();
})


function process_data(){
  var input;
  var reply;
  for(var cnt = 0; cnt < convo.length-1; cnt++){
    if (convo[cnt][1] != convo[cnt+1][1]
      && convo[cnt+1][1] == username) {
        input = convo[cnt][2].toLowerCase();
        if(input.indexOf("|") != -1){
          input = input.substr(0, input.indexOf("|")).replace(/[^a-zA-Z0-9]/, " ", "g");
        }
        reply = convo[cnt+1][2];
        if(reply.indexOf("|") != -1){
          reply = reply.substr(0, reply.indexOf("|")).replace("+", ",", "g");
        }
        replies.push({
          input: input,
          output: reply,
          index: cnt
        });
    }
  }
  ask_question();
}

function ask_question(){
  async.whilst(
    function(){ return true; },
    function(callback){
      ask("You: ", function(result){
        var mostLike = find_most_like(result);
        // console.log("(input: " + mostLike.input + ")");
        console.log(username + ": " + mostLike.output);
        callback();
      })
    },
    function(err){
      console.log("Goodbye!");
    });
}

function find_most_like(input){
  // keep track of best
  var best_choice = { input: "", output: "", index: -1};
  var words_similar = 0;
  // create an associative array of the input
  var input_words = input.replace(/[^a-zA-Z0-9]/, " ", "g").toLowerCase().split(" ");
  var input_hash = [];
  for(var cnt = 0; cnt < replies.length; cnt++){
    var similar = 0;
    var different = 0;
    var found = true;
    // split the reply input words
    var input_sim_words = replies[cnt].input.split(" ");
    // make a tmp copy of the hash
    for(var x = 0; x < input_words.length; x++){
      found = false;
      for(var y = 0; y < input_sim_words.length; y++){
        if(input_words[x] == input_sim_words[y]){
          if(y == x){
            // bonus points for correct placement
            similar++;
          }
          similar++;
          found = true;
          break;
        }
        if(!found){
          different++
        }
      }
    }
    different+= Math.abs(input_words.length - input_sim_words.length);
    var sim_calc = similar-different/100;
    // is it the best?
    if(sim_calc > words_similar){
      words_similar = sim_calc;
      best_choice = replies[cnt];
    }
  }
  // random response
  // return replies[Math.floor(Math.random()*replies.length)];
  best_choice.points = words_similar;
  return best_choice;
}

function ask(question, callback) {
 var stdin = process.stdin, stdout = process.stdout;

 stdin.resume();
 stdout.write(question + ": ");

 stdin.once('data', function(data) {
   data = data.toString().trim();
   callback(data);
 });
}
