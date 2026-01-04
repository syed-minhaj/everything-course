
import { createContext, type PropsWithChildren, useContext, useState } from "react";

type ContextVal = {
    task: "Quiz" | "Mission";
    setTask: (val: "Quiz" | "Mission") => void;
};

const Context = createContext<ContextVal | null>(null);

export function TaskContextProvider({ children }: PropsWithChildren) {
    const [task, setTask] = useState<"Quiz" | "Mission">("Quiz");

    return <Context.Provider value={{ task, setTask }}>{children}</Context.Provider>;
}

export function useTaskContextValue() {
    const val = useContext(Context);
    if (!val) throw new Error("useContextValue called outside of ContextProvider!");
    return val;
}