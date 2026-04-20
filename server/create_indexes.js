const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/fluxo_prod' });

client.connect().then(async () => {
    console.log('Criando índices de performance...');
    
    const statements = [
        // P3: Índice principal para a correlated subquery de anotações
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_demand_annotations_demand_id 
         ON demand_annotations(demand_id, created_at DESC)`,
        
        // Índices complementares que também estão faltando
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_status_history_demand_id 
         ON status_history(demand_id)`,
         
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_stage_history_demand_id 
         ON stage_history(demand_id)`,
    ];
    
    for (const sql of statements) {
        try {
            await client.query(sql);
            const name = sql.match(/idx_\w+/)?.[0] || 'índice';
            console.log(`✅ ${name} criado com sucesso`);
        } catch (e) {
            console.log(`⚠️  Erro: ${e.message}`);
        }
    }
    
    client.end();
    console.log('Concluído.');
}).catch(console.error);
