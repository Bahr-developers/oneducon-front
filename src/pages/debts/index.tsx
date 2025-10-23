import DebtsTable from "./debts-table";

const Debts = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Qarz</h2>
            </div>
            <DebtsTable />
        </div>
    );
};

export default Debts
    ;