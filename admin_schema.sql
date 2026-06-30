-- ============================================================
-- SUMAN TRAVELS — ADMIN PANEL EXTENDED SQL SCHEMA
-- Run this in your Supabase SQL Editor AFTER supabase_schema.sql
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLE: cars (Full fleet registry, replaces vehicles)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,                        -- "Toyota Innova Crysta"
    category VARCHAR(50) NOT NULL                      -- 'premium' | 'executive' | 'small' | 'luxury' | 'suv'
        CHECK (category IN ('premium','executive','small','luxury','suv','muv')),
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,        -- "MH-01-AB-1234"
    year INT,
    seating_capacity INT NOT NULL DEFAULT 4,
    fuel_type VARCHAR(20) DEFAULT 'Petrol'
        CHECK (fuel_type IN ('Petrol','Diesel','CNG','Electric','Hybrid')),
    odometer_reading INT DEFAULT 0,                    -- Current km
    photos TEXT[] DEFAULT '{}',                        -- Array of image URLs
    status VARCHAR(20) DEFAULT 'available'
        CHECK (status IN ('available','on_trip','maintenance','retired')),
    features TEXT[] DEFAULT '{}',                      -- ['AC', 'GPS', 'Leather']
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: car_pricing (Per-car editable pricing — all packages)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.car_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,

    -- Standard Packages (INR)
    price_12hrs_100km DECIMAL(10,2) DEFAULT 0,
    price_8hrs_80km   DECIMAL(10,2) DEFAULT 0,
    price_airport     DECIMAL(10,2) DEFAULT 0,         -- Airport pickup/drop
    extra_hour_rate   DECIMAL(10,2) DEFAULT 0,
    extra_km_rate     DECIMAL(10,2) DEFAULT 0,
    driver_night_charge DECIMAL(10,2) DEFAULT 200,     -- After night_charge_start
    night_charge_start TIME DEFAULT '23:00:00',

    -- USD Pricing (manual or auto-converted)
    enable_usd_pricing BOOLEAN DEFAULT false,
    price_12hrs_usd    DECIMAL(10,2),
    price_8hrs_usd     DECIMAL(10,2),
    price_airport_usd  DECIMAL(10,2),

    -- Toll & Parking Policy
    toll_policy VARCHAR(20) DEFAULT 'actual'           -- 'actual' | 'included'
        CHECK (toll_policy IN ('actual','included')),
    parking_policy VARCHAR(20) DEFAULT 'actual'
        CHECK (parking_policy IN ('actual','included')),

    template_name VARCHAR(100),                        -- Pricing template name
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(car_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: customers (Full CRM)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    id_proof_type VARCHAR(30)
        CHECK (id_proof_type IN ('Aadhar','PAN','Driving License','Passport','Other')),
    id_proof_url TEXT,
    company_name VARCHAR(150),
    gst_number VARCHAR(20),
    loyalty_status VARCHAR(20) DEFAULT 'regular'
        CHECK (loyalty_status IN ('regular','silver','gold','corporate')),
    total_spent DECIMAL(12,2) DEFAULT 0,
    tags TEXT[] DEFAULT '{}',                          -- ['Corporate', 'VIP', 'Repeat']
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: drivers (Extended driver management)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE,
    photo_url TEXT,
    assigned_car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'available'
        CHECK (status IN ('available','on_duty','off_duty','inactive')),
    total_trips INT DEFAULT 0,
    night_duties INT DEFAULT 0,
    avg_rating DECIMAL(2,1) DEFAULT 5.0,
    commission_type VARCHAR(20) DEFAULT 'fixed'
        CHECK (commission_type IN ('fixed','percent')),
    commission_value DECIMAL(10,2) DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: admin_bookings (Extended bookings for admin panel)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,        -- "ST-2026-1024"
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,

    -- Trip Details
    trip_type VARCHAR(30) NOT NULL
        CHECK (trip_type IN ('local','outstation','airport','hourly')),
    package_type VARCHAR(30)
        CHECK (package_type IN ('8hrs_80km','12hrs_100km','airport','custom','hourly')),
    pickup_location TEXT NOT NULL,
    drop_location TEXT,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    expected_dropoff TIMESTAMPTZ,
    actual_dropoff TIMESTAMPTZ,

    -- Odometer
    odometer_start INT,
    odometer_end INT,
    actual_km INT GENERATED ALWAYS AS (COALESCE(odometer_end,0) - COALESCE(odometer_start,0)) STORED,

    -- Status Workflow
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending','confirmed','on_trip','completed','cancelled')),
    cancellation_reason TEXT,

    -- Estimated pricing (at booking time)
    estimated_price DECIMAL(10,2),

    -- Passenger details (snapshot)
    passenger_name VARCHAR(150),
    passenger_phone VARCHAR(20),
    passenger_email VARCHAR(100),
    special_requests TEXT,

    -- Source (WhatsApp/Website/Phone/Walk-in)
    source VARCHAR(30) DEFAULT 'whatsapp'
        CHECK (source IN ('whatsapp','website','phone','walkin','referral')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number := 'ST-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                          LPAD(NEXTVAL('booking_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS booking_seq START 1000;
DROP TRIGGER IF EXISTS set_booking_number ON public.admin_bookings;
CREATE TRIGGER set_booking_number
    BEFORE INSERT ON public.admin_bookings
    FOR EACH ROW EXECUTE FUNCTION generate_booking_number();

-- ─────────────────────────────────────────────────────────────
-- TABLE: bills (CA-Level billing with full breakdown)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES public.admin_bookings(id) ON DELETE CASCADE,
    bill_number VARCHAR(20) UNIQUE NOT NULL,           -- "INV-2026-1024"

    -- Calculation breakdown (all amounts in INR)
    package_amount     DECIMAL(10,2) DEFAULT 0,
    extra_hours        DECIMAL(5,2) DEFAULT 0,
    extra_hours_amount DECIMAL(10,2) DEFAULT 0,
    extra_km           INT DEFAULT 0,
    extra_km_amount    DECIMAL(10,2) DEFAULT 0,
    night_charge_amount DECIMAL(10,2) DEFAULT 0,
    toll_amount        DECIMAL(10,2) DEFAULT 0,
    toll_description   TEXT,
    parking_amount     DECIMAL(10,2) DEFAULT 0,
    other_charges      DECIMAL(10,2) DEFAULT 0,
    other_description  TEXT,
    discount_amount    DECIMAL(10,2) DEFAULT 0,
    discount_reason    TEXT,
    subtotal           DECIMAL(10,2) DEFAULT 0,
    gst_rate           DECIMAL(5,2) DEFAULT 5.00,
    gst_amount         DECIMAL(10,2) DEFAULT 0,
    total_amount       DECIMAL(10,2) DEFAULT 0,

    -- Payment tracking
    amount_paid        DECIMAL(10,2) DEFAULT 0,
    balance_due        DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,

    -- Bill status
    status VARCHAR(30) DEFAULT 'draft'
        CHECK (status IN ('draft','sent','partial','paid','closed')),

    -- USD fields
    show_usd           BOOLEAN DEFAULT false,
    usd_rate           DECIMAL(10,4),                 -- Exchange rate at bill time
    total_usd          DECIMAL(10,2),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: payments (Payment transaction log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL
        CHECK (payment_mode IN ('cash','upi','card','bank_transfer','cheque')),
    transaction_id VARCHAR(100),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    recorded_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: business_settings (Admin-editable global config)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.business_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),      -- Singleton row
    company_name VARCHAR(200) DEFAULT 'Suman Travels',
    company_address TEXT DEFAULT '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai – 400049',
    company_phone VARCHAR(20) DEFAULT '+91 77109 66660',
    company_email VARCHAR(100) DEFAULT 'sanjayindia6666@gmail.com',
    gst_number VARCHAR(20),
    company_logo_url TEXT,

    -- Billing Config
    default_gst_rate DECIMAL(5,2) DEFAULT 5.00,
    night_charge_start TIME DEFAULT '23:00:00',
    bill_terms TEXT DEFAULT 'Toll, parking & state permit charges at actuals. GST @ 5% applicable.',

    -- USD Exchange Rate
    usd_rate_inr DECIMAL(10,4) DEFAULT 83.5000,       -- Manual override rate
    usd_rate_live DECIMAL(10,4),                       -- Last fetched live rate
    usd_rate_last_updated TIMESTAMPTZ,
    use_live_usd_rate BOOLEAN DEFAULT true,

    -- Notification Templates
    whatsapp_booking_template TEXT,
    whatsapp_bill_template TEXT,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO public.business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Auto-generate bill number
CREATE SEQUENCE IF NOT EXISTS bill_seq START 1000;
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.bill_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                       LPAD(NEXTVAL('bill_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_bill_number ON public.bills;
CREATE TRIGGER set_bill_number
    BEFORE INSERT ON public.bills
    FOR EACH ROW EXECUTE FUNCTION generate_bill_number();

-- ─────────────────────────────────────────────────────────────
-- SEED DATA: Current fleet with pricing
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.cars (name, category, vehicle_number, seating_capacity, fuel_type, odometer_reading, status) VALUES
('Toyota Innova Hycross', 'luxury', 'MH-01-AB-1001', 7, 'Hybrid', 12500, 'available'),
('Toyota Innova Crysta', 'premium', 'MH-01-AB-1002', 7, 'Diesel', 45000, 'available'),
('Maruti Suzuki Ertiga', 'muv', 'MH-01-AB-1003', 6, 'Petrol', 28000, 'available'),
('Swift Dzire', 'small', 'MH-01-AB-1004', 4, 'Petrol', 33000, 'available'),
('Toyota Etios', 'small', 'MH-01-AB-1005', 4, 'Petrol', 52000, 'available')
ON CONFLICT DO NOTHING;

-- Insert pricing for each car (using subqueries to get IDs)
INSERT INTO public.car_pricing (car_id, price_12hrs_100km, price_8hrs_80km, price_airport, extra_hour_rate, extra_km_rate, driver_night_charge)
SELECT id, 6000, 4500, 0, 300, 30, 200 FROM public.cars WHERE name = 'Toyota Innova Hycross' ON CONFLICT (car_id) DO NOTHING;

INSERT INTO public.car_pricing (car_id, price_12hrs_100km, price_8hrs_80km, price_airport, extra_hour_rate, extra_km_rate, driver_night_charge)
SELECT id, 5000, 3800, 2200, 250, 23, 200 FROM public.cars WHERE name = 'Toyota Innova Crysta' ON CONFLICT (car_id) DO NOTHING;

INSERT INTO public.car_pricing (car_id, price_12hrs_100km, price_8hrs_80km, price_airport, extra_hour_rate, extra_km_rate, driver_night_charge)
SELECT id, 4000, 3000, 2000, 200, 18, 200 FROM public.cars WHERE name = 'Maruti Suzuki Ertiga' ON CONFLICT (car_id) DO NOTHING;

INSERT INTO public.car_pricing (car_id, price_12hrs_100km, price_8hrs_80km, price_airport, extra_hour_rate, extra_km_rate, driver_night_charge)
SELECT id, 3200, 2500, 1500, 200, 15, 200 FROM public.cars WHERE name = 'Swift Dzire' ON CONFLICT (car_id) DO NOTHING;

INSERT INTO public.car_pricing (car_id, price_12hrs_100km, price_8hrs_80km, price_airport, extra_hour_rate, extra_km_rate, driver_night_charge)
SELECT id, 3200, 2500, 1500, 200, 15, 200 FROM public.cars WHERE name = 'Toyota Etios' ON CONFLICT (car_id) DO NOTHING;
