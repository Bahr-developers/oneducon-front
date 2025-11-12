import ExpenseForm from "./create-expenses";
import ExpensesTable from "./expenses-table";

const Expenses = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Xarajatlar</h2>
                <ExpenseForm />
            </div>
            <ExpensesTable />
        </div>
    );
};

export default Expenses;