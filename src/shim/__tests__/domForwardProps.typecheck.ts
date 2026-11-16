/**
 * Compile-time check that in-repo `cursor/canvas` resolves to widened shim props.
 */
import type { StackProps } from 'cursor/canvas'

type Expect<T extends true> = T
type HasAriaLabel = 'aria-label' extends keyof StackProps ? true : false

export type _domForwardInRepo = Expect<HasAriaLabel>