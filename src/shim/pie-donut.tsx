import { DonutChart } from '@mantine/charts'
import { useHostTheme } from './use-tokens'

const PIE_START_ANGLE = 180
const PIE_END_ANGLE = 540

function pieDonutThickness(size: number): number {
	return Math.max(28, Math.round(size * 0.22))
}

function DonutCenterLabel({
	total,
	family,
	primary,
	subtitle,
}: {
	total: number;
	family: string;
	primary: string;
	subtitle: string
}) {
	return (
		<text
			x="50%"
			y="50%"
			textAnchor="middle"
			dominantBaseline="central"
			fontFamily={family}
		>
			<tspan x="50%" dy="-0.4em" fontSize={20} fontWeight={600} fill={primary}>
				{total}
			</tspan>
			<tspan x="50%" dy="1.55em" fontSize={16} fontWeight={500} fill={subtitle}>
				Total
			</tspan>
		</text>
	)
}

type DonutSlice = { name: string; value: number; color: string }

export function PieDonutChart({
	data,
	size,
	highlighted,
}: {
	data: DonutSlice[];
	size: number;
	highlighted: string | null
}) {
	const theme = useHostTheme()
	const total = data.reduce((sum, row) => sum + row.value, 0)
	const pieAngles = {
		startAngle: PIE_START_ANGLE,
		endAngle: PIE_END_ANGLE,
	}
	const pieCellProps = (name: string) => ({
		opacity: highlighted === null || highlighted === name ? 1 : 0.35,
	})
	return (
		<DonutChart
			data={data}
			size={size}
			thickness={pieDonutThickness(size)}
			withTooltip
			cellProps={cell => pieCellProps(cell.name)}
			{...pieAngles}
		>
			<DonutCenterLabel
				total={total}
				family={theme.typography.fontFamily}
				primary={theme.text.primary}
				subtitle={theme.text.secondary}
			/>
		</DonutChart>
	)
}

export type { DonutSlice }
