// ExpenseForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpensesTypeUtils } from '@/utils/expenses-type';
import { expensesType } from '@/types';
import NumberInput from '@/components/_components/number-input';
import { expensesUtils } from '@/utils/expenses';
import toast from 'react-hot-toast';

interface ExpenseFormData {
    definition: string;
    price: number;
    expense_type_id: number;
}

const ExpenseForm: React.FC = () => {
    const [formData, setFormData] = useState<ExpenseFormData>({
        definition: '',
        price: 0,
        expense_type_id: 0,
    });

    const storeId = localStorage.getItem('storeId') || 1

    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { data: expenseTypeData } = useQuery({
        queryKey: ['get_expensestype_data'],
        queryFn: ExpensesTypeUtils.getExpensesType
    })
    const expenseTypes = expenseTypeData?.data


    const createExpenses = useMutation({
        mutationFn: expensesUtils.postExpenses,
        onSuccess: () => {
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['get_expenses_data'] })
            toast.success("Xarajat qo'shildi")
            setFormData({
                definition: '',
                price: 0,
                expense_type_id: 0,
            })
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createExpenses.mutate({
            definition: formData.definition,
            expense_type_id: formData.expense_type_id,
            price: formData.price,
            store_id: +storeId
        })

    };

    const handleInputChange = (field: keyof ExpenseFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => setOpen(true)} className="flex items-center gap-x-2 border p-2 rounded-sm text-sm cursor-pointer px-2">Xarajat qo'shish <Plus /></DialogTrigger>
            <DialogContent className="lg:col-span-2 space-y-6 pb-0">
                <DialogHeader>
                    <DialogTitle>Yangi Xarajat Qo'shish</DialogTitle>
                    <DialogDescription>
                        Xarajatlaringizni kuzatish uchun yangi xarajat qo'shing
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between">
                    {/* Definition Field */}
                    <div className="space-y-2">
                        <Label htmlFor="definition">Xarajat nomi</Label>
                        <Input
                            id="definition"
                            placeholder="Masalan: Oziq-ovqat mahsulotlari"
                            value={formData.definition}
                            onChange={(e) => handleInputChange('definition', e.target.value)}
                            required
                            className='h-12'
                        />
                        <p className="text-sm text-muted-foreground">
                            Xarajatning qisqa tavsifini kiriting
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Summa (UZS)</Label>
                        <NumberInput
                            placeholder="0"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', Number(e.raw))}
                            className='h-12'
                        />
                    </div>

                    {/* Expense Type Field */}
                    <div className="space-y-2">
                        <Label htmlFor="expense_type">Xarajat turi</Label>
                        <Select
                            onValueChange={(value) => handleInputChange('expense_type_id', Number(value))}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Xarajat turini tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {expenseTypes?.map((type: expensesType) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-x-3 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Bekor qilish
                        </Button>
                        <Button disabled={createExpenses.isPending} type="submit">
                            {createExpenses.isPending ? "Xarajatni ..." : "Xarajatni qo'shish"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseForm;