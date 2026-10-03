import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
    Eye,
    Mail,
    Phone,
    Search,
    Shield,
    UserRound,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'

import PaginationContyent from '@/components/_components/pagination'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '@/store'
import { setPostsPerPage } from '@/store/paginationSlice.ts'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {userUtils} from "@/utils/users.ts";
import DebtsTableSkeleton from "@/pages/debts/debts-skeleton.tsx";


export type UserRole = 'ADMIN' | 'STORE_OWNER'

export interface User {
    id: string
    name: string
    phone: string | null
    email: string
    password?: string
    role: UserRole
    created_at: string
    updated_at: string
}

interface UserDetailsDialogProps {
    user: User
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

const getRoleLabel = (role: UserRole) => {
    switch (role) {
        case 'ADMIN':
            return 'Admin'

        case 'STORE_OWNER':
            return 'Do‘kon egasi'

        default:
            return role
    }
}

const UserDetailsDialog = ({
                               user,
                           }: UserDetailsDialogProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='h-9 w-9 p-0'
                >
                    <Eye className='h-4 w-4' />
                </Button>
            </DialogTrigger>

            <DialogContent className='max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <UserRound className='h-5 w-5' />

                        Foydalanuvchi ma'lumotlari
                    </DialogTitle>

                    <DialogDescription>
                        {user.name} haqida batafsil ma'lumot
                    </DialogDescription>
                </DialogHeader>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-base'>
                            Asosiy ma'lumotlar
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                        {/* ID */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-sm text-muted-foreground'>
                                ID
                            </span>

                            <span className='font-medium'>
                                #{user.id}
                            </span>
                        </div>

                        {/* Name */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-sm text-muted-foreground'>
                                Ism
                            </span>

                            <span className='font-medium'>
                                {user.name}
                            </span>
                        </div>

                        {/* Email */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <Mail className='h-4 w-4' />

                                Email
                            </span>

                            <span className='font-medium'>
                                {user.email}
                            </span>
                        </div>

                        {/* Phone */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <Phone className='h-4 w-4' />

                                Telefon
                            </span>

                            <span className='font-medium'>
                                {user.phone || '—'}
                            </span>
                        </div>

                        {/* Role */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <Shield className='h-4 w-4' />

                                Rol
                            </span>

                            <Badge
                                variant={
                                    user.role === 'ADMIN'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {getRoleLabel(user.role)}
                            </Badge>
                        </div>

                        {/* Created */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-sm text-muted-foreground'>
                                Yaratilgan sana
                            </span>

                            <span className='text-sm font-medium'>
                                {formatDate(user.created_at)}
                            </span>
                        </div>

                        {/* Updated */}
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-sm text-muted-foreground'>
                                Yangilangan sana
                            </span>

                            <span className='text-sm font-medium'>
                                {formatDate(user.updated_at)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}


const UsersTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)

    const [search, setSearch] = useState('')

    const debouncedSearch = useDebounce(search)

    const dispatch = useDispatch()

    const postsPerPage = useSelector(
        (state: RootState) =>
            state.pagination.postsPerPage,
    )

    const {
        data: users,
        isLoading
    } = useQuery({
        queryKey: [
            'users_all',
            postsPerPage,
            currentPage,
            debouncedSearch,
        ],

        queryFn: async () =>
            await userUtils.getUser(),
    })

    const paginated = users?.data || []

    return (
        <div className='mt-5'>
            {/* Search */}
            <div className='relative my-2 w-full sm:w-[450px]'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

                <Input
                    type='search'
                    placeholder='Foydalanuvchini qidirish...'
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className='h-12 bg-background pl-10'
                />
            </div>

            {/* Table */}
            <div className='overflow-hidden rounded-xl border bg-card'>
                <Table>
                    <TableHeader>
                        <TableRow className='border-b bg-muted/50 hover:bg-muted/50'>
                            <TableHead className='w-[80px] font-semibold'>
                                ID
                            </TableHead>

                            <TableHead className='font-semibold'>
                                Foydalanuvchi
                            </TableHead>

                            <TableHead className='font-semibold'>
                                Email
                            </TableHead>

                            <TableHead className='font-semibold'>
                                Telefon raqam
                            </TableHead>

                            <TableHead className='font-semibold'>
                                Rol
                            </TableHead>

                            <TableHead className='font-semibold'>
                                Yaratilgan sana
                            </TableHead>

                            <TableHead className='text-center font-semibold'>
                                Harakat
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {isLoading ? (
                        <DebtsTableSkeleton />
                    ) : paginated.length > 0 ? (
                        <TableBody>
                            {paginated.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    className='transition-colors hover:bg-muted/50'
                                >
                                    {/* ID */}
                                    <TableCell className='font-medium'>
                                        #{user.id}
                                    </TableCell>

                                    {/* User */}
                                    <TableCell>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted'>
                                                <UserRound className='h-4 w-4' />
                                            </div>

                                            <span className='font-medium'>
                                                {user.name}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Mail className='h-4 w-4 text-muted-foreground' />

                                            <span>
                                                {user.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Phone */}
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Phone className='h-4 w-4 text-muted-foreground' />

                                            <span>
                                                {user.phone || '—'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Role */}
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === 'ADMIN'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {getRoleLabel(user.role)}
                                        </Badge>
                                    </TableCell>

                                    {/* Created */}
                                    <TableCell>
                                        {formatDate(
                                            user.created_at,
                                        )}
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell>
                                        <div className='flex items-center justify-center'>
                                            <UserDetailsDialog
                                                user={user}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className='h-24 text-center text-muted-foreground'
                                >
                                    Foydalanuvchilar topilmadi
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>

            {/* Pagination */}
            <PaginationContyent
                currentPage={currentPage}
                setPostPerPage={n => {
                    dispatch(setPostsPerPage(n))
                    setCurrentPage(1)
                }}
                postsPerPage={postsPerPage}
                setCurrentPage={n =>
                    setCurrentPage(n)
                }
                totalPosts={users?.total || 0}
            />
        </div>
    )
}

export default UsersTable