
/**
 * jspsych-image-keyboard-response-loading
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["jspsych-image-keyboard-response-loading"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-keyboard-response-loading', 'stimulus', 'image');

  plugin.info = {
    name: 'image-keyboard-response-loading',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      avatar : {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'avatar png',
        default: undefined,
        description: 'The avat gif content to be displayed.'
      }, 
      typing: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'typing gif',
        default: undefined,
        description: 'The avat gif content to be displayed.'
      },
      typing_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'typing duration',
        default: 500,
        description: 'How long is typing effect.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<img src="'+trial.stimulus+'" id="jspsych-image-keyboard-response-stimulus"></img>';

    // display avatar 
    if (trial.avatar !== null) {
      display_element.innerHTML += '<div class="avatar"><img id="avatar" src="'+trial.avatar+'"></img></div>';
    }
    // display typing effect 
    if (trial.typing != null) {
      display_element.innerHTML += '<div class="typing"><img id="typing" src="'+trial.typing+'"></img></div>';
    }

    
    // add prompt
    if (trial.prompt !== null){
      new_html += trial.prompt;
    }

    jsPsych.pluginAPI.setTimeout(function() {
      display_element.querySelector('#typing').style.display = 'none';
      display_element.querySelector('prompt').style.visibility = 'visible'; // hide
    }, trial.typing_duration);

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
