-- Define ENUM type for user_status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active', 'banned');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ad_status') THEN
        CREATE TYPE ad_status AS ENUM ('active', 'sold', 'inactive');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_status') THEN
        CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'canceled');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gear_type') THEN
        CREATE TYPE gear_type AS ENUM ('manual', 'automatic');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fuel_type') THEN
        CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'traction_type') THEN
        CREATE TYPE traction_type AS ENUM ('2WD', '4WD', '6WD');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('Open', 'Pending', 'Closed');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
        CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Not Decided');
    END IF;
END;
$$;

-- Create car brands table
CREATE TABLE IF NOT EXISTS VehicleBrand (
    brand VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL
);

-- Create car models table
CREATE TABLE IF NOT EXISTS VehicleModel (
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(80) NOT NULL,
    PRIMARY KEY (brand, model),
    FOREIGN KEY (brand) REFERENCES vehiclebrand(brand) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Account (
    account_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    forename VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users (
    account_ID UUID PRIMARY KEY NOT NULL,
    profile_image VARCHAR(255),
    description TEXT,
    status user_status DEFAULT 'active',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (account_ID) REFERENCES Account(account_ID)
);

CREATE TABLE IF NOT EXISTS Admin (
    account_ID UUID PRIMARY KEY NOT NULL,
    FOREIGN KEY (account_ID) REFERENCES Account(account_ID)
);


-- Create ChatRoom table
CREATE TABLE IF NOT EXISTS ChatRoom (
    chatroom_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    account1_ID UUID NOT NULL,
    account2_ID UUID NOT NULL,
    FOREIGN KEY (account1_ID) REFERENCES Account(account_ID),
    FOREIGN KEY (account2_ID) REFERENCES Account(account_ID)
);

-- Create Message table
CREATE TABLE IF NOT EXISTS Message (
    chatroom_ID UUID NOT NULL,
    message_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    sender_ID UUID NOT NULL,
    text TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (chatroom_ID) REFERENCES ChatRoom(chatroom_ID),
    FOREIGN KEY (sender_ID) REFERENCES Account(account_ID)
);

-- Create Vehicle table
CREATE TABLE IF NOT EXISTS Vehicle (
    vehicle_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER NOT NULL,
    gear_type gear_type NOT NULL,
    fuel_type fuel_type NOT NULL,
    expertise_report VARCHAR(255),
    FOREIGN KEY (brand) REFERENCES vehiclebrand(brand),
    FOREIGN KEY (brand, model) REFERENCES vehiclemodel(brand, model)
);

-- Create Car table
CREATE TABLE IF NOT EXISTS Car (
    vehicle_ID UUID PRIMARY KEY NOT NULL,
    seat_count INTEGER NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID)
);

-- Create Truck table
CREATE TABLE IF NOT EXISTS Truck (
    vehicle_ID UUID PRIMARY KEY NOT NULL,
    load_capacity DECIMAL(10, 2) NOT NULL,
    traction_type traction_type NOT NULL,
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID)
);

-- Create Van table
CREATE TABLE IF NOT EXISTS Van (
    vehicle_ID UUID PRIMARY KEY NOT NULL,
    roof_height DECIMAL(5, 2) NOT NULL,
    bed_capacity INTEGER NOT NULL,
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID)
);

-- Create Motorcycle table
CREATE TABLE IF NOT EXISTS Motorcycle (
    vehicle_ID UUID PRIMARY KEY NOT NULL,
    engine_capacity INTEGER NOT NULL,
    cylinder_count INTEGER NOT NULL,
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID)
);

-- Create Ad table
CREATE TABLE IF NOT EXISTS Ad (
    ad_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    vehicle_ID UUID NOT NULL,
    user_ID UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100) NOT NULL,
    latitude DECIMAL(8,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    status ad_status DEFAULT 'active',
    views_count INTEGER DEFAULT 0,
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID),
    FOREIGN KEY (user_ID) REFERENCES Users(account_ID)
);

CREATE INDEX IF NOT EXISTS idx_latitude ON Ad(latitude);
CREATE INDEX IF NOT EXISTS idx_longitude ON Ad(longitude);
CREATE INDEX IF NOT EXISTS idx_gear_type ON Vehicle(gear_type);
CREATE INDEX IF NOT EXISTS idx_fuel_type ON Vehicle(fuel_type);
CREATE INDEX IF NOT EXISTS idx_price ON Ad(price);
CREATE INDEX IF NOT EXISTS idx_status ON Ad(status);
CREATE INDEX IF NOT EXISTS idx_year ON Vehicle(year);
CREATE INDEX IF NOT EXISTS idx_km ON Vehicle(km);
CREATE INDEX IF NOT EXISTS idx_brand ON Vehicle(brand);
CREATE INDEX IF NOT EXISTS idx_model ON Vehicle(model);

-- Create AdImage table
CREATE TABLE IF NOT EXISTS AdImage (
    ad_ID UUID NOT NULL,
    image VARCHAR(255),
    PRIMARY KEY (ad_ID, image),
    FOREIGN KEY (ad_ID) REFERENCES Ad(ad_ID)
);

-- Create Bid table
CREATE TABLE IF NOT EXISTS Bid (
    bid_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    user_ID UUID NOT NULL,
    ad_ID UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status bid_status DEFAULT 'pending',
    FOREIGN KEY (user_ID) REFERENCES Users(account_ID),
    FOREIGN KEY (ad_ID) REFERENCES Ad(ad_ID)
);

-- Create Transaction table
CREATE TABLE IF NOT EXISTS Transaction (
    transaction_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    bid_ID UUID,
    sender_ID UUID,
    receiver_ID UUID,
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (bid_ID) REFERENCES Bid(bid_ID),
    FOREIGN KEY (sender_ID) REFERENCES Users(account_ID),
    FOREIGN KEY (receiver_ID) REFERENCES Users(account_ID)
);

-- Create Evaluates table
CREATE TABLE IF NOT EXISTS Evaluates (
    evaluater_ID UUID NOT NULL,
    evaluated_ID UUID NOT NULL,
    comment TEXT,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    point INTEGER CHECK (point >= 1 AND point <= 5) NOT NULL,
    PRIMARY KEY (evaluater_ID, evaluated_ID),
    FOREIGN KEY (evaluater_ID) REFERENCES Users(account_ID),
    FOREIGN KEY (evaluated_ID) REFERENCES Users(account_ID)
);

-- Create Visits table
CREATE TABLE IF NOT EXISTS Visits (
    ad_ID UUID NOT NULL,
    account_ID UUID NOT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ad_ID, account_ID),
    FOREIGN KEY (ad_ID) REFERENCES Ad(ad_ID),
    FOREIGN KEY (account_ID) REFERENCES Users(account_ID)
);

-- Create Favorites table
CREATE TABLE IF NOT EXISTS Favorites (
    ad_ID UUID NOT NULL,
    account_ID UUID NOT NULL,
    PRIMARY KEY (ad_ID, account_ID),
    FOREIGN KEY (ad_ID) REFERENCES Ad(ad_ID),
    FOREIGN KEY (account_ID) REFERENCES Users(account_ID)
);


CREATE TABLE IF NOT EXISTS Tickets (
  ticket_ID UUID PRIMARY KEY UNIQUE NOT NULL,
  account_ID UUID NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'Not Decided',
  status ticket_status NOT NULL DEFAULT 'Open',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_ID) REFERENCES Account(account_ID)
);

-- Create function for inserting car brands
CREATE OR REPLACE FUNCTION insert_brand_function()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT * FROM VehicleBrand WHERE brand = NEW.brand) THEN
        INSERT INTO VehicleBrand (brand)
        VALUES (NEW.brand);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inserting car brands when instering a model
CREATE OR REPLACE TRIGGER insert_brand_trigger
BEFORE INSERT ON VehicleModel
FOR EACH ROW
EXECUTE FUNCTION insert_brand_function();


-- Create function for updating balance
CREATE OR REPLACE FUNCTION update_balance_function()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Users
    SET balance = balance + NEW.amount
    WHERE account_ID = NEW.receiver_ID;
    UPDATE Users
    SET balance = balance - NEW.amount
    WHERE account_ID = NEW.sender_ID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating balance
CREATE OR REPLACE TRIGGER update_balance AFTER INSERT ON Transaction
REFERENCING NEW TABLE AS new_table
FOR EACH ROW
EXECUTE FUNCTION update_balance_function();

--Create view for active ads
CREATE OR REPLACE VIEW active_ads_view AS
SELECT * FROM Ad WHERE status = 'active';
-- Create view for profile
CREATE OR REPLACE VIEW user_profile_view AS
SELECT 
    a.account_ID,
    a.forename,
    a.surname,
    a.email,
    a.phone_number,
    a.registration_date,
    u.description,
    u.profile_image
FROM Account a
INNER JOIN Users u ON a.account_ID = u.account_ID;

-- Create view for profile
CREATE OR REPLACE VIEW ticket_view AS
SELECT
    a.forename,
    a.surname,
    t.ticket_ID,
    t.subject,
    t.created_date,
    t.status,
    t.priority,
    t.description,
    t.account_ID,
    u.profile_image
FROM Tickets t
INNER JOIN Users u ON t.account_ID = u.account_ID
INNER JOIN Account a ON t.account_ID = a.account_ID;

-- Create function for updating ads and bids after ban or unban
CREATE OR REPLACE FUNCTION update_ads_bids_function()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'banned' THEN
        UPDATE ad
        SET status = 'inactive'
        WHERE user_ID = NEW.account_ID AND status = 'active';
        UPDATE bid
        SET status = 'canceled'
        WHERE (user_ID = NEW.account_ID OR ad_ID IN (SELECT ad_ID FROM ad WHERE user_ID = NEW.account_ID)) AND status = 'pending';
    END IF;
    IF NEW.status = 'active' THEN
        UPDATE ad
        SET status = 'active'
        WHERE user_ID = NEW.account_ID AND status = 'inactive';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_ads_bids AFTER UPDATE ON Users
REFERENCING NEW TABLE AS new_table
FOR EACH ROW
EXECUTE FUNCTION update_ads_bids_function();

CREATE OR REPLACE FUNCTION update_bid_status_function()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'inactive' THEN
        UPDATE bid
        SET status = 'canceled'
        WHERE ad_ID = NEW.ad_ID AND status = 'pending' OR status = 'accepted';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_bid_status AFTER UPDATE ON Ad
REFERENCING NEW TABLE AS new_table
FOR EACH ROW
EXECUTE FUNCTION update_bid_status_function();



CREATE OR REPLACE FUNCTION validate_evaluation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if a transaction exists between evaluater and evaluated
    IF NOT EXISTS (
        SELECT 1
        FROM Transaction
        WHERE (sender_ID = NEW.evaluater_ID AND receiver_ID = NEW.evaluated_ID)
    ) THEN
        RAISE EXCEPTION 'Evaluation not allowed. No transaction exists between the users.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER validate_evaluates_trigger
BEFORE INSERT OR UPDATE ON Evaluates
FOR EACH ROW
EXECUTE FUNCTION validate_evaluation();
