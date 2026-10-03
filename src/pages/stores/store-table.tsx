import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Search, Store as StoreIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

import PaginationContyent from '@/components/_components/pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { storeUtils } from '@/utils/store'
import {Store} from "@/@types/store.ts";

const StoresTable = () => {
    const queryClient = useQueryClient()

    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    const debouncedSearch = useDebounce(search)

    const {
        data: stores,
        isLoading,
    } = useQuery({
        queryKey: [
            'stores_all',
            currentPage,
            debouncedSearch,
        ],
        queryFn: async () =>
            await storeUtils.getStore(),
    })

    const toggleStatus = useMutation({
        mutationFn: ({
                         id,
                         is_active,
                     }: {
            id: string
            is_active: boolean
        }) =>
            storeUtils.toggleStoreStatus({
                id,
                is_active,
            }),

        onSuccess: () => {
            toast.success('Do‘kon holati yangilandi')

            queryClient.invalidateQueries({
                queryKey: ['stores_all'],
            })
        },

        onError: () => {
            toast.error('Do‘kon holatini o‘zgartirishda xatolik')
        },
    })

    const handleStatusChange = (
        store: Store,
        checked: boolean,
    ) => {
        toggleStatus.mutate({
            id: store.id,
            is_active: checked,
        })
    }

    const paginatedStores = stores?.data || []

    return (
        <div className="mt-5">
            {/* Search */}
            <div className="relative my-2 w-full sm:w-[450px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    type="search"
                    placeholder="Do‘kon qidirish..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="h-12 pl-10 bg-background"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[80px] font-semibold">
                                ID
                            </TableHead>

                            <TableHead className="font-semibold">
                                Do‘kon
                            </TableHead>

                            <TableHead className="font-semibold">
                                Egasi
                            </TableHead>

                            <TableHead className="font-semibold">
                                Email
                            </TableHead>

                            <TableHead className="font-semibold">
                                USD kursi
                            </TableHead>

                            <TableHead className="font-semibold">
                                Status
                            </TableHead>

                            <TableHead className="font-semibold">
                                Sana
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {isLoading ? (
                        <TableBody>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <TableRow key={index}>
                                    {Array.from({ length: 7 }).map(
                                        (_, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                                            </TableCell>
                                        ),
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : paginatedStores.length > 0 ? (
                        <TableBody>
                            {paginatedStores.map((store: Store) => (
                                <TableRow
                                    key={store.id}
                                    className="transition-colors hover:bg-muted/50"
                                >
                                    {/* ID */}
                                    <TableCell className="font-medium">
                                        #{store.id}
                                    </TableCell>

                                    {/* Store */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                                <StoreIcon
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <p className="font-medium">
                                                    {store.name}
                                                </p>

                                                {store.link && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {store.link}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Owner */}
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {store.user?.name || '-'}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                ID: {store.user_id}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell className="text-muted-foreground">
                                        {store.email}
                                    </TableCell>

                                    {/* USD */}
                                    <TableCell>
                                        {store.usd_rate
                                            ? `${store.usd_rate.toLocaleString()} so'm`
                                            : '-'}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={store.is_active}
                                                disabled={
                                                    toggleStatus.isPending
                                                }
                                                onCheckedChange={checked =>
                                                    handleStatusChange(
                                                        store,
                                                        checked,
                                                    )
                                                }
                                            />

                                            <Badge
                                                variant={
                                                    store.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {store.is_active
                                                    ? 'Faol'
                                                    : 'Faol emas'}
                                            </Badge>
                                        </div>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-muted-foreground">
                                        {new Intl.DateTimeFormat(
                                            'uz-UZ',
                                            {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            },
                                        ).format(
                                            new Date(store.created_at),
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Do‘konlar topilmadi
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>

            <PaginationContyent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                postsPerPage={10}
                setPostPerPage={() => {}}
                totalPosts={stores?.total || 0}
            />
        </div>
    )
}

export default StoresTable