const db = require('./db');

async function checkData() {
    try {
        const cancelledCount = await db.query("SELECT COUNT(*) FROM demands WHERE status = 'CANCELADA'");
        console.log("Canceled demands total:", cancelledCount.rows[0].count);

        const cancelledWithRequester = await db.query("SELECT COUNT(*) FROM demands WHERE status = 'CANCELADA' AND requester_id IS NOT NULL");
        console.log("Canceled demands with requester_id:", cancelledWithRequester.rows[0].count);

        const reopeningsCount = await db.query("SELECT COUNT(*) FROM demand_reopenings");
        console.log("Total reopenings:", reopeningsCount.rows[0].count);

        const ranking = await db.query(`
            SELECT r.name, COUNT(d.id) as count
            FROM demands d
            LEFT JOIN requesters r ON d.requester_id = r.id
            WHERE d.status = 'CANCELADA'
            GROUP BY r.id, r.name
        `);
        console.log("Ranking Preview:", ranking.rows);

        const reopeningsByReason = await db.query(`
            SELECT reason_label as name, COUNT(*) as count 
            FROM demand_reopenings 
            GROUP BY reason_label
        `);
        console.log("Reopenings by Reason Preview:", reopeningsByReason.rows);

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkData();
