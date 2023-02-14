/**
 * jspsych-image-text
 *
 * Yuxue Yang
 *
 */


jsPsych.plugins['image-text'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'image-text',
    description: 'a picture description task',
    parameters: {
		stimulus: {
          type: jsPsych.plugins.parameterType.IMAGE,
          default: undefined,
          description: 'The image to be displayed'
        },
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'The string will be used to populate the response field with editable answer.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 10,
            description: 'The number of columns for the response text box.'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

/**
  The trial method is responsible for running a single trial.
  @display_element, is the DOM element where jsPsych content is being rendered.
  @trial, is an object containing all of the parameters specified in the corresponding TimelineNode.
  */
  plugin.trial = function(display_element, trial) {
	  // not define rows
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 1;
      }
    }
	// not define cols
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 40;
      }
    }
	// not define question values
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }

    var html = '';
	
	// add image
	var img = '';
    html += '<img src="'+trial.stimulus+'" id="jspsych-image-text-stimulus"></img>';
	
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-image-text-preamble" class="jspsych-image-text-preamble">'+trial.preamble+'</div>';
    }
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      html += '<div id="jspsych-image-text-"'+i+'" class="jspsych-image-text-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-image-text">' + trial.questions[i].prompt + '</p>';
      var autofocus = i == 0 ? "autofocus" : "";
      if(trial.questions[i].rows == 1){
        html += '<input type="text" name="#jspsych-image-text-response-' + i + '" size="'+trial.questions[i].columns+'" value="'+trial.questions[i].value+'" '+autofocus+'></input>';
      } else {
        html += '<textarea name="#jspsych-image-text-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" '+autofocus+'>'+trial.questions[i].value+'</textarea>';
      }
      html += '</div>';
    }

    // add submit button
    html += '<button id="jspsych-image-text-next" class="jspsych-btn jspsych-image-text">'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-image-text-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-image-text-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
