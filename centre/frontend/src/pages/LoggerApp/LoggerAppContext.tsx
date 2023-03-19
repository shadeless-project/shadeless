// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.

import React from "react";

// Create a context for the current theme (with "light" as the default).
export const LoggerContext = React.createContext('');
export const LoggerDashboardContext = React.createContext(0);
