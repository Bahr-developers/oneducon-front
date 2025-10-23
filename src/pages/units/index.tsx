import CreateCategory from "./create-category";
import CreateUnit from "./create-unit";
import CategoryUnitManager from "./units-category";

const Units = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Kategoriya va birliklar </h2>
                <div className="flex items-center gap-x-2">
                    <CreateCategory />
                    <CreateUnit />
                </div>
            </div>
            <CategoryUnitManager />
        </div>
    );
};

export default Units;

