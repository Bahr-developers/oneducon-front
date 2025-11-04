/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Eye,
    Edit,
    Save,
    X,
    User,
    Phone,
    Calendar,
    Package,
    ShoppingCart,
    FileText,
    AlertCircle,
    Search,
} from "lucide-react";

// Statik ma'lumotlar
const debtsData = [
    {
        user_id: 2,
        client: {
            id: "2",
            name: "Abrorbel",
            phone: "998989859454",
            store_id: "1",
            created_at: {},
            updated_at: {}
        },
        total_amount: 30000,
        debts: [
            {
                id: "10",
                price: 30000,
                reminder: "",
                status: "UNPAID",
                order_id: "12",
                client_id: "2",
                store_id: "1",
                created_at: { /* sana ma'lumoti */ },
                updated_at: {},
                client: {
                    id: "2",
                    name: "Abrorbel",
                    phone: "998989859454",
                    store_id: "1",
                    created_at: {},
                    updated_at: {}
                },
                order: {
                    id: "12",
                    order_number: 12,
                    total_price: 49999,
                    client_id: "1",
                    store_id: "1",
                    created_at: {},
                    updated_at: {},
                    order_items: [
                        {
                            id: "16",
                            count: 4,
                            discount: 1,
                            price: 12500,
                            product_id: "4",
                            order_id: "12",
                            created_at: {},
                            updated_at: {},
                            product: {
                                id: "4",
                                name: "Test",
                                quantity: 6,
                                reminder_quantity: 5,
                                usd_rate: 12500,
                                cost_price: 12000,
                                cost_price_usd: 10,
                                sale_price: 12500,
                                sale_price_usd: 1,
                                store_id: "1",
                                unit_id: "4",
                                category_id: "2",
                                created_at: {},
                                updated_at: {}
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        user_id: 3,
        client: {
            id: "3",
            name: "Abrorbek",
            phone: "998989859454",
            store_id: "1",
            created_at: {},
            updated_at: {}
        },
        total_amount: 30150,
        debts: [
            {
                id: "2",
                price: 20040,
                reminder: "aaa",
                status: "UNPAID",
                order_id: "3",
                client_id: "3",
                store_id: "1",
                created_at: {},
                updated_at: {},
                client: {
                    id: "3",
                    name: "Abrorbek",
                    phone: "998989859454",
                    store_id: "1",
                    created_at: {},
                    updated_at: {}
                },
                order: {
                    id: "3",
                    order_number: 3,
                    total_price: 20188,
                    client_id: "1",
                    store_id: "1",
                    created_at: {},
                    updated_at: {},
                    order_items: [
                        {
                            id: "3",
                            count: 1,
                            discount: 1,
                            price: 20000,
                            product_id: "5",
                            order_id: "3",
                            created_at: {},
                            updated_at: {},
                            product: {
                                id: "5",
                                name: "Zapchas",
                                quantity: 23,
                                reminder_quantity: 10,
                                usd_rate: 12500,
                                cost_price: 15000,
                                cost_price_usd: 1,
                                sale_price: 20000,
                                sale_price_usd: 1,
                                store_id: "1",
                                unit_id: "1",
                                category_id: "1",
                                created_at: {},
                                updated_at: {}
                            }
                        },
                        {
                            id: "4",
                            count: 2,
                            discount: 1,
                            price: 95,
                            product_id: "3",
                            order_id: "3",
                            created_at: {},
                            updated_at: {},
                            product: {
                                id: "3",
                                name: "Tiko",
                                quantity: 100,
                                reminder_quantity: 10,
                                usd_rate: 12500,
                                cost_price: 10000000,
                                cost_price_usd: 90,
                                sale_price: 95,
                                sale_price_usd: 95,
                                store_id: "1",
                                unit_id: "1",
                                category_id: "1",
                                created_at: {},
                                updated_at: {}
                            }
                        }
                    ]
                }
            },
            {
                id: "4",
                price: 2500,
                reminder: "Qaytaradi albatta",
                status: "UNPAID",
                order_id: "5",
                client_id: "3",
                store_id: "1",
                created_at: {},
                updated_at: {},
                client: {
                    id: "3",
                    name: "Abrorbek",
                    phone: "998989859454",
                    store_id: "1",
                    created_at: {},
                    updated_at: {}
                },
                order: {
                    id: "5",
                    order_number: 5,
                    total_price: 32498,
                    client_id: "1",
                    store_id: "1",
                    created_at: {},
                    updated_at: {},
                    order_items: [
                        {
                            id: "6",
                            count: 1,
                            discount: 1,
                            price: 20000,
                            product_id: "5",
                            order_id: "5",
                            created_at: {},
                            updated_at: {},
                            product: {
                                id: "5",
                                name: "Zapchas",
                                quantity: 23,
                                reminder_quantity: 10,
                                usd_rate: 12500,
                                cost_price: 15000,
                                cost_price_usd: 1,
                                sale_price: 20000,
                                sale_price_usd: 1,
                                store_id: "1",
                                unit_id: "1",
                                category_id: "1",
                                created_at: {},
                                updated_at: {}
                            }
                        },
                        {
                            id: "7",
                            count: 1,
                            discount: 1,
                            price: 12500,
                            product_id: "4",
                            order_id: "5",
                            created_at: {},
                            updated_at: {},
                            product: {
                                id: "4",
                                name: "Test",
                                quantity: 6,
                                reminder_quantity: 5,
                                usd_rate: 12500,
                                cost_price: 12000,
                                cost_price_usd: 10,
                                sale_price: 12500,
                                sale_price_usd: 1,
                                store_id: "1",
                                unit_id: "4",
                                category_id: "2",
                                created_at: {},
                                updated_at: {}
                            }
                        }
                    ]
                }
            }
        ]
    }
];

const DebtsPage = () => {
    const [editingDebt, setEditingDebt] = useState<string | null>(null);
    const [editedDebts, setEditedDebts] = useState<Record<string, any>>({});
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            UNPAID: { variant: "destructive", label: "To'lanmagan" },
            PAID: { variant: "default", label: "To'langan" },
            PARTIAL: { variant: "secondary", label: "Qisman to'langan" }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.UNPAID;

        return (
            <Badge variant={config.variant as any}>
                {config.label}
            </Badge>
        );
    };

    const handleEdit = (debtId: string) => {
        setEditingDebt(debtId);
        if (!editedDebts[debtId]) {
            const debt = debtsData
                .flatMap(client => client.debts)
                .find(d => d.id === debtId);
            if (debt) {
                setEditedDebts(prev => ({
                    ...prev,
                    [debtId]: {
                        price: debt.price,
                        reminder: debt.reminder,
                        status: debt.status
                    }
                }));
            }
        }
    };

    const handleSave = (debtId: string) => {
        // API ga saqlash logikasi bu yerda bo'ladi
        console.log("Saqlanmoqda:", debtId, editedDebts[debtId]);

        // Ma'lumotlarni yangilash (keyinroq API bilan almashtiriladi)
        const updatedData = debtsData.map(client => ({
            ...client,
            debts: client.debts.map(debt =>
                debt.id === debtId
                    ? { ...debt, ...editedDebts[debtId] }
                    : debt
            )
        }));

        console.log("Yangilangan ma'lumotlar:", updatedData);
        setEditingDebt(null);

        // Muvaffaqiyatli saqlandi xabari
        alert("Qarz ma'lumotlari muvaffaqiyatli yangilandi!");
    };

    const handleCancel = (debtId: string) => {
        setEditingDebt(null);
        setEditedDebts(prev => {
            const newEdited = { ...prev };
            delete newEdited[debtId];
            return newEdited;
        });
    };

    const handleChange = (debtId: string, field: string, value: any) => {
        setEditedDebts(prev => ({
            ...prev,
            [debtId]: {
                ...prev[debtId],
                [field]: value
            }
        }));
    };

    // Filtrlash funksiyalari
    const filteredClients = debtsData
        .filter(client => {
            if (selectedClient && client.client.id !== selectedClient) return false;
            if (searchTerm && !client.client.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        })
        .map(client => ({
            ...client,
            debts: client.debts.filter(debt =>
                statusFilter === "ALL" || debt.status === statusFilter
            )
        }))
        .filter(client => client.debts.length > 0);

    const totalOverallDebt = filteredClients.reduce((sum, client) => sum + client.total_amount, 0);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Sarlavha va Statistikalar */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Qarzlar Boshqaruvi</h1>
                    <p className="text-gray-600 mt-2">
                        Jami {filteredClients.length} ta mijoz, {filteredClients.reduce((sum, client) => sum + client.debts.length, 0)} ta qarz
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(totalOverallDebt)}
                    </div>
                    <div className="text-sm text-gray-600">Umumiy qarz summasi</div>
                </div>
            </div>

            {/* Filtrlar va Qidiruv */}
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

            {/* Mijozlar Filter Tugmalari */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={selectedClient === null ? "default" : "outline"}
                    onClick={() => setSelectedClient(null)}
                    className="mb-2"
                >
                    Barcha mijozlar
                </Button>
                {debtsData.map(client => (
                    <Button
                        key={client.client.id}
                        variant={selectedClient === client.client.id ? "default" : "outline"}
                        onClick={() => setSelectedClient(client.client.id)}
                        className="flex items-center gap-2 mb-2"
                    >
                        <User className="h-4 w-4" />
                        {client.client.name}
                        <Badge variant="secondary" className="ml-1">
                            {client.debts.length}
                        </Badge>
                    </Button>
                ))}
            </div>

            {/* Mijozlar Ro'yxati */}
            <div className="space-y-6">
                {filteredClients.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Qarzlar topilmadi</h3>
                            <p className="text-gray-600 mt-2">
                                Tanlangan filtrlarga mos keladigan qarzlar mavjud emas
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredClients.map(clientData => (
                        <Card key={clientData.client.id} className="border-l-4 border-l-blue-500 shadow-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                {clientData.client.name}
                                                <Badge variant="outline" className="ml-2">
                                                    {clientData.debts.length} ta qarz
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Phone className="h-4 w-4" />
                                                {clientData.client.phone}
                                                <span className="text-gray-400">•</span>
                                                <span>ID: {clientData.client.id}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-red-600">
                                            {formatCurrency(clientData.total_amount)}
                                        </div>
                                        <div className="text-sm text-gray-600">Jami qarz summasi</div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {/* Qarzlar Jadvali */}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[120px]">Buyurtma №</TableHead>
                                                <TableHead>Buyurtma summasi</TableHead>
                                                <TableHead>Qarz miqdori</TableHead>
                                                <TableHead>Eslatma</TableHead>
                                                <TableHead className="w-[140px]">Holati</TableHead>
                                                <TableHead className="w-[120px]">Sana</TableHead>
                                                <TableHead className="w-[140px]">Harakatlar</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {clientData.debts.map(debt => (
                                                <TableRow key={debt.id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                                                            <span className="font-mono font-medium">#{debt.order.order_number}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatCurrency(debt.order.total_price)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {editingDebt === debt.id ? (
                                                            <Input
                                                                type="number"
                                                                value={editedDebts[debt.id]?.price || debt.price}
                                                                onChange={(e) => handleChange(debt.id, 'price', Number(e.target.value))}
                                                                className="w-32 font-bold"
                                                            />
                                                        ) : (
                                                            <div className="font-bold text-red-600 text-lg">
                                                                {formatCurrency(debt.price)}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                        {editingDebt === debt.id ? (
                                                            <Textarea
                                                                value={editedDebts[debt.id]?.reminder || debt.reminder}
                                                                onChange={(e) => handleChange(debt.id, 'reminder', e.target.value)}
                                                                placeholder="Eslatma qo'shing..."
                                                                className="min-h-[60px] text-sm"
                                                            />
                                                        ) : (
                                                            <div>
                                                                {debt.reminder ? (
                                                                    <div className="flex items-start gap-2">
                                                                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-sm leading-relaxed">{debt.reminder}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm italic">Eslatma yo'q</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {editingDebt === debt.id ? (
                                                            <select
                                                                value={editedDebts[debt.id]?.status || debt.status}
                                                                onChange={(e) => handleChange(debt.id, 'status', e.target.value)}
                                                                className="w-full p-2 border rounded-md text-sm"
                                                            >
                                                                <option value="UNPAID">To'lanmagan</option>
                                                                <option value="PAID">To'langan</option>
                                                                <option value="PARTIAL">Qisman to'langan</option>
                                                            </select>
                                                        ) : (
                                                            getStatusBadge(debt.status)
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date().toLocaleDateString('uz-UZ')}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {editingDebt === debt.id ? (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSave(debt.id)}
                                                                        className="h-8 bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        <Save className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleCancel(debt.id)}
                                                                        className="h-8"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleEdit(debt.id)}
                                                                        className="h-8"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <OrderDetailsDialog debt={debt} formatCurrency={formatCurrency} />
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Buyurtma Tarkiblari */}
                                <div className="p-4 border-t bg-gray-50">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                                        <Package className="h-4 w-4" />
                                        Buyurtma tarkiblari
                                    </h4>
                                    <div className="grid gap-3">
                                        {clientData.debts.flatMap(debt =>
                                            debt.order.order_items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                            <FileText className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{item.product.name}</div>
                                                            <div className="text-sm text-gray-600">
                                                                {item.count} ta × {formatCurrency(item.price)}
                                                                {item.discount > 1 && (
                                                                    <span className="text-green-600 ml-2">
                                                                        (-{formatCurrency(item.discount)} chegirma)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-lg">
                                                            {formatCurrency(item.count * item.price - (item.discount > 1 ? item.discount : 0))}
                                                        </div>
                                                        <div className={`text-sm ${item.product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {item.product.quantity > 0 ? `${item.product.quantity} ta omborda` : 'Qolmagan'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

// Buyurtma Tafsilotlari Dialogi
const OrderDetailsDialog = ({ debt, formatCurrency }: { debt: any, formatCurrency: (amount: number) => string }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-5 w-5" />
                        Buyurtma #{debt.order.order_number} tafsilotlari
                    </DialogTitle>
                    <DialogDescription>
                        Mijoz: {debt.client.name} | Telefon: {debt.client.phone}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Buyurtma Umumiy Ma'lumotlari */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Jami Buyurtma</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(debt.order.total_price)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Qarz Miqdori</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(debt.price)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Holati</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant={debt.status === "UNPAID" ? "destructive" : "default"} className="text-lg">
                                    {debt.status === "UNPAID" ? "To'lanmagan" : "To'langan"}
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mahsulotlar Jadvali */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Buyurtma Mahsulotlari
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mahsulot</TableHead>
                                        <TableHead>Miqdor</TableHead>
                                        <TableHead>Don Narxi</TableHead>
                                        <TableHead>Chegirma</TableHead>
                                        <TableHead>Jami</TableHead>
                                        <TableHead>Holati</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {debt.order.order_items.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.product.name}</div>
                                                <div className="text-sm text-gray-600">ID: {item.product.id}</div>
                                            </TableCell>
                                            <TableCell>{item.count} ta</TableCell>
                                            <TableCell>{formatCurrency(item.price)}</TableCell>
                                            <TableCell>
                                                {item.discount > 1 ? formatCurrency(item.discount) : '-'}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(item.count * item.price - (item.discount > 1 ? item.discount : 0))}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.product.quantity > 0 ? "default" : "destructive"}>
                                                    {item.product.quantity > 0 ? 'Mavjud' : 'Qolmagan'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Eslatma */}
                    {debt.reminder && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    Eslatma
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{debt.reminder}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DebtsPage;