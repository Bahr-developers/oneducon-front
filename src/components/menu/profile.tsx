import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import sel from "@/assets/svg/language-select.svg";
import logout from "@/assets/svg/logout.svg";
import { Avatar, AvatarImage } from "../ui/avatar";
import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";
import AvatarImg from "@/assets/svg/user.svg";
const handleLogout = (navigate: NavigateFunction) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
};

export function Profile() {
    const navigate = useNavigate();


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:outline-none flex justify-between items-center gap-3">

                <Avatar>
                    <div className=" w-10 h-10 rounded-full bg-[#F4F4F4] flex items-center justify-center">
                        <AvatarImage className="" src={AvatarImg} alt="" />
                    </div>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col items-start py-3.5 px-3 justify-end">
                <DropdownMenuItem asChild className="flex items-center w-full">
                    <NavLink
                        to={`/dashboard/profile`}
                        className="flex items-center w-full"
                    >
                        <span className="flex-1 text-left">Profil</span>
                        <img className="-rotate-90 w-2 h-2" src={sel} alt="sel image" />
                    </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center w-full"
                    onClick={() => handleLogout(navigate)}
                >
                    <span className="flex-1 text-left">Chiqish</span>
                    <img className="w-4 h-3.5" src={logout} alt="logout image" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
