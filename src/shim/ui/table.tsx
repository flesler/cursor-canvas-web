import { Table as MantineTable } from '@mantine/core'
import type { TableProps, TableRowTone } from '../../vendor/canvas-sdk/ui-primitives.js'

const ROW_TONE_BG: Record<TableRowTone, string> = {
	success: 'rgba(31,138,101,0.12)',
	danger: 'rgba(207,45,86,0.12)',
	warning: 'rgba(232,163,61,0.14)',
	info: 'rgba(46,121,181,0.12)',
	neutral: 'rgba(136,136,168,0.12)',
}

export function Table({
	headers,
	rows,
	columnAlign,
	rowTone,
	framed = true,
	striped,
	stickyHeader,
	style,
	emptyMessage,
}: TableProps) {
	return (
		<MantineTable
			withTableBorder={framed}
			withColumnBorders={false}
			striped={striped}
			stickyHeader={stickyHeader}
			highlightOnHover
			style={style}
		>
			<MantineTable.Thead>
				<MantineTable.Tr>
					{headers.map((header, index) => (
						<MantineTable.Th key={index} ta={columnAlign?.[index] ?? 'left'}>
							{header}
						</MantineTable.Th>
					))}
				</MantineTable.Tr>
			</MantineTable.Thead>
			<MantineTable.Tbody>
				{rows.length === 0 ? (
					<MantineTable.Tr>
						<MantineTable.Td colSpan={headers.length} ta="center" c="dimmed">
							{emptyMessage ?? 'No data'}
						</MantineTable.Td>
					</MantineTable.Tr>
				) : (
					rows.map((row, rowIndex) => {
						const tone = rowTone?.[rowIndex]
						return (
							<MantineTable.Tr
								key={rowIndex}
								style={tone ? { background: ROW_TONE_BG[tone] } : undefined}
							>
								{headers.map((_, colIndex) => (
									<MantineTable.Td
										key={colIndex}
										ta={columnAlign?.[colIndex] ?? 'left'}
									>
										{row[colIndex]}
									</MantineTable.Td>
								))}
							</MantineTable.Tr>
						)
					})
				)}
			</MantineTable.Tbody>
		</MantineTable>
	)
}
