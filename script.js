class Calculator {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.subDisplayElement = document.getElementById('subDisplay');
        
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;

        this.initializeButtons();
        this.initializeKeyboard();
    }

    initializeButtons() {
        // Number buttons
        document.querySelectorAll('.btn-number').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                if (number !== null) {
                    this.appendNumber(number);
                }
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleAction(action);
            });
        });
    }

    initializeKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Numbers
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
                this.animateButton(`[data-number="${e.key}"]`);
            }

            // Operators
            if (e.key === '+') {
                this.handleAction('add');
                this.animateButton('[data-action="add"]');
            }
            if (e.key === '-') {
                this.handleAction('subtract');
                this.animateButton('[data-action="subtract"]');
            }
            if (e.key === '*') {
                this.handleAction('multiply');
                this.animateButton('[data-action="multiply"]');
            }
            if (e.key === '/') {
                e.preventDefault();
                this.handleAction('divide');
                this.animateButton('[data-action="divide"]');
            }

            // Utility Keys
            if (e.key === '%') {
                this.handleAction('percent');
                this.animateButton('[data-action="percent"]');
            }
            if (e.key === '.') {
                this.handleAction('decimal');
                this.animateButton('[data-action="decimal"]');
            }

            // Equals
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.handleAction('equals');
                this.animateButton('[data-action="equals"]');
            }

            // Clear
            if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.handleAction('clear');
                this.animateButton('[data-action="clear"]');
            }

            // Backspace
            if (e.key === 'Backspace') {
                this.handleAction('backspace');
            }
        });
    }

    animateButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 200);
        }
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentValue = number;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0') {
                this.currentValue = number;
            } else {
                this.currentValue += number;
            }
        }
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'negate':
                this.negate();
                break;
            case 'percent':
                this.percent();
                break;
            case 'decimal':
                this.addDecimal();
                break;
            case 'add':
                this.setOperation('+');
                break;
            case 'subtract':
                this.setOperation('-');
                break;
            case 'multiply':
                this.setOperation('×');
                break;
            case 'divide':
                this.setOperation('÷');
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        if (this.subDisplayElement) this.subDisplayElement.textContent = '';
        this.updateDisplay();
    }

    backspace() {
        if (this.shouldResetDisplay) return;
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    negate() {
        if (this.currentValue === '0') return;
        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.slice(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }
        this.updateDisplay();
    }

    percent() {
        const val = parseFloat(this.currentValue);
        if (isNaN(val)) return;
        this.currentValue = (val / 100).toString();
        this.updateDisplay();
    }

    addDecimal() {
        if (this.shouldResetDisplay) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    setOperation(op) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate(false);
        }
        this.operation = op;
        this.previousValue = this.currentValue;
        this.shouldResetDisplay = true;

        if (this.subDisplayElement) {
            this.subDisplayElement.textContent = `${this.previousValue} ${this.operation}`;
        }
    }

    calculate(finalCalculation = true) {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) {
            return;
        }

        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Error');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format result cleanly
        if (Number.isInteger(result)) {
            this.currentValue = result.toString();
        } else {
            this.currentValue = parseFloat(result.toFixed(8)).toString();
        }

        if (finalCalculation && this.subDisplayElement) {
            this.subDisplayElement.textContent = `${prev} ${this.operation} ${current} =`;
            this.operation = null;
            this.previousValue = '';
        }

        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    showError(message) {
        this.displayElement.textContent = message;
        if (this.subDisplayElement) this.subDisplayElement.textContent = '';
        setTimeout(() => {
            this.clear();
        }, 1500);
    }

    updateDisplay() {
        let displayValue = this.currentValue;
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            displayValue = isNaN(num) ? displayValue : num.toExponential(5);
        }
        this.displayElement.textContent = displayValue;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
