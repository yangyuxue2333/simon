/**
 * jspsych-image-button-response-pair
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["image-button-response-pair"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-button-response-pair', 'stimulus', 'image');

  plugin.info = {
    name: 'image-button-response-pair',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
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
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      avatar: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'avatar',
        default: undefined,
        description: 'The image to be displayed'
      },
      continue_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      ok: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'ok',
        default: undefined,
        description: 'The image to be displayed'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    if(typeof trial.choices === 'undefined'){
      console.error('Required parameter "choices" missing in image-button-response-pari');
    }
    if(typeof trial.stimulus === 'undefined'){
      console.error('Required parameter "stimulus" missing in image-button-response-pari');
    }

    // display stimulus
    var html = '<div class="pair-stimulus"><img src="'+trial.stimulus+'" id="jspsych-image-button-response-stimulus"></img></div>';
    // var html += '<img src="'+trial.stimulus+'" id="jspsych-image-button-response-stimulus"></img>';

    // dispaly avatar 
    if (trial.avatar != null) {
      html += '<div class="pair-avatar"><img src="'+trial.avatar+'" id="pair-avatar"></img><div>';
    }

    // dispaly avatar 
    if (trial.ok != null) {
      html += '<div class="pair-ok"><img src="'+trial.ok+'" id="pair-ok"></img><div>';
    }

    
    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    if (trial.continue_prompt !== null) {
      html += trial.continue_prompt;
    }


    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-image-button-response-btngroup">';

    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    display_element.innerHTML = html;

    // start timing
    var start_time = Date.now();

    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-image-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-image-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide button
    display_element.querySelector('.jspsych-btn').style.visibility = 'hidden';
    display_element.querySelector('#finish-prompt').style.visibility = 'hidden'; 
    display_element.querySelector('#pair-avatar').style.visibility = 'hidden';
    display_element.querySelector('#pair-ok').style.visibility = 'hidden';


    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-button-response-stimulus').style.visibility = 'hidden';
        display_element.querySelector('#waiting-prompt').style.visibility = 'hidden';
        display_element.querySelector('.jspsych-btn').style.visibility = 'visible';
        display_element.querySelector('#finish-prompt').style.visibility = 'visible'; 
        display_element.querySelector('#pair-avatar').style.visibility = 'visible';  
        display_element.querySelector('#pair-ok').style.visibility = 'visible';       
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
