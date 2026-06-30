-- SQL Schema for Suman Travels (Supabase PostgreSQL)

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'driver')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g., "Toyota Hycross"
    category VARCHAR(50) NOT NULL, -- "suv", "sedan", "luxury", "muv"
    brand VARCHAR(50) NOT NULL, -- "Toyota", "Maruti", "BMW"
    model VARCHAR(50) NOT NULL, -- "Hycross", "Innova", "Crysta"
    seating_capacity INT NOT NULL DEFAULT 4,
    luggage_capacity INT, -- Number of bags
    features TEXT[], -- ['AC', 'GPS', 'Leather Seats', 'Wifi']
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_luxury BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pricing Table
CREATE TABLE IF NOT EXISTS public.pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    package_type VARCHAR(50) NOT NULL, -- "local_8hrs", "local_12hrs", "airport", "outstation"
    duration_hours INT, -- NULL for airport/outstation
    distance_km INT, -- NULL for airport/outstation
    base_price DECIMAL(10,2) NOT NULL, -- In INR
    extra_hour_rate DECIMAL(10,2), -- Per extra hour
    extra_km_rate DECIMAL(10,2), -- Per extra km
    night_charge DECIMAL(10,2) DEFAULT 0, -- After 23:00
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id),
    pricing_id UUID REFERENCES public.pricing(id),
    booking_type VARCHAR(50) NOT NULL, -- "local", "airport", "outstation"
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')),
    
    -- Trip Details
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE, -- For round trips
    
    -- Passenger Details
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(100),
    
    -- Pricing Breakdown
    base_price DECIMAL(10,2) NOT NULL,
    extra_hours INT DEFAULT 0,
    extra_km INT DEFAULT 0,
    extra_charges DECIMAL(10,2) DEFAULT 0,
    night_charges DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment Details
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    payment_method VARCHAR(50), -- "cash", "online", "upi"
    
    -- Driver Assignment
    driver_id UUID REFERENCES public.profiles(id),
    driver_notes TEXT,
    
    -- Metadata / Special Requests
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Drivers Table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    vehicle_assigned UUID REFERENCES public.vehicles(id),
    is_available BOOLEAN DEFAULT true,
    rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    total_trips INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CMS Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- "privacy-policy", "terms", "about-us"
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL, -- HTML/Markdown content
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Trigger to Automatically Create User Profiles in public.profiles on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Guest User'),
        COALESCE(new.raw_user_meta_data->>'phone', new.phone, 'TEMP-' || new.id::text),
        COALESCE(new.raw_user_meta_data->>'role', 'customer'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
