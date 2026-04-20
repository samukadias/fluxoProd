const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/fluxo_prod' });

client.connect().then(async () => {
    const queries = [
        // 1. Table count overview
        `SELECT 'demands' as tbl, COUNT(*) FROM demands
         UNION ALL SELECT 'clients', COUNT(*) FROM clients
         UNION ALL SELECT 'users', COUNT(*) FROM users
         UNION ALL SELECT 'monthly_attestations', COUNT(*) FROM monthly_attestations
         UNION ALL SELECT 'finance_contracts', COUNT(*) FROM finance_contracts
         UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
         UNION ALL SELECT 'demand_annotations', COUNT(*) FROM demand_annotations
         UNION ALL SELECT 'status_history', COUNT(*) FROM status_history
         UNION ALL SELECT 'stage_history', COUNT(*) FROM stage_history
         ORDER BY 1`,
        
        // 2. Demands with no client
        `SELECT COUNT(*) as demands_no_client FROM demands WHERE client_id IS NULL`,
        
        // 3. Demands with no analyst
        `SELECT COUNT(*) as demands_no_analyst FROM demands WHERE analyst_id IS NULL AND status NOT IN ('ENTREGUE','CANCELADA')`,
        
        // 4. Demands with no cycle
        `SELECT COUNT(*) as demands_no_cycle FROM demands WHERE cycle_id IS NULL AND status NOT IN ('ENTREGUE','CANCELADA')`,
        
        // 5. Demand statuses
        `SELECT status, COUNT(*) FROM demands GROUP BY status ORDER BY COUNT(*) DESC`,
        
        // 6. Users by role
        `SELECT role, department, COUNT(*) FROM users GROUP BY role, department ORDER BY role`,
        
        // 7. Finance contracts with no attestations
        `SELECT COUNT(*) as fc_no_att FROM finance_contracts fc WHERE NOT EXISTS (SELECT 1 FROM monthly_attestations ma WHERE ma.contract_id = fc.id)`,
        
        // 8. Attestations with no finance contract (orphans)
        `SELECT COUNT(*) as orphan_att FROM monthly_attestations WHERE contract_id NOT IN (SELECT id FROM finance_contracts)`,
        
        // 9. Missing indexes check
        `SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename`,
        
        // 10. Demands with overdue dates but not ENTREGUE
        `SELECT COUNT(*) as overdue FROM demands WHERE expected_delivery_date < NOW() AND status NOT IN ('ENTREGUE','CANCELADA','CONGELADA')`,
        
        // 11. Duplicate demand_number
        `SELECT demand_number, COUNT(*) FROM demands WHERE demand_number IS NOT NULL GROUP BY demand_number HAVING COUNT(*) > 1`,
        
        // 12. users with NULL passwords
        `SELECT COUNT(*) as null_passwords FROM users WHERE password IS NULL OR password = ''`,
    ];

    for (let i = 0; i < queries.length; i++) {
        try {
            const res = await client.query(queries[i]);
            console.log(`\n=== QUERY ${i+1} ===`);
            console.log(JSON.stringify(res.rows, null, 2));
        } catch(e) {
            console.log(`\n=== QUERY ${i+1} ERROR ===`);
            console.log(e.message);
        }
    }
    
    client.end();
}).catch(console.error);
