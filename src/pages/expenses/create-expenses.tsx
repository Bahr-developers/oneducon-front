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

interface ExpenseFormData {
    definition: string;
    price: number;
    expense_type_id: number;
    store_id: number;
}

const ExpenseForm: React.FC = () => {
    const [formData, setFormData] = useState<ExpenseFormData>({
        definition: '',
        price: 0,
        expense_type_id: 0,
        store_id: 0,
    });

    const [open, setOpen] = useState(false)

    const expenseTypes = [
        { id: 1, name: 'Oziq-ovqat' },
        { id: 2, name: 'Transport' },
        { id: 3, name: 'Kommunal' },
        { id: 4, name: 'Kiyim-kechak' },
        { id: 5, name: "Sog'liqni saqlash" },
        { id: 6, name: "O'yin-kulgi" },
        { id: 7, name: 'Boshqa' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Yangi xarajat:', formData);
        // Bu yerda API ga so'rov yuboriladi
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
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={formData.price || ''}
                            onChange={(e) => handleInputChange('price', Number(e.target.value))}
                            min="0"
                            step="1000"
                            required
                            className='h-12'
                        />
                    </div>

                    {/* Expense Type Field */}
                    <div className="space-y-2">
                        <Label htmlFor="expense_type">Xarajat turi</Label>
                        <Select
                            value={formData.expense_type_id.toString()}
                            onValueChange={(value) => handleInputChange('expense_type_id', Number(value))}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Xarajat turini tanlang" defaultValue={'Xarajat turini tanlang'} />
                            </SelectTrigger>
                            <SelectContent>
                                {expenseTypes.map((type) => (
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
                        <Button type="submit">
                            Xarajatni qo'shish
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseForm;