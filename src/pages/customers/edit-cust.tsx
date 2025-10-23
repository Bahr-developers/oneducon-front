import PhoneInput from "@/components/_components/phone-input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { customerType, customerUtils } from "@/utils/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const EditCustomer = ({ customer }: { customer: customerType }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(customer.name);
    const [phone, setPhone] = useState({
        formatted: customer.phone.startsWith("+998")
            ? customer.phone
            : "+998 " + customer.phone.slice(3, 5) + " " + customer.phone.slice(5, 8) + " " + customer.phone.slice(8, 10) + " " + customer.phone.slice(10, 12),
        raw: customer.phone.replace(/\D/g, ""),
        isValid: true,
    });

    const queryClient = useQueryClient();
    const storeId = localStorage.getItem("storeId");

    const customerEdit = useMutation({
        mutationFn: customerUtils.editCustomer,
        onSuccess: () => {
            toast.success("Mijoz muvaffaqiyatli tahrirlandi");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            setOpen(false);
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data.message || "Something went wrong!");
            console.log(error);
        },
    });

    const isValid = name.trim().length > 0 && phone.isValid;

    const handleEditCustomer = () => {
        if (!isValid) return;
        customerEdit.mutate({
            id: customer.id,
            name,
            phone: phone.raw,
            store_id: Number(storeId),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-x-2 cursor-pointer">
                <Edit className="h-5 w-5" />
            </DialogTrigger>

            <DialogContent w="w-[650px]">
                <DialogHeader>
                    <DialogTitle>Mijozni tahrirlash</DialogTitle>
                    <DialogDescription></DialogDescription>

                    <div className="flex items-center gap-x-4">
                        <label className="w-full">
                            <span>Mijoz ismi</span>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                placeholder="Mijoz ismini kiriting"
                                className="mt-1 h-12 w-full"
                            />
                        </label>

                        <label className="w-full">
                            <span>Mijoz telefon raqami</span>
                            <PhoneInput
                                value={phone.formatted}
                                onChange={(data) => setPhone(data)}
                                className="h-12 mt-1 w-full"
                            />
                        </label>
                    </div>

                    <Button
                        disabled={!isValid}
                        onClick={handleEditCustomer}
                        className="w-[250px] mt-5 ml-auto"
                    >
                        Saqlash
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default EditCustomer;
