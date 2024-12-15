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
        CREATE TYPE ad_status AS ENUM ('active', 'sold');
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_status') THEN
        CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
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

CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;

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
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    expertise_report VARCHAR(255)
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
    FOREIGN KEY (vehicle_ID) REFERENCES Vehicle(vehicle_ID),
    FOREIGN KEY (user_ID) REFERENCES Users(account_ID)
);

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
    bid_ID UUID NOT NULL,
    sender_ID UUID NOT NULL,
    receiver_ID UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
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
    point INTEGER,
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

