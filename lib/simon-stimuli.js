// cue_condition = ['valid', 'invalid']
var simon_factors = {
    simon_shape: ['square', 'circle'],
    simon_side: ['left', 'right'],
    simon_condition: ['congruent', 'incongruent']
} 
var simon_full_design = jsPsych.randomization.factorial(simon_factors, 1);

// define fixation
var fixation = {
    type: 'html-keyboard-response',
    stimulus: '+',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: { trial_id: "fixation"}
}

var simon_stimuli = []
for (var i in simon_full_design) {
    let simon_design = simon_full_design[i] 
    var curr_stimulus = {
        stimulus: "<div class = "+simon_design.simon_side+"box><div class = img-container><img src='images/"+simon_design.simon_shape+".png' /></div></div>",        
        data: {
            correct_response: keyboard_codes[correct_responses[simon_design.simon_shape]], // 81q, 80p
            stim_side:simon_design.simon_side,
            condition: simon_design.simon_condition,
        },
        key_answer: keyboard_codes[correct_responses[simon_design.simon_shape]]
    };
    // console.log(curr_stimulus)
    // simon_stimuli.push(fixation);
    simon_stimuli.push(curr_stimulus);
}

// define practice stimulis and practice block
var practice_stimuli = jsPsych.randomization.repeat(simon_stimuli, 2) // 8 * 1 = 8 per block
var practice_trials =  jsPsych.randomization.repeat(practice_stimuli, 1)

// define test stimuli and test blocks
var test_stimuli = jsPsych.randomization.repeat(simon_stimuli, num_trials_per_condition) // 8 * 10 = 80 per block
var test_trials = []
for (let i = 0; i < num_test_block; i++) { test_trials.push(jsPsych.randomization.repeat(test_stimuli, 1)) };

/* define test block */
function create_test_blocks(block_i) {
    var test_block = {
      type: 'poldrack-single-stim',
      timeline: test_trials[block_i],
      data: {
        trial_id: "stim",
        exp_stage: "test"
      },
      is_html: true,
      choices: choices,
      timing_response: 2000,
      timing_post_trial: post_trial_gap,
      on_finish: function(data){
        appendTestData(data)
      }
    }; 
    // console.log("test_block")
    // console.log(test_block)
    return test_block;
  } 
  