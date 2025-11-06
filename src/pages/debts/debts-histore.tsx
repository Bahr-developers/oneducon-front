/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { debtsUtils } from "@/utils/debts";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Eye, Edit, Save, X, User, Phone, Calendar,
    Package, ShoppingCart, AlertCircle, Search, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const DebtsPage = () => {
    const { id: userId } = useParams();
    const [editingDebt, setEditingDebt] = useState<string | null>(null);
    const [editedDebts, setEditedDebts] = useState<Record<string, any>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const { data: debtsClient, isLoading } = useQuery({
        queryKey: ["get_all_client_debts", userId],
        queryFn: () => debtsUtils.getDebtByClientId(userId as string),
        enabled: !!userId,
    });

    // Ma'lumotlarni to'g'ri olish
    const debtsData = debtsClient?.data;
    const clientData = debtsData?.client;
    const debtsArray = debtsData?.debts ?? [];

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";

    const getStatusBadge = (status?: string) => {
        const config = {
            UNPAID: { variant: "destructive", label: "To'lanmagan" },
            PAID: { variant: "default", label: "To'langan" },
            PARTIAL: { variant: "secondary", label: "Qisman to'langan" },
        }[status || "UNPAID"];

        return <Badge variant={config?.variant as any}>{config?.label}</Badge>;
    };

    console.log(debtsData);

    const handleEdit = (debtId: string) => {
        setEditingDebt(debtId);
        if (!editedDebts[debtId]) {
            const debt = debtsArray?.find((d: any) => d.id === debtId);
            if (debt) {
                setEditedDebts((prev) => ({
                    ...prev,
                    [debtId]: {
                        price: debt.price,
                        reminder: debt.reminder,
                        status: debt.status,
                    },
                }));
            }
        }
    };

    const handleSave = (debtId: string) => {
        console.log("Saqlanmoqda:", debtId, editedDebts[debtId]);
        setEditingDebt(null);
        alert("Qarz ma'lumotlari muvaffaqiyatli yangilandi!");
    };

    const handleCancel = (debtId: string) => {
        setEditingDebt(null);
        setEditedDebts((prev) => {
            const newEdited = { ...prev };
            delete newEdited[debtId];
            return newEdited;
        });
    };

    const handleChange = (debtId: string, field: string, value: any) => {
        setEditedDebts((prev) => ({
            ...prev,
            [debtId]: { ...prev[debtId], [field]: value },
        }));
    };

    // 🔍 Filtrlash - endi faqat bitta mijoz bo'lgani uchun soddalashtirildi
    const filteredDebts = debtsArray?.filter((debt: any) =>
        statusFilter === "ALL" || debt?.status === statusFilter
    ) ?? [];

    const totalOverallDebt = filteredDebts?.reduce(
        (sum: number, debt: any) => sum + (debt?.price || 0),
        0
    ) ?? 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-80">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Qarzlar Boshqaruvi</h1>
                    <p className="text-gray-600 mt-2">
                        {filteredDebts?.length || 0} ta qarz
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalOverallDebt)}
                    </div>
                    <div className="text-sm text-gray-600">Umumiy qarz summasi</div>
                </div>
            </div>

            {/* Filtrlar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Mijoz nomi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="ALL">Barcha holatlar</option>
                            <option value="UNPAID">To'lanmagan</option>
                            <option value="PAID">To'langan</option>
                            <option value="PARTIAL">Qisman to'langan</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Mijoz ma'lumotlari */}
            {clientData && (
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        {clientData?.name}
                                        <Badge variant="outline" className="ml-2">
                                            {filteredDebts?.length || 0} ta qarz
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4" />
                                        {clientData?.phone}
                                        <span className="text-gray-400">•</span>
                                        <span>ID: {clientData?.id}</span>
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(debtsData?.total_amount || 0)}
                                </div>
                                <div className="text-sm text-gray-600">Jami qarz summasi</div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Jadval */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Buyurtma №</TableHead>
                                        <TableHead>Buyurtma summasi</TableHead>
                                        <TableHead>Qarz miqdori</TableHead>
                                        <TableHead>Eslatma</TableHead>
                                        <TableHead>Holati</TableHead>
                                        <TableHead>Sana</TableHead>
                                        <TableHead>Harakatlar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDebts?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900">Qarzlar topilmadi</h3>
                                                <p className="text-gray-600 mt-2">
                                                    Tanlangan filtrlarga mos keladigan qarzlar mavjud emas
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDebts?.map((debt: any) => (
                                            <TableRow key={debt?.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                                                        <span className="font-mono font-medium">
                                                            #{debt?.order?.order_number}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatCurrency(debt?.order?.total_price || 0)}</TableCell>
                                                <TableCell>
                                                    {editingDebt === debt?.id ? (
                                                        <Input
                                                            type="number"
                                                            value={editedDebts[debt?.id]?.price ?? debt?.price ?? ""}
                                                            onChange={(e) =>
                                                                handleChange(debt?.id, "price", Number(e.target.value))
                                                            }
                                                            className="w-32"
                                                        />
                                                    ) : (
                                                        <div className="font-bold text-red-600">
                                                            {formatCurrency(debt?.price || 0)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editingDebt === debt?.id ? (
                                                        <Textarea
                                                            value={editedDebts[debt?.id]?.reminder ?? debt?.reminder ?? ""}
                                                            onChange={(e) =>
                                                                handleChange(debt?.id, "reminder", e.target.value)
                                                            }
                                                        />
                                                    ) : (
                                                        <div>
                                                            {debt?.reminder ? (
                                                                <div className="flex items-start gap-2">
                                                                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                                                    <span className="text-sm">{debt?.reminder}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm italic">
                                                                    Eslatma yo'q
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {editingDebt === debt?.id ? (
                                                        <select
                                                            value={editedDebts[debt?.id]?.status ?? debt?.status ?? "UNPAID"}
                                                            onChange={(e) =>
                                                                handleChange(debt?.id, "status", e.target.value)
                                                            }
                                                            className="p-2 border rounded-md text-sm"
                                                        >
                                                            <option value="UNPAID">To'lanmagan</option>
                                                            <option value="PAID">To'langan</option>
                                                            <option value="PARTIAL">Qisman to'langan</option>
                                                        </select>
                                                    ) : (
                                                        getStatusBadge(debt?.status)
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4 inline mr-1" />
                                                    {new Date().toLocaleDateString("uz-UZ")}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {editingDebt === debt?.id ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleSave(debt?.id)}
                                                                    className="h-8 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Save className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleCancel(debt?.id)}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEdit(debt?.id)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <OrderDetailsDialog debt={debt} formatCurrency={formatCurrency} />
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

/* 🔹 Buyurtma tafsilotlari dialogi */
const OrderDetailsDialog = ({
    debt,
    formatCurrency,
}: {
    debt: any;
    formatCurrency: (n: number) => string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Buyurtma #{debt?.order?.order_number}
                    </DialogTitle>
                    <DialogDescription>
                        Mijoz: {debt?.client?.name} | Telefon: {debt?.client?.phone}
                    </DialogDescription>
                </DialogHeader>

                <Card>
                    <CardHeader>
                        <CardTitle>Buyurtma summasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {formatCurrency(debt?.order?.total_price || 0)}
                    </CardContent>
                </Card>

                {/* Buyurtma mahsulotlari */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buyurtma mahsulotlari</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mahsulot</TableHead>
                                    <TableHead>Soni</TableHead>
                                    <TableHead>Narxi</TableHead>
                                    <TableHead>Chegirma</TableHead>
                                    <TableHead>Jami</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debt?.order?.order_items?.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.product?.name}</TableCell>
                                        <TableCell>{item.count}</TableCell>
                                        <TableCell>{formatCurrency(item.price)}</TableCell>
                                        <TableCell>{item.discount}</TableCell>
                                        <TableCell>{formatCurrency(item.count * item.price)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default DebtsPage;