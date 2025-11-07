/* eslint-disable @typescript-eslint/no-explicit-any */
import { debt } from "@/types";


import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";

const OrderDetailsDialog = ({
    debt,
    formatCurrency,
}: {
    debt: debt;
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


export default OrderDetailsDialog