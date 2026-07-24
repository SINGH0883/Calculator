class ScientificCalculator {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.subDisplayElement = document.getElementById('subDisplay');
        this.angleModeBtn = document.getElementById('angleModeBtn');
        this.secondFuncBtn = document.getElementById('secondFuncBtn');
        this.memoryIndicator = document.getElementById('memoryIndicator');

        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.isRad = false;       // Default is DEG (Degrees)
        this.isSecondFunc = false; // Default 1st function layer
        this.memory = 0;

        this.initializeButtons();
        this.initializeControls();
        this.initializeKeyboard();
    }

    initializeControls() {
        // Toggle DEG / RAD Angle Mode
        if (this.angleModeBtn) {
            this.angleModeBtn.addEventListener('click', () => {
                this.isRad = !this.isRad;
                this.angleModeBtn.textContent = this.isRad ? 'RAD' : 'DEG';
                this.angleModeBtn.classList.toggle('active', this.isRad);
            });
        }

        // Toggle 2nd Inverse Functions
        if (this.secondFuncBtn) {
            this.secondFuncBtn.addEventListener('click', () => {
                this.isSecondFunc = !this.isSecondFunc;
                this.secondFuncBtn.classList.toggle('active', this.isSecondFunc);
                this.updateSecondFuncUI();
            });
        }
    }

    updateSecondFuncUI() {
        const btnSin = document.getElementById('btnSin');
        const btnCos = document.getElementById('btnCos');
        const btnTan = document.getElementById('btnTan');
        const btnLn = document.getElementById('btnLn');
        const btnLog = document.getElementById('btnLog');
        const btnSqrt = document.getElementById('btnSqrt');
        const btnSqr = document.getElementById('btnSqr');
        const btnPow = document.getElementById('btnPow');

        if (this.isSecondFunc) {
            if (btnSin) { btnSin.textContent = 'sin⁻¹'; btnSin.dataset.func = 'asin'; }
            if (btnCos) { btnCos.textContent = 'cos⁻¹'; btnCos.dataset.func = 'acos'; }
            if (btnTan) { btnTan.textContent = 'tan⁻¹'; btnTan.dataset.func = 'atan'; }
            if (btnLn) { btnLn.textContent = 'eˣ'; btnLn.dataset.func = 'exp'; }
            if (btnLog) { btnLog.textContent = '10ˣ'; btnLog.dataset.func = 'pow10'; }
            if (btnSqrt) { btnSqrt.textContent = '∛'; btnSqrt.dataset.func = 'cbrt'; }
            if (btnSqr) { btnSqr.textContent = 'x³'; btnSqr.dataset.func = 'cube'; }
            if (btnPow) { btnPow.textContent = 'ʸ√x'; btnPow.dataset.func = 'rootY'; }
        } else {
            if (btnSin) { btnSin.textContent = 'sin'; btnSin.dataset.func = 'sin'; }
            if (btnCos) { btnCos.textContent = 'cos'; btnCos.dataset.func = 'cos'; }
            if (btnTan) { btnTan.textContent = 'tan'; btnTan.dataset.func = 'tan'; }
            if (btnLn) { btnLn.textContent = 'ln'; btnLn.dataset.func = 'ln'; }
            if (btnLog) { btnLog.textContent = 'log'; btnLog.dataset.func = 'log'; }
            if (btnSqrt) { btnSqrt.textContent = '√'; btnSqrt.dataset.func = 'sqrt'; }
            if (btnSqr) { btnSqr.textContent = 'x²'; btnSqr.dataset.func = 'sqr'; }
            if (btnPow) { btnPow.textContent = 'x^y'; btnPow.dataset.func = 'pow'; }
        }
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

        // Scientific functions
        document.querySelectorAll('[data-func]').forEach(button => {
            button.addEventListener('click', () => {
                const func = button.getAttribute('data-func');
                this.handleScientificFunc(func);
            });
        });

        // Action & Operator buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleAction(action);
            });
        });
    }

    initializeKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Numbers 0-9
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
                this.animateButton(`[data-number="${e.key}"]`);
            }

            // Operators
            if (e.key === '+') { this.handleAction('add'); this.animateButton('[data-action="add"]'); }
            if (e.key === '-') { this.handleAction('subtract'); this.animateButton('[data-action="subtract"]'); }
            if (e.key === '*') { this.handleAction('multiply'); this.animateButton('[data-action="multiply"]'); }
            if (e.key === '/') { e.preventDefault(); this.handleAction('divide'); this.animateButton('[data-action="divide"]'); }
            if (e.key === '^') { this.handleScientificFunc('pow'); this.animateButton('#btnPow'); }

            // Parentheses & Constants
            if (e.key === '(') { this.handleAction('lparen'); }
            if (e.key === ')') { this.handleAction('rparen'); }

            // Decimal & Percent
            if (e.key === '.') { this.handleAction('decimal'); this.animateButton('[data-action="decimal"]'); }
            if (e.key === '%') { this.handleAction('percent'); this.animateButton('[data-action="percent"]'); }

            // Equals & Enter
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.handleAction('equals');
                this.animateButton('[data-action="equals"]');
            }

            // Clear & Backspace
            if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.handleAction('clear');
                this.animateButton('[data-action="clear"]');
            }
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

    handleScientificFunc(func) {
        let val = parseFloat(this.currentValue);
        if (isNaN(val)) return;

        let result;
        let funcLabel = '';

        switch (func) {
            case 'sin':
                const radSin = this.isRad ? val : (val * Math.PI) / 180;
                result = Math.sin(radSin);
                funcLabel = `sin(${val}${this.isRad ? ' rad' : '°'})`;
                break;

            case 'cos':
                const radCos = this.isRad ? val : (val * Math.PI) / 180;
                result = Math.cos(radCos);
                funcLabel = `cos(${val}${this.isRad ? ' rad' : '°'})`;
                break;

            case 'tan':
                const radTan = this.isRad ? val : (val * Math.PI) / 180;
                result = Math.tan(radTan);
                funcLabel = `tan(${val}${this.isRad ? ' rad' : '°'})`;
                break;

            case 'asin':
                const resAsin = Math.asin(val);
                result = this.isRad ? resAsin : (resAsin * 180) / Math.PI;
                funcLabel = `sin⁻¹(${val})`;
                break;

            case 'acos':
                const resAcos = Math.acos(val);
                result = this.isRad ? resAcos : (resAcos * 180) / Math.PI;
                funcLabel = `cos⁻¹(${val})`;
                break;

            case 'atan':
                const resAtan = Math.atan(val);
                result = this.isRad ? resAtan : (resAtan * 180) / Math.PI;
                funcLabel = `tan⁻¹(${val})`;
                break;

            case 'ln':
                if (val <= 0) return this.showError('Domain Error');
                result = Math.log(val);
                funcLabel = `ln(${val})`;
                break;

            case 'log':
                if (val <= 0) return this.showError('Domain Error');
                result = Math.log10(val);
                funcLabel = `log(${val})`;
                break;

            case 'exp':
                result = Math.exp(val);
                funcLabel = `e^(${val})`;
                break;

            case 'pow10':
                result = Math.pow(10, val);
                funcLabel = `10^(${val})`;
                break;

            case 'sqrt':
                if (val < 0) return this.showError('Domain Error');
                result = Math.sqrt(val);
                funcLabel = `√(${val})`;
                break;

            case 'cbrt':
                result = Math.cbrt(val);
                funcLabel = `∛(${val})`;
                break;

            case 'sqr':
                result = val * val;
                funcLabel = `${val}²`;
                break;

            case 'cube':
                result = val * val * val;
                funcLabel = `${val}³`;
                break;

            case 'factorial':
                if (val < 0 || !Number.isInteger(val)) return this.showError('Domain Error');
                result = this.getFactorial(val);
                funcLabel = `${val}!`;
                break;

            case 'pow':
                this.setOperation('^');
                return;

            case 'rootY':
                this.setOperation('ʸ√');
                return;
        }

        if (result !== undefined) {
            this.formatAndSetResult(result, funcLabel);
        }
    }

    getFactorial(n) {
        if (n === 0 || n === 1) return 1;
        let fact = 1;
        for (let i = 2; i <= n; i++) fact *= i;
        return fact;
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

            case 'reciprocal':
                this.reciprocal();
                break;

            case 'decimal':
                this.addDecimal();
                break;

            case 'pi':
                this.currentValue = Math.PI.toString();
                this.shouldResetDisplay = false;
                this.updateDisplay();
                break;

            case 'e':
                this.currentValue = Math.E.toString();
                this.shouldResetDisplay = false;
                this.updateDisplay();
                break;

            case 'lparen':
                if (this.subDisplayElement) this.subDisplayElement.textContent += ' (';
                break;

            case 'rparen':
                if (this.subDisplayElement) this.subDisplayElement.textContent += ' )';
                break;

            // Memory Actions
            case 'mc':
                this.memory = 0;
                this.updateMemoryUI();
                break;

            case 'mr':
                this.currentValue = this.memory.toString();
                this.shouldResetDisplay = false;
                this.updateDisplay();
                break;

            case 'm-plus':
                this.memory += parseFloat(this.currentValue) || 0;
                this.updateMemoryUI();
                this.shouldResetDisplay = true;
                break;

            case 'm-minus':
                this.memory -= parseFloat(this.currentValue) || 0;
                this.updateMemoryUI();
                this.shouldResetDisplay = true;
                break;

            // Basic Operators
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

    updateMemoryUI() {
        if (this.memoryIndicator) {
            this.memoryIndicator.classList.toggle('active', this.memory !== 0);
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

    reciprocal() {
        const val = parseFloat(this.currentValue);
        if (isNaN(val) || val === 0) return this.showError('Division by 0');
        this.formatAndSetResult(1 / val, `1/(${val})`);
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
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷':
                if (current === 0) return this.showError('Cannot divide by 0');
                result = prev / current;
                break;
            case '^': result = Math.pow(prev, current); break;
            case 'ʸ√':
                if (current === 0) return this.showError('Domain Error');
                result = Math.pow(prev, 1 / current);
                break;
            default: return;
        }

        if (finalCalculation && this.subDisplayElement) {
            this.subDisplayElement.textContent = `${prev} ${this.operation} ${current} =`;
            this.operation = null;
            this.previousValue = '';
        }

        this.formatAndSetResult(result);
    }

    formatAndSetResult(result, expressionLabel = null) {
        if (expressionLabel && this.subDisplayElement) {
            this.subDisplayElement.textContent = `${expressionLabel} =`;
        }

        if (Number.isInteger(result)) {
            this.currentValue = result.toString();
        } else {
            this.currentValue = parseFloat(result.toFixed(10)).toString();
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
        if (displayValue.length > 14) {
            const num = parseFloat(displayValue);
            displayValue = isNaN(num) ? displayValue : num.toExponential(6);
        }
        this.displayElement.textContent = displayValue;
    }
}

// Initialize Scientific Calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});
