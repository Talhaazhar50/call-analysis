import { createContext, useContext, useState } from "react";

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    const toggle = () => setDark(prev => {
        const next = !prev
        localStorage.setItem('theme', next ? 'dark' : 'light')
        return next
    })

    return (
        <ThemeContext.Provider value={{ dark, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}