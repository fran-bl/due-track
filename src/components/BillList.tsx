"use client"

import { deleteBill, editBill, getAllBills, markBillAsPaid } from "@/app/actions";
import { Bill } from "@/interfaces/interfaces";
import { createClient } from "@/utils/supabase/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { AddBillDialog } from "./AddBillDialog";
import { BillCard } from "./BillCard";
import { FilterDropdown } from "./FilterDropdown";

interface DecodedJWT {
    user_role: string;
}

export default function BillList() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [filter, setFilter] = useState("svi");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const jwt = jwtDecode<DecodedJWT>(session.access_token)
                setUserRole(jwt.user_role)
            } else {
                setUserRole("")
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, []);

    useEffect(() => {
        async function fetchBills() {
        const fetchedBills = await getAllBills();
            setBills(sortBills(fetchedBills));
        }
        fetchBills();
    }, []);

    const handleNewBill = (newBill: Bill) => {
        setBills(sortBills([...bills, newBill]));
    }

    const handlePaid = (id: string | undefined) => {
        async function markAsPaid() {
            await markBillAsPaid(id);
        }
        markAsPaid();

        setBills(sortBills(bills.map(bill => {
            if (bill.id === id) {
                return { ...bill, is_paid: true };
            }
            return bill;
        })));
    }

    const handleDelete = (id: string | undefined, img_url: string | undefined) => {
        async function deleteBillFn() {
            await deleteBill(id, img_url);
        }
        deleteBillFn();

        setBills(sortBills(bills.filter(bill => bill.id !== id)));
    }

    const handleEdit = (bill: Bill) => {
        async function editBillFn() {
            await editBill(bill);
        }
        editBillFn();

        setBills(sortBills(bills.map(b => b.id === bill.id ? bill : b)));
    }

    const sortBills = (bills: Bill[]) => {
        return bills.sort((a, b) => {
            const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
            const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;

            if (a.is_paid === b.is_paid === false) return dateA - dateB;
            if (a.is_paid === b.is_paid === true) return dateB - dateA;
            return a.is_paid ? 1 : -1;
        });
    }

    const handleChangeFilter = (value: string) => {
        setFilter(value)
    }
    
    return (
        <div className="grid grid-cols-4 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 gap-4">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-1 absolute top-5 left-5">
                {userRole === "admin" && (
                    <AddBillDialog onAdded={handleNewBill}/>
                )}
                <FilterDropdown filter={filter} onFilterChange={handleChangeFilter}/>
            </div>
            {bills?.filter(
                (bill: Bill) => 
                    filter === "placeni" ? bill.is_paid : 
                    filter === "neplaceni" ? !bill.is_paid : 
                    filter === "zakasnjeli" ? bill.due_date && new Date(bill.due_date) < new Date() && !bill.is_paid : true
            ).map((bill: Bill, index: number) => (
                <BillCard key={index} userRole={userRole} bill={bill} onSetPaid={handlePaid} onDelete={handleDelete} onChange={handleEdit}/>
            ))}
        </div>
    )
}
