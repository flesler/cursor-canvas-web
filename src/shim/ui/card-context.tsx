import { createContext } from 'react'

export const CardContext = createContext<{
	collapsible: boolean;
	open: boolean;
	toggle: () => void
}>({
	collapsible: false,
	open: true,
	toggle: () => {},
})
