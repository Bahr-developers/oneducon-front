/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type OverlayContextType = {
    open: boolean;
    setOpen: (value: boolean) => void;
};

const OverlayContext = createContext<OverlayContextType | null>(null);

export const useOverlay = () => {
    const ctx = useContext(OverlayContext);
    if (!ctx) {
        throw new Error("useOverlay must be used within <FullPageOverlay>");
    }
    return ctx;
};

type FullPageOverlayProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    children: React.ReactNode;
};

const FullPageOverlay = ({ open, onOpenChange, children }: FullPageOverlayProps) => {
    return (
        <OverlayContext.Provider value={{ open, setOpen: onOpenChange }}>
            {children}
        </OverlayContext.Provider>
    );
};

const Trigger = ({ children }: { children: React.ReactNode }) => {
    const { setOpen } = useOverlay();
    return <div onClick={() => setOpen(true)}>{children}</div>;
};

const Content = ({ children, title }: { children: React.ReactNode; title?: string }) => {
    const { open, setOpen } = useOverlay();

    if (!open) return null;

    return (
        <div
            className={cn(
                "absolute inset-0 z-50 bg-white dark:bg-neutral-900 p-6 overflow-x-hidden"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <button
                    onClick={() => setOpen(false)}
                    className="px-2 py-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                    ✕
                </button>
            </div>
            {children}
        </div>
    );
};

const Close = ({ children }: { children: React.ReactNode }) => {
    const { setOpen } = useOverlay();
    return <div onClick={() => setOpen(false)}>{children}</div>;
};

FullPageOverlay.Trigger = Trigger;
FullPageOverlay.Content = Content;
FullPageOverlay.Close = Close;

export default FullPageOverlay;
