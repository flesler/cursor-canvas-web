import { screen } from '@testing-library/react'
import { BarChart, Button, DiffView, PieChart, Stack, TextInput } from 'cursor/canvas'
import { renderWithProvider } from '../../test/render'

describe('DOM attribute forwarding', () => {
  it('forwards data-* and aria-* on layout primitives', () => {
    renderWithProvider(
      <Stack data-testid="canvas-stack" aria-label="Metrics column" gap={8}>
        <span>child</span>
      </Stack>,
    )
    const stack = screen.getByTestId('canvas-stack')
    expect(stack).toHaveAttribute('aria-label', 'Metrics column')
  })

  it('forwards button accessibility props through Mantine', () => {
    renderWithProvider(
      <Button aria-label="Deploy" variant="primary">
        Deploy
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Deploy' })).toBeInTheDocument()
  })

  it('forwards input props omitted from explicit destructuring', () => {
    renderWithProvider(
      <TextInput
        value=""
        aria-label="Service name"
        placeholder="service name…"
        data-testid="service-input"
      />,
    )
    expect(screen.getByTestId('service-input')).toHaveAttribute(
      'aria-label',
      'Service name',
    )
    expect(screen.getByPlaceholderText('service name…')).toBeInTheDocument()
  })

  it('wraps BarChart rest on the outer host div', () => {
    const { container } = renderWithProvider(
      <BarChart
        categories={['A']}
        series={[{ name: 'S', data: [1] }]}
        aria-label="Latency"
        data-testid="bar-host"
      />,
    )
    const host = container.querySelector('[data-testid="bar-host"]')
    expect(host).not.toBeNull()
    expect(host).toHaveAttribute('aria-label', 'Latency')
    expect(host?.tagName).toBe('DIV')
  })

  it('wraps PieChart rest on the outer host div', () => {
    const { container } = renderWithProvider(
      <PieChart
        data={[{ label: 'Pass', value: 1 }]}
        data-testid="pie-host"
        aria-label="Outcomes"
      />,
    )
    const host = container.querySelector('[data-testid="pie-host"]')
    expect(host).not.toBeNull()
    expect(host).toHaveAttribute('aria-label', 'Outcomes')
    expect(host?.tagName).toBe('DIV')
  })

  it('forwards region semantics on DiffView', () => {
    renderWithProvider(
      <DiffView
        lines={[{ type: 'unchanged', content: 'line', lineNumber: 1 }]}
        role="region"
        aria-label="Patch preview"
        data-testid="diff-body"
      />,
    )
    const diff = screen.getByTestId('diff-body')
    expect(diff).toHaveAttribute('role', 'region')
    expect(diff).toHaveAttribute('aria-label', 'Patch preview')
  })
})