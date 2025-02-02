#!/usr/bin/env node
import fs from "fs";
import path from "path";
import {Command} from 'commander'
import chalk from 'chalk'

const program = new Command();
const EXPENSE_FILE = path.join(process.cwd(), "expense.json");

// Load tasks from file
function loadExpenses() {
  if (!fs.existsSync(EXPENSE_FILE)) {
    return [];
  }
  const data = fs.readFileSync(EXPENSE_FILE, "utf8");
  return JSON.parse(data);
}

// Save tasks to file
function saveExpenses(expense) {
  fs.writeFileSync(EXPENSE_FILE, JSON.stringify(expense, null, 2));
}


//ADD AN EXPENSE WITH DESCRIPTION AND AMOUNT
program
  .command("add <expense>  <amount>")
  .description("Add a new expense")
  .action((expense, amount) => {
    const expenses = loadExpenses();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount)) {
        console.log(chalk.yellow(`Amount should be a valid number.`));
        return null
      }
    const newExpense = {
      id: expenses.length+1, // Generate a unique ID
      expense,
      amount: parsedAmount, 
      createdAt: new Date().toISOString(), // Current timestamp
      updatedAt: new Date().toISOString(), // Current timestamp
    };
    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log(chalk.green(`Added: ${expense} and amount ${amount}`));
  });


  //update expense
  program
  .command("update <id> <field> <value>")
  .description("Update a feature of the tasks")
  .action((id, field, value) => {
    const expenses = loadExpenses();
    const expenseIndex = expenses.findIndex(expense => expense.id === id);


    //check if the expense with Id is available
    if(expenseIndex === -1){
        console.log(chalk.red(`Expense with ID ${id} not found.`));
        return;
    }
    const expense = expenses[expenseIndex];
    
    if (field !== "expense" && field !== "amount") {
        console.log(chalk.red(`Invalid field: ${field}. Only "expense" and "amount" can be updated.`));
        return;
      }
    
       // Update the task
    expense[field] = value; // Update the specified field with the new value
    expense.updatedAt = new Date().toISOString(); // Update the "updatedAt" timestamp

    saveExpenses(expenses); // Save the updated tasks
    console.log(chalk.green(`Updated expense ${id}: ${field} set to "${value}".`));
    console.log('Updated expense:', expense); // Log the updated task for confirmation
    
  });


  //delete expense
program
.command("delete <id>")
.description("Delete a expense")
.action((id) => {
  const expenses = loadExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);
  if (expenseIndex === -1) {
    console.log(chalk.red("Expense not found."));
    return;
  }
  const deletedExpense = expenses.splice(expenseIndex, 1)[0];
  saveExpenses(expenses);
  console.log(chalk.green(`Deleted: ${deletedExpense.expense} (ID: ${deletedExpense.id})`));
});

// List all expenses
program
  .command("list")
  .description("List all expenses")
  .action(() => {
    const expenses = loadExpenses();
    if (expenses.length === 0) {
      console.log(chalk.yellow("No expenses found."));
    } else {
        console.log(
            `#id - Date Description Amount`
          );
      expenses.forEach((exp) => {
        console.log(
          `${exp.id} - ${exp.expense} of Amount: ${exp.amount} (Created: ${exp.createdAt}, Updated: ${exp.updatedAt})`
        );
      });
    }
  });

  //summary of expenses
  program
  .command("summary")
  .description("Add a new expense")
  .action(() => {
    const expenses = loadExpenses();
    let summary = 0;
    expenses.forEach((exp) =>{
        summary+=exp.amount
    })
    console.log(`#Total expense: ${summary}`)
  });

  program
  .command("sum <month>")
  .description("Add a new expense")
  .action((month) => {
    let monthName;
        switch (month) {
            case "01":
                monthName = chalk.green("January");
                break;
            case "02":
                monthName = chalk.green("February");
                break;
            case "03":
                monthName = chalk.green("March");
                break;
            case "04":
                monthName = chalk.green("April");
                break;
            case "05":
                monthName = chalk.green("May");
                break;
            case "06":
                monthName = chalk.green("June");
                break;
            case "07":
                monthName = chalk.green("July");
                break;
            case "08":
                monthName = chalk.green("August");
                break;
            case "09":
                monthName = chalk.green("September");
                break;
            case "10":
                monthName = chalk.green("October");
                break;
            case "11":
                monthName = chalk.green("November");
                break;
          default:
            monthName = chalk.green("December");
        }
    const expenses = loadExpenses();
    let monthlySum = 0
    expenses.forEach(exp => {
        if(exp.createdAt.split('-')[1] === month){
            monthlySum+=exp.amount
        }
        
    })
    console.log(`Summary for the month of ${monthName} is ${monthlySum}`)
  });
program.parse(process.argv);