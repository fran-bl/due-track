"use server"

import { Bill } from "@/interfaces/interfaces"
import { supabase } from "@/lib/supabase"

export const uploadImage = async (file: File | null) => {
    if (file) {
        try {
            const { data, error } = await supabase.storage
                .from("bill-img")
                .upload(`${file.name}`, file, { upsert: true })

            if (error) {
                throw error
            }

            return supabase.storage
                .from("bill-img")
                .getPublicUrl(data?.path).data.publicUrl
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }
}

export const createBill = async (bill: Bill) => {
    try {            
        const { data, error } = await supabase
            .from("bills")
            .insert([bill])
            .select()
        if (error) {
            throw error
        }

        return data[0].id
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

export const deleteBill = async (id: string | undefined) => {
    try {
        const { error } = await supabase
            .from("bills")
            .delete()
            .eq("id", id)
        if (error) {
            throw error
        }
    } catch (error) {
        console.error("Error deleting bill:", error)
    }
}

export const markBillAsPaid = async (id: string | undefined) => {
    try {
        const { error } = await supabase
            .from("bills")
            .update({ is_paid: true })
            .eq("id", id)
        if (error) {
            throw error
        }
    } catch (error) {
        console.error("Error updating bill:", error)
    }
}