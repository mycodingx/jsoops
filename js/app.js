// Classes
class Budget {

    constructor(budget) {
        this.budget = Number(budget);
        this.budgetLeft = this.budget;
    }

    // Substrack from the budget

    substractFromBudget(amount) {
        return this.budgetLeft -= amount;
    }

}

class HTML {
    // Insert the budget when the user submits it
    insertBudget(amount) {
        // Insert into HTML
        budgetTotal.innerHTML = `${amount}`;
        budgetLeft.innerHTML = `${amount}`;
    }
    // Display the suceess or error message
    printMessage(message, className) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('text-center', 'alert', className);
        messageWrapper.appendChild(document.createTextNode(message));

        // Insert into HTML
        document.querySelector('.primary').insertBefore(messageWrapper, addExpenseForm);

        // Clear the error after sometime
        setTimeout(() => {
            document.querySelector('.primary .alert').remove();
            addExpenseForm.reset();
        }, 3000);
    }

    // Display the expense from the form into the list
    addExpenseToList(name, amount) {
        const expensesList = document.querySelector('#expenses ul');

        // create a li

        const li = document.createElement('li');
        li.classList = 'list-group-item d-flex justify-content-between align-items-center';

        // Create a template
        li.innerHTML = `${name}<span class="badge badge-primary badge-pill">$ ${amount}</span>`;

        // Insert into the HTML
        expensesList.appendChild(li);
    }

    // Substract expense amount from budget 
    trackBudget(amount) {
        let budgetLeftDollars = budget.budgetLeft;
        if (budget.budgetLeft >= amount) {
            budgetLeftDollars = budget.substractFromBudget(amount);
        }
        budgetLeft.innerHTML = `${budgetLeftDollars}`;
        return budgetLeftDollars;
    }

}

// Variables
const addExpenseForm = document.getElementById('add-expense'),
    budgetTotal = document.querySelector('span#total'),
    budgetLeft = document.querySelector('span#left');
addbtn = document.querySelector('.btn-add');
let budget, userBudget;
const html = new HTML();


// Event Listeners 
eventListeners();

function eventListeners() {

    // App Init
    document.addEventListener('DOMContentLoaded', function () {

        var swalConfig = {
            title: "Weely Budget!",
            closeOnClickOutside: false,
            closeOnEsc: false,
            text: "Enter your weekly budget:",
            content: {

                element: "input",
                attributes: {
                    placeholder: "Budget Amount",
                    type: "number",
                }

            },
            buttons: {
                confirm: {
                    text: "Save",
                    value: "save",
                    visible: true,
                },
            },

        };

        // Ask the visitor the weekly budget
        swal(swalConfig).then((value) => {
            if (value === '' || value == 0 || value === null || value < 0) {
                swal("Error!", "Budget value cannot be empty or zero.", 'error')
                    .then((value) => {
                        window.location.reload();
                    });

            } else {
                // If budget is valid the instanciate the budget class
                userBudget = value;
                budget = new Budget(userBudget);

                // Instanciate HTML Class
                html.insertBudget(budget.budget);
            }
        });


    });


    // When user submit a new expense
    addExpenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Read the values from the form 

        const expenseName = document.querySelector('#expense').value;
        const amount = document.querySelector('#amount').value;

        if (expenseName === '' || amount === '') {
            html.printMessage('There was error, all the feilds are mandatory', 'alert-danger');
        } else {
            // Add expense to the list 

            if (budget.budgetLeft >= amount) {
                html.addExpenseToList(expenseName, amount);
                html.trackBudget(amount);
                html.printMessage('Added...', 'alert-success');
                // Check when 25% is left
                if ((budget.budget / 4) > budgertTracker) {
                    // Add some classes and remove some others
                    budgetLeft.parentElement.parentElement.classList.remove('alert-success', 'alert-warning');
                    budgetLeft.parentElement.parentElement.classList.add('alert-danger');

                } else if ((budget.budget / 2) > budgertTracker) {
                    // Add some classes and remove some others
                    budgetLeft.parentElement.parentElement.classList.remove('alert-success');
                    budgetLeft.parentElement.parentElement.classList.add('alert-warning');
                }

            } else {
                html.printMessage('Your expense is exceeding your budget limit!!', 'alert-danger');
                addbtn.setAttribute('disabled', 'disabled');
            }

        }
    });

}