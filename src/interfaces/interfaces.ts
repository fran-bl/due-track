export interface Bill {
    id?: string;
    description: string;
    amount: number;
    due_date?: string;
    created_at?: string;
    is_paid: boolean;
    img_url?: string;
}

export interface BillErrors {
    description?: string
    amount?: string
    due_date?: string
    img_url?: string
}
