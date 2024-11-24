-- Define ENUM type for user_status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active', 'banned');
    END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS "Account" (
    account_ID UUID PRIMARY KEY UNIQUE NOT NULL,
    forename VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "User" (
    account_ID UUID PRIMARY KEY NOT NULL,
    profile_image VARCHAR(255),
    description TEXT,
    status user_status DEFAULT 'active',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (account_ID) REFERENCES "Account"(account_ID)
);

CREATE TABLE IF NOT EXISTS "Admin" (
    account_ID UUID PRIMARY KEY NOT NULL,
    FOREIGN KEY (account_ID) REFERENCES "Account"(account_ID)
);
