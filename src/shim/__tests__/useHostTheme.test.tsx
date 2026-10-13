import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { useHostTheme } from 'cursor/canvas';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
  );
}

describe('useHostTheme', () => {
  it('exposes category, chart palette, fill, and kind (dark)', () => {
    const { result } = renderHook(() => useHostTheme(), { wrapper });
    const theme = result.current;
    expect(theme.kind).toBe('dark');
    expect(theme.category.orange).toMatch(/^#/);
    expect(theme.tokens.category.orange).toBe(theme.category.orange);
    expect(theme.chart.palette.lightGreen).toBe('#52B896E0');
    expect(theme.chart.sequence.length).toBeGreaterThan(0);
    expect(theme.fill.secondary).toMatch(/^#/);
    expect(theme.stroke.focused).toMatch(/^#/);
    expect(theme.radius.md).toBe(6);
    expect(theme.typography.body.fontSize).toBe('14px');
  });

  it('switches category table for light scheme', () => {
    const lightWrap = ({ children }: { children: ReactNode }) => (
      <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
    );
    const dark = renderHook(() => useHostTheme(), { wrapper }).result.current;
    const light = renderHook(() => useHostTheme(), {
      wrapper: lightWrap,
    }).result.current;
    expect(light.kind).toBe('light');
    expect(light.category.orange).toBe(light.tokens.category.orange);
    expect(light.category.orange).not.toBe(dark.category.orange);
  });
});
