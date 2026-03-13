require('dotenv').config();
const db = require('./db');

async function testRead() {
    // Pegar a primeira atestação existente
    const res = await db.query('SELECT id, expected_amount, has_single_installment, single_installment_amount FROM monthly_attestations LIMIT 5');
    console.log('\n📋 Atestações existentes (campos novos):');
    console.table(res.rows);

    if (res.rows.length === 0) {
        console.log('Nenhuma atestação encontrada.');
        process.exit(0);
    }

    // Tentar atualizar a primeira com um valor de teste
    const id = res.rows[0].id;
    console.log(`\n✏️ Testando UPDATE na atestação id=${id}...`);
    const upd = await db.query(
        `UPDATE monthly_attestations 
         SET expected_amount = $1, has_single_installment = $2, single_installment_amount = $3 
         WHERE id = $4 RETURNING id, expected_amount, has_single_installment, single_installment_amount`,
        [12345.67, true, 5000.00, id]
    );
    console.log('✅ Resultado do UPDATE:');
    console.table(upd.rows);

    // Reverter para não deixar lixo
    await db.query(
        `UPDATE monthly_attestations SET expected_amount = NULL, has_single_installment = FALSE, single_installment_amount = NULL WHERE id = $1`,
        [id]
    );
    console.log('↩️ Valores revertidos.');
    process.exit(0);
}

testRead().catch(e => { console.error(e); process.exit(1); });
