
(function() {
  class Calculator {
    constructor(updateDisplayCallback = () => {}) {
      this.listeners = new Map();
      this._currentNumberBuffer = [];
      this._runningFunction = null;
      this._decimalMode = false;
      this._resultMode = false;
      this.updateDisplayCallback = updateDisplayCallback;

      this.addListener('clear', this.clear.bind(this));
      this.addListener('.', this.decimal.bind(this));

      // Setup function listeners
      Object.keys(Calculator.calculatorFeatures).forEach(name =>
        this.addListener(name, this.createFn(name, Calculator.calculatorFeatures[name]))
      );

      // Setup num buffer listeners
      for (let i = 0; i < 10; i++) {
        this.addListener(i + '', () => this.num(i));
      }
    }

    get currentNumber() {
      if (this._currentNumberBuffer.length === 0) return;
      const n = Number(this._currentNumberBuffer.join(''));
      return Number.isNaN(n) ? 0 : n;
    }
    get runningFunction() { return this._runningFunction; }
    get decimalMode() { return this._decimalMode; }

    addListener(event, fn) {
      const listeners = this.listeners.get(event) || [];
      listeners.push(fn);
      this.listeners.set(event, listeners);
    }

    dispatchEvent(event) {
      const listeners = this.listeners.get(event);
      if (listeners && listeners.length) listeners.forEach(fn => fn(event));
    }

    updateDisplay() {
      this.updateDisplayCallback({
        number: this.currentNumber || 0,
        runningFunction: this.runningFunction && this.runningFunction.name,
        decimalMode: this.decimalMode
      });
    }

    evalRunning() {
      if (!this.runningFunction) return;
      const newNumber = this.runningFunction.eval(this.currentNumber);

      // reset state to show result
      this._currentNumberBuffer = String(newNumber).split('');
    }

    createFn(name, fn) {
      return () => {
        // if a new value has been added, eval prev closure with new value
        if (!this._resultMode) this.evalRunning();

        this._runningFunction = {
          name,
          eval: fn(this.currentNumber)
        };
        this._resultMode = true;
        this._decimalMode = false;
        this.updateDisplay();
      }
    }

    clear() {
      this._currentNumberBuffer.length = 0;
      this._runningFunction = null;
      this._decimalMode = false;
      this._resultMode = false;

      this.updateDisplay();
    }

    decimal() {
      // if there is already a decimal, ignore
      if (this.decimalMode) return;
      this._decimalMode = true;

      // if current number buffer is empty, insert a preceding '0' before '.'
      if (this._currentNumberBuffer.length === 0) this.num('0');

      this.num('.');
      this.updateDisplay();
    }

    num(s) {
      // if displaying a result, clear number before setting new number
      if (this._resultMode) {
        this._currentNumberBuffer.length = 0;
        this._resultMode = false;
      }
      this._currentNumberBuffer = this._currentNumberBuffer || [];
      this._currentNumberBuffer.push(s);

      this.updateDisplay();
    }
  }

  Calculator.calculatorFeatures = {
    '+': (a, b) => b === undefined ? (c = 0) => a + c : a + b,
    '-': (a, b) => b === undefined ? (c = 0) => a - c : a - b,
    '*': (a, b) => b === undefined ? (c = 1) => a * c : a * b,
    '/': (a, b) => b === undefined ? (c = 1) => a / c : a / b
  };

  window.Calculator = Calculator;
})();