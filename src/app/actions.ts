"use server"

import { Bill } from "@/components/AddBillDialog"
import { supabase } from "@/lib/supabase"

export const createBill = async (bill: Bill) => {
    try {
        const { error } = await supabase
            .from("bills")
            .insert([bill])
        if (error) {
            throw error
        }
    } catch (error) {
        console.error("Error creating bill:", error)
    }
}

export const getAllBills = async () => {
    try {
        const { data, error } = await supabase
            .from("bills")
            .select("*")
        if (error) {
            throw error
        }
        return data
    } catch (error) {
        console.error("Error fetching bills:", error)
        return []
    }
}