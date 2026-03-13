require('dotenv').config();
const db = require('./db');

async function run() {
    const cols = [
        'ADD COLUMN IF NOT EXISTS expected_amount DECIMAL(15, 2)',
        'ADD COLUMN IF NOT EXISTS has_single_installment BOOLEAN DEFAULT FALSE',
        'ADD COLUMN IF NOT EXISTS single_installment_amount DECIMAL(15, 2)',
    ];

    for (const col of cols) {
        try {
            await db.query(`ALTER TABLE monthly_attestations ${col}`);
            console.log(`✅ OK: ${col}`);
        } catch (e) {
            console.log(`⚠️ Skipped (${col}): ${e.message}`);
        }
    }

    // Verificar colunas existentes
    const result = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'monthly_attestations'
        ORDER BY ordinal_position
    `);
    console.log('\n📋 Colunas em monthly_attestations:');
    result.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
