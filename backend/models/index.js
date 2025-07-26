import User from "./user.js";
import Expense from "./expense.js";

User.hasMany(Expense);
Expense.belongsTo(User);

export {User,Expense};