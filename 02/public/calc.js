(function() {

  function getHandleButtonClick(calc) {
    return function (event) {
      const button = event.target.getAttribute('data-button-val');
      calc.dispatchEvent(button);
    }
  }

  function handleUpdateDisplay({number, runningFunction, decimalMode}) {
    const display = document.querySelector('.calc .display');
    display.innerText = number;

    const buttons = document.querySelectorAll('.calc .button');
    buttons.forEach(e => e.classList.remove('listening'));
    const runningFunctionButton =
      Array.prototype.find.call(buttons, b => b.getAttribute('data-button-val') === runningFunction);
    if (runningFunctionButton) {
      runningFunctionButton.classList.add('listening');
    }

    if (decimalMode) {
      document.querySelector('.calc .button[data-button-val="."]').classList.add('listening');
    } else {
      document.querySelector('.calc .button[data-button-val="."]').classList.remove('listening');
    }
  }

  function init() {
    // create Calculator and connect display
    const calculator = new Calculator(handleUpdateDisplay);

    // connect button events
    const buttons = document.querySelectorAll('.calc .button');
    for (const button of buttons) {
      button.addEventListener('click', getHandleButtonClick(calculator));
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
