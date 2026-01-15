class Calculator {
    constructor() {
        this.displayElement = document.getElementById('display');
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

            // Decimal
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
                this.animateButton('[data-action="backspace"]');
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
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
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
            this.calculate();
        }
        this.operation = op;
        this.previousValue = this.currentValue;
        this.shouldResetDisplay = true;
    }

    calculate() {
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
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format result
        if (result % 1 === 0) {
            this.currentValue = result.toString();
        } else {
            this.currentValue = result.toFixed(8).replace(/\.?0+$/, '');
        }

        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    showError(message) {
        this.displayElement.textContent = 'Error';
        setTimeout(() => {
            this.clear();
        }, 1500);
    }

    updateDisplay() {
        // Limit display length
        let displayValue = this.currentValue;
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        }
        this.displayElement.textContent = displayValue;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
