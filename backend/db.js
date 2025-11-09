import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Connected to the database!');
});

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance INT DEFAULT 100 NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const createWithdrawalsTable = `
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    option_name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const createAdminUser = async () => {
    const adminEmail = 'admin@primesurveys.com';
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (res.rowCount === 0) {
            console.log('Admin user not found, creating one...');
            // In a real app, the password should be securely generated or set via another script.
            // For this demo, we're setting a default password 'admin123'.
            // The hash can be generated with: bcrypt.hashSync('admin123', 10)
            const adminPasswordHash = '$2a$10$f/O.lG5/K1.s.L0K3O/2MeG.N6jS8c7YXIY2w.AbmHwspPDFiRQuC';
            await client.query(
                `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
                ['Admin', adminEmail, adminPasswordHash, 'admin']
            );
            console.log('Admin user created successfully.');
        }
    } finally {
        client.release();
    }
}

export const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query(createUsersTable);
        await client.query(createWithdrawalsTable);
        console.log("Database tables checked/created successfully.");
        await createAdminUser();
    } catch (err) {
        console.error("Error initializing database tables:", err);
        throw err;
    } finally {
        client.release();
    }
};
