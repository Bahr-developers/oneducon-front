import { useState } from "react";
import { BellRing } from "lucide-react";
import { Sheet } from "../ui/sheet";
import { AppSidebar } from "./side-bar";
import { Profile } from "../menu/profile";
import { ModeToggle } from "../menu/mode-toggle";
import { Link } from "react-router-dom";

export function TopNav() {
    const [open, setOpen] = useState(false);

    return (
        <header className="h-16 sticky rounded-[8px] top-0 z-40 bg-background/50 backdrop-blur-md">
            <div className="flex items-center justify-end gap-3 h-full px-4">
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <AppSidebar collapsed={false} onToggle={() => { }} />
                    </Sheet>
                </div>


                <div className="flex items-center justify-between gap-x-4">
                    <ModeToggle />
                    <Link to={'/dashboard/low-products'}><BellRing /></Link>
                    <Profile />
                </div>
            </div>
            <hr />
        </header>
    );
}
