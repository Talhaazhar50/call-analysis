import { createContext, useContext, useState } from "react";

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false)
    const toggle = () => setDark(p => !p)
    return (
        <ThemeContext.Provider value={{ dark, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}