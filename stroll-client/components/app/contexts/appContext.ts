import { createContext } from "react";

import { IAppContext } from "../models/appContext";

export const AppContext = createContext<IAppContext>(null);
