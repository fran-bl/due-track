"use server"

import { Bill } from "@/interfaces/interfaces"
import { createClient } from "@/utils/supabase/server"

export const uploadImage = async (file: File | null, desc: string) => {
    if (file) {
        try {
            const supabase = await createClient()

            const extension = file.name.split('.').pop()

            const { data, error } = await supabase.storage
                .from("bill-img")
                .upload(`bills/${desc}.${extension}`, file, { upsert: true })

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
        const supabase =  await createClient()

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
        const supabase = await createClient()

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

export const deleteBill = async (id: string | undefined, img_url: string | undefined) => {
    const supabase = await createClient()

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

    if (img_url) {
        try {
            const filePath = img_url.split('/storage/v1/object/public/bill-img/')[1];

            const { error } = await supabase.storage
                .from('bill-img')
                .remove([filePath]);

            if (error) {
                throw error
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
}

export const markBillAsPaid = async (id: string | undefined) => {
    try {
        const supabase = await createClient()
        
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