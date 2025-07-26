import Expense from "../models/expense.js";
export const addExpense=async(req,res)=>{
    try {
        const {amount,description,category}=req.body;
        console.log("Received expense data:", req.body);
        const expense=await Expense.create({
            amount:amount,
            description:description,
            category:category,
            loginUserId:req.user.id
        })
        res.status(201).send("expense added");
    } catch (error) {
        console.error("Error in addExpense:", error);
        res.status(500).send(error);
    }
}

export const showExpense=async(req,res)=>{
    Expense.findAll({where:{loginUserId:req.user.id}}).then(expenses=>{
        return res.status(200).json({expenses,success:true,})
    }).catch(err=>{
        console.log(err);
        return res.status(400).send({error:err,success:false})
    })
    //  try {
    //     const expenses = await Expense.findAll({
    //         where:{
    //             loginUserId: req.user.id
    //         }
    //     });
    //     res.status(200).json(expenses);
    // } catch (error) {
    //     res.status(500).send("Error fetching expenses");
    // }
}

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Expense.destroy({
      where: {
        id: id,
        loginUserId: req.user.id, // ensure user is deleting their own expense
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Expense not found or not authorized" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Error deleting expense" });
  }
};
