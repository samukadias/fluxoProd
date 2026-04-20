const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/fluxo_prod' });
client.connect().then(() => {
    return client.query(`SELECT d.*, COALESCE((SELECT text FROM demand_annotations da WHERE da.demand_id = d.id ORDER BY created_at DESC LIMIT 1), d.observation) as observation, CASE WHEN EXISTS (SELECT 1 FROM demand_annotations da WHERE da.demand_id = d.id) THEN false ELSE true END as is_legacy_observation FROM demands d WHERE demand_number = 'OPTY2718'`);
}).then(res => {
    console.log(JSON.stringify(res.rows[0].observation));
    client.end();
}).catch(console.error);
