import { Outlet } from "react-router-dom";


const Root = () => {
    return (
        <>
            <main className="mx-auto overflow-auto">
                <Outlet />
            </main>
        </>
    );
};

export default Root;