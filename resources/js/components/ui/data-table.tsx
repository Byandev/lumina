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
        <div className="flex flex-col h-[80dvh]">
            {/* Table container scrollable */}
            <div className="flex-1 overflow-y-auto max-h-screen">
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="border-t border-gray-100 dark:border-white/[0.05] rounded-t-xl">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="px-4 py-3 bg-gray-100 border border-gray-100 border-r border-gray-200 dark:border-white/[0.05]"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className='px-4 py-2 border-b border-gray-100 text-gray-700 text-theme-xs dark:text-gray-400'
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="rounded-full bg-muted p-3">
                                                <Inbox className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">No results found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination fixed at bottom */}
            {meta?.links?.length && (
                <div className="  py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
                        <div className="pb-3 xl:pb-0">
                            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
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
            className="flex items-center justify-between cursor-pointer"
            onClick={() => column.toggleSorting(sorted === 'asc')}
        >
            <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                {title}
            </p>
            { sortable && <button className="flex flex-col">
                <TriangleUpIcon className={`-mb-1 ${sorted === 'asc' ? 'text-brand-500': 'text-gray-300'}`}/>
                <TriangleDownIcon className={`-mt-1 ${sorted === 'desc' ? 'text-brand-500': 'text-gray-300'}`}/>
            </button>}
        </div>
    )
}




export function NormalHeader<TData>({ column, title }: SortableHeaderProps<TData>) {
    const sorted = useMemo(() => column.getIsSorted(), [column])

    return (
        <div
            className="flex items-center justify-between cursor-pointer"
        >
            <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                {title}
            </p>
        </div>
    )
}


