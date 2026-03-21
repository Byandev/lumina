"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    Column,
    PaginationState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo, useState } from 'react';
import { toBackendSort } from '@/lib/sort';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { PaginatedData } from '@/types';
import Pagination from '@/components/ui/pagination';
import { Inbox } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    initialSorting?: SortingState,
    enableInternalPagination?: boolean
    onFetch?: (params?: { sort?: string, page?: number }) => void,
    meta?: Omit<PaginatedData<TData>, 'data'>
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             onFetch,
                                             initialSorting,
                                             meta,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>(initialSorting ?? [])

    const pagination = useMemo<PaginationState>(() => ({
        pageIndex: meta?.current_page ? meta.current_page - 1 : 0,
        pageSize: meta?.per_page ?? 10
    }), [meta?.current_page, meta?.per_page])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater
            setSorting(next)
            if (onFetch) onFetch({ sort: toBackendSort(next), page: 1 })
        },
        getSortedRowModel: getSortedRowModel(),
        state: { sorting, pagination },
        manualSorting: true,
    })

    return (
        <div className="flex flex-col h-[80dvh] ">
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-gradient-to-r from-pink-100 to-violet-100">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-4 bg-transparent py-3 border-r border-gray-200 last:border-r-0"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                    </Table>
                </div>
            </div>

            {/* Scrollable Body with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-3 border-b border-gray-100 text-gray-700"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-64 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="border border-gray-200 bg-gray-50 p-4">
                                                <Inbox className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-500">No results found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {meta?.links?.length && (
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Showing {meta?.from} to {meta?.to} of {meta?.total} entries
                            </p>
                        </div>
                        <Pagination
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            onPageChange={(page) => {
                                if (onFetch) onFetch({ page, sort: toBackendSort(sorting) })
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

type SortableHeaderProps<TData> = {
    column: Column<TData, unknown>
    title: string
    sortable?: boolean
}

export function SortableHeader<TData>({ column, title, sortable = true }: SortableHeaderProps<TData>) {
    const sorted = useMemo(() => column.getIsSorted(), [column])

    return (
        <div
            className="flex items-center justify-between gap-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(sorted === 'asc')}
        >
            <span className="text-sm font-medium text-gray-700">
                {title}
            </span>
            {sortable && (
                <div className="flex flex-col">
                    <TriangleUpIcon
                        className={`-mb-1 h-3 w-3 ${
                            sorted === 'asc' ? 'text-pink-600' : 'text-gray-400'
                        }`}
                    />
                    <TriangleDownIcon
                        className={`-mt-1 h-3 w-3 ${
                            sorted === 'desc' ? 'text-pink-600' : 'text-gray-400'
                        }`}
                    />
                </div>
            )}
        </div>
    )
}

export function NormalHeader<TData>({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
                {title}
            </span>
        </div>
    )
}
