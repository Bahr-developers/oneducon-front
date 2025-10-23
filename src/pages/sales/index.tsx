import SalesTable from "./sales-table";
import StatisticsSales from "./statistict-sales";

const SalesPage = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Sotuvlar</h2>
            </div>
            <StatisticsSales />
            <SalesTable />
        </div>
    );
};

export default SalesPage;