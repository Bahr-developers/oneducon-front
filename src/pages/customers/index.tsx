import CreateCustomer from "./create-cus";
import CustomeTable from "./cutomer-table";

const Customers = () => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium ">Mijozlar</h2>
                <CreateCustomer title="Mijoz qo'shish" width="w-[150px] justify-between" />
            </div>
            <CustomeTable />
        </div>
    );
};

export default Customers;