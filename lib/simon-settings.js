// task specific variables
// var correct_responses = jsPsych.randomization.shuffle([["left arrow", 37],["right arrow", 39]])
// var choices = [37, 39]
var keyboard_codes = {q:81, p:80}
var correct_responses = {square:'q',  circle:'p'}// jsPsych.randomization.shuffle([["q", 81],["p", 80]])
var choices = ['q', 'p']

var num_practice_block = 1
var num_test_block = 1 // 4

var num_trials_per_condition = 8  
// var percent_congruent = 0.5
// var percent_valid_cue = 0.75


/* ************************************ */
  /* Define experimental variables */
  /* ************************************ */
  // generic task variables
  var run_attention_checks = false
  var attention_check_thresh = 0.45
  var sumInstructTime = 0 //ms
  var instructTimeThresh = 0 ///in seconds
  var credit_var = true
  