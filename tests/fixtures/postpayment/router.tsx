import { createContext, useContext } from "react";
export const TestRouter = createContext({ refresh: () => {} });
export const useRouter = () => useContext(TestRouter);
