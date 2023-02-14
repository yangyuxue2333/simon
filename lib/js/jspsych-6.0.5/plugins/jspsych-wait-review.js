/**
 * jspsych plugin for wait-review trials with feedback
 * cher yang
 *
 * documentation: docs.jspsych.org
 **/


jsPsych.plugins['wait-review'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('wait-review', 'stimulus', 'image');

  plugin.info = {
    name: 'wait-review',
    description: '',
    parameters: {
      stimulus1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image content1 to be displayed.'
      },
      stimulus2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image content2 to be displayed.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        array: true,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      text_answer: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text answer',
        default: null,
        description: 'Label that is associated with the correct answer.'
      },
      wait_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      continue_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      show_stim_with_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        no_function: false,
        description: ''
      },
      show_feedback_on_timeout: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show feedback on timeout',
        default: false,
        description: 'If true, stimulus will be shown during feedback. If false, only the text feedback will be displayed during feedback.'
      },
      timeout_message: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Timeout message',
        default: "<p>Please respond faster.</p>",
        description: 'The message displayed on a timeout non-response.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial'
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration',
        default: 2000,
        description: 'How long to show feedback.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // display stimulus 1 - avatar 
    if (trial.stimulus1 !== null) {
      display_element.innerHTML = '<div class="avatar"><img id="avatar" src="'+trial.stimulus1+'"></img></div>';
    }
    // display stimulus 2 - typing effect 
    if (trial.stimulus2 != null) {
      display_element.innerHTML += '<div class="typing"><img id="typing" src="'+trial.stimulus2+'"></img></div>';
    }

     // if prompt is set, show prompt
    if (trial.wait_prompt !== null) {
      display_element.innerHTML += trial.wait_prompt;
    }

    // hide typing effect after time if the timing parameter is set
    // var wipeout_time = Math.floor(Math.random() * ((500-300)+1) + 500);
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#finish-review').style.visibility = 'hidden';
        display_element.querySelector('#wait-review').style.visibility = 'hidden'; // hide
        display_element.innerHTML += trial.continue_prompt;
      }, trial.stimulus_duration);
    }

    var trial_data = {};

    // create response function
    var after_response = function(info) {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      var correct = false;
      if (trial.key_answer == info.key) {
        correct = true;
      }
      display_element.innerHTML = '';
    }

    jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: false,
      allow_held_key: false
    });

    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        after_response({
          key: null,
          rt: null
        });
      }, trial.trial_duration);
    }

    endTrial();

    function endTrial() {
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
