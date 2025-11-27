import ExpensesTable from "./expenses-table";

const Expenses = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <h2 className="font-medium text-2xl">Xarajatlar</h2>
            </div>
            <ExpensesTable />
        </div>
    );
};

export default Expenses;