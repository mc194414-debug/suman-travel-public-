-- ============================================
-- SQL Schema for Suman Travels Invoicing Module
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Invoice Identification
    invoice_number TEXT NOT NULL UNIQUE,
    booking_id TEXT NOT NULL,
    
    -- Customer Details (auto-filled from booking but editable)
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    customer_address TEXT,
    
    -- Trip Details (auto-filled from booking but editable)
    vehicle_name TEXT NOT NULL,
    vehicle_number TEXT,
    driver_name TEXT,
    pickup_date TIMESTAMPTZ,
    return_date TIMESTAMPTZ,
    total_days INT DEFAULT 1,
    total_distance_km INT DEFAULT 0,
    extra_km INT DEFAULT 0,
    
    -- Charges Breakdown (editable)
    base_rental_amount DECIMAL(10,2) DEFAULT 0,
    driver_allowance DECIMAL(10,2) DEFAULT 0,
    night_charges DECIMAL(10,2) DEFAULT 0,
    toll_charges DECIMAL(10,2) DEFAULT 0,
    parking_charges DECIMAL(10,2) DEFAULT 0,
    extra_km_charges DECIMAL(10,2) DEFAULT 0,
    gst_percentage DECIMAL(5,2) DEFAULT 5.00,
    gst_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Totals (auto-calculated)
    subtotal DECIMAL(10,2) DEFAULT 0,
    grand_total DECIMAL(10,2) DEFAULT 0,
    advance_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    
    -- Payment
    payment_method TEXT DEFAULT 'UPI / GPay',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
    
    -- Terms & Notes
    terms TEXT[] DEFAULT ARRAY[
        'Driver allowance after 10 PM will be extra.',
        'Toll, Parking, State Permit charges are extra.',
        'Vehicle is for point to point use only.',
        'Smoking & alcohol strictly prohibited.',
        'Damage to vehicle will be charged extra.'
    ],
    notes TEXT,
    
    -- Signatures (stored as base64 strings or image urls)
    customer_signature TEXT,
    authorised_signature TEXT,
    
    -- Company Details (editable per invoice, note that GSTIN is removed)
    company_name TEXT DEFAULT 'Suman Travels',
    company_tagline TEXT DEFAULT 'Elite Chauffeur Services',
    company_address TEXT DEFAULT '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai, MH - 400049',
    company_pan TEXT DEFAULT 'ABCDE1234F',
    company_phone TEXT DEFAULT '+91 77109 66660',
    company_email TEXT DEFAULT 'sanjayindia6666@gmail.com',
    company_website TEXT DEFAULT 'www.sumantravel.com',
    
    -- Metadata
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 2. Create Invoice Payments Table (to log transaction history)
CREATE TABLE IF NOT EXISTS public.invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'UPI / GPay',
    transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) Policies
-- Grant access to Admin & Super-Admins in public.profiles table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invoices" ON public.invoices
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage invoice payments" ON public.invoice_payments
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- 4. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_booking ON public.invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice ON public.invoice_payments(invoice_id);

-- 5. Trigger: Auto-generate invoice number (INV-YYYY-XXXXX)
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $BODY$
DECLARE
    year TEXT;
    next_num INT;
BEGIN
    year := TO_CHAR(NOW(), 'YYYY');
    
    -- Find the next number in sequence for the current year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS INT)), 0) + 1
    INTO next_num
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || year || '-%';
    
    NEW.invoice_number := 'INV-' || year || '-' || LPAD(next_num::TEXT, 5, '0');
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_invoice_number ON public.invoices;
CREATE TRIGGER trigger_generate_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
    EXECUTE FUNCTION public.generate_invoice_number();

-- 6. Trigger: Auto-calculate invoice totals
CREATE OR REPLACE FUNCTION public.calculate_invoice_totals()
RETURNS TRIGGER AS $BODY$
BEGIN
    -- Subtotal calculation
    NEW.subtotal := COALESCE(NEW.base_rental_amount, 0) +
                    COALESCE(NEW.driver_allowance, 0) +
                    COALESCE(NEW.night_charges, 0) +
                    COALESCE(NEW.toll_charges, 0) +
                    COALESCE(NEW.parking_charges, 0) +
                    COALESCE(NEW.extra_km_charges, 0);
                    
    -- GST Amount calculation
    NEW.gst_amount := ROUND((NEW.subtotal * COALESCE(NEW.gst_percentage, 5.00) / 100.00), 2);
    
    -- Grand Total calculation
    NEW.grand_total := NEW.subtotal + NEW.gst_amount - COALESCE(NEW.discount_amount, 0);
    
    -- Balance Due calculation
    NEW.balance_due := NEW.grand_total - COALESCE(NEW.advance_paid, 0);
    
    -- Sync Payment Status automatically based on balance due
    IF NEW.balance_due <= 0 THEN
        NEW.payment_status := 'paid';
    ELSIF NEW.advance_paid > 0 THEN
        NEW.payment_status := 'partial';
    ELSE
        NEW.payment_status := 'pending';
    END IF;
    
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_totals ON public.invoices;
CREATE TRIGGER trigger_calculate_totals
    BEFORE INSERT OR UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_invoice_totals();
