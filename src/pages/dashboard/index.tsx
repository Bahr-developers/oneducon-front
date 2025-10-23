import ChartsMain from "./charts";
import Statistics from "./statistics";

const DashboardMain = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Asosiy Panel</h2>
            </div>
            <Statistics />
            <ChartsMain />
        </div>
    );
};

export default DashboardMain;