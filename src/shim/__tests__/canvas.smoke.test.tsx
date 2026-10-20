import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import DemoCanvas from '../../../.cursor/canvases/demo.canvas';
import { renderWithProvider } from '../../test/render';

// useCanvasState persists the active tab to localStorage; clear it so each test
// starts from the canvas's default tab ('charts').
beforeEach(() => localStorage.clear());

describe('DemoCanvas showcase', () => {
  it('renders the header, live pill and chat IconButton', () => {
    renderWithProvider(<DemoCanvas />);

    expect(
      screen.getByRole('heading', { name: 'Cursor Canvas SDK showcase' }),
    ).toBeInTheDocument();
    expect(screen.getByText('live')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ask about this canvas in chat' }),
    ).toBeInTheDocument();
  });

  it('renders every section heading', () => {
    renderWithProvider(<DemoCanvas />);

    for (const title of [
      'How it works',
      'Charts, tables & context',
      'Chart guides & axes',
      'Graph layout (computeDAGLayout)',
      'Diff',
      'Disclosure & tasks',
      'Typography & theme',
      'Host brand (Cursor vs Grok)',
      'Forms (state persists via useCanvasState)',
      'Data imports (JSON, YAML, TSV, CSV, JSONL)',
    ]) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('renders the "How it works" steps and the Stat cards', () => {
    renderWithProvider(<DemoCanvas />);

    // Step titles ('Deploy' also names the form button), so match each unique
    // step description instead.
    for (const step of [
      'Write a .canvas.tsx that imports only cursor/canvas.',
      'Vite + tsconfig redirect cursor/canvas at build time.',
      'Mantine implements the same API, props, and tones.',
    ]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
    for (const stat of [
      'Components',
      'Hooks',
      'Source of truth',
    ]) {
      expect(screen.getByText(stat)).toBeInTheDocument();
    }
  });

  it('shows charts and callouts on the default tab', () => {
    renderWithProvider(<DemoCanvas />);

    // LineChart / BarChart / PieChart cards (chart bodies do not render in
    // jsdom, so assert the card headers that frame them).
    expect(screen.getByText('Latency (ms)')).toBeInTheDocument();
    expect(screen.getByText('Requests by source')).toBeInTheDocument();
    expect(screen.getByText('Test outcomes (pie)')).toBeInTheDocument();
    expect(screen.getByText('Test outcomes (donut)')).toBeInTheDocument();
    expect(screen.getAllByText(/75%/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/9\.9%/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Total')).toBeInTheDocument();
    // Callout tones.
    expect(screen.getByText('Deployed')).toBeInTheDocument();
    expect(screen.getByText('1 service degraded.')).toBeInTheDocument();
    expect(
      screen.getByText('Contract tests track the IDE SDK snapshot.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Neutral callout for secondary notices.'),
    ).toBeInTheDocument();
  });

  it('renders chart guide section headers (axis, SLO, normalized, horizontal)', () => {
    renderWithProvider(<DemoCanvas />);

    expect(
      screen.getByText('Uptime % (SLO line, fill, tight axis)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Traffic share (normalized)')).toBeInTheDocument();
    expect(
      screen.getByText('Lane depth (horizontal, long labels)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Grouped bars + budget line')).toBeInTheDocument();
    expect(screen.getByText('Dual series, filled area')).toBeInTheDocument();
    expect(screen.getByText('Weekly volume')).toBeInTheDocument();
    // Reference-line labels render in real layout (Playwright), not jsdom charts.
  });

  it('reveals the data Table when the "table" tab is selected', () => {
    renderWithProvider(<DemoCanvas />);
    fireEvent.click(screen.getByText('table'));

    for (const header of ['Service', 'Status', 'RPS']) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
    for (const service of ['api-gateway', 'workers', 'billing']) {
      expect(screen.getByText(service)).toBeInTheDocument();
    }
  });

  it('reveals the UsageBar and Swatch legend on the "context" tab', () => {
    renderWithProvider(<DemoCanvas />);
    fireEvent.click(screen.getByText('context'));

    expect(screen.getByText('64% full')).toBeInTheDocument();
    expect(screen.getByText('76.8K / 120K tokens')).toBeInTheDocument();
    for (const legend of ['tools', 'rules', 'conversation', 'skills']) {
      expect(screen.getByText(legend)).toBeInTheDocument();
    }
  });

  it('renders the DAG graph from computeDAGLayout', () => {
    renderWithProvider(<DemoCanvas />);

    expect(
      screen.getByRole('img', { name: 'Agent loop graph' }),
    ).toBeInTheDocument();
  });

  it('renders the DiffView body and DiffStats', () => {
    renderWithProvider(<DemoCanvas />);

    expect(
      screen.getByText('export default function Showcase() {'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('export default function Demo() {'),
    ).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  it('renders the CollapsibleSections and both todo lists', () => {
    renderWithProvider(<DemoCanvas />);

    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Grep')).toBeInTheDocument();
    // The same todos feed both TodoListCard and the selectable TodoList.
    expect(
      screen.getAllByText('Scaffold Vite + shim alias').length,
    ).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Selected: 3')).toBeInTheDocument();
  });

  it('renders the typography samples', () => {
    renderWithProvider(<DemoCanvas />);

    expect(
      screen.getByRole('heading', { name: 'Heading level 3' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Semibold emphasis.')).toBeInTheDocument();
    expect(screen.getByText('Italic remark.')).toBeInTheDocument();
    expect(screen.getByText('deleted')).toBeInTheDocument();
    expect(screen.getByText('renamed')).toBeInTheDocument();
    expect(
      screen.getByText('Quaternary — footnotes and source lines.'),
    ).toBeInTheDocument();
  });

  it('renders the form controls wired to useCanvasState', () => {
    renderWithProvider(<DemoCanvas />);

    expect(screen.getByText('Environment snapshot')).toBeInTheDocument();
    for (const field of ['Environment', 'Filter', 'Release note']) {
      expect(screen.getByText(field)).toBeInTheDocument();
    }
    expect(screen.getByPlaceholderText('service name…')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What changed…')).toBeInTheDocument();
    expect(screen.getByLabelText('Verbose logging')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
    for (const button of ['Reset', 'Preview', 'Deploy']) {
      expect(screen.getByRole('button', { name: button })).toBeInTheDocument();
    }
  });

  it('renders the theme tokens and footer link', () => {
    renderWithProvider(<DemoCanvas />);

    expect(screen.getByText('Theme tokens (useHostTheme)')).toBeInTheDocument();
    expect(screen.getByText(/brand: cursor/)).toBeInTheDocument();
    for (const key of [
      'text.primary',
      'text.secondary',
      'text.tertiary',
      'text.quaternary',
      'chart.accent',
      'chart.link',
      'chart.strokePrimary',
      'category.orange',
    ]) {
      expect(screen.getByText(key)).toBeInTheDocument();
    }
    expect(
      screen.getByRole('link', { name: 'open-canvas' }),
    ).toBeInTheDocument();
  });
});
