import Expense from "../models/expense.js";
import User from "../models/user.js";
import { db } from "../utils/db.js";

export const addExpense = async (req, res) => {
  const t = await db.transaction();

  try {
    const { amount, description, category } = req.body;
    console.log("Received expense data:", req.body);

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        loginUserId: req.user.id,
      },
      { transaction: t }
    );

    const user = await User.findByPk(req.user.id, { transaction: t });
    user.totalExpense = (user.totalExpense || 0) + parseInt(amount);
    await user.save({ transaction: t });

    await t.commit();
    res.status(201).send("Expense added");
  } catch (error) {
    await t.rollback();
    console.error("Error in addExpense:", error);
    res.status(500).send(error);
  }
};

export const showExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({  
      where: { loginUserId: req.user.id },
    });
    res.status(200).json({ expenses, success: true });
  } catch (err) {
    console.error("Error in showExpense:", err);
    res.status(400).json({ error: err, success: false });
  }
};

export const deleteExpense = async (req, res) => {
  const t = await db.transaction();

  try {
    const { id } = req.params;
    const expense = await Expense.findOne({
      where: { id, loginUserId: req.user.id },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found or not authorized" });
    }

    await Expense.destroy({
      where: { id, loginUserId: req.user.id },
      transaction: t,
    });

    // Update the user's totalExpense
    const user = await User.findByPk(req.user.id, { transaction: t });
    user.totalExpense = (user.totalExpense || 0) - parseInt(expense.amount);
    await user.save({ transaction: t });

    await t.commit();
    res.status(200).json({ message: "Deleted successfully",totalExpense: user.totalExpense  });
  } catch (err) {
    await t.rollback(); 
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Error deleting expense" });
  }
};

export const getPremiumExpense = async (req, res) => {
  try {
    const leaderBoard = await User.findAll({
      attributes: ["id", "name", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json(leaderBoard);
  } catch (error) {
    console.error("Error in getPremiumExpense:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
