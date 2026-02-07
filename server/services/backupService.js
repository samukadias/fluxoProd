const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const PG_DUMP_PATH = '"C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"';
const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_NAME = 'fluxo_prod';
const DB_USER = 'postgres';
const DB_HOST = '127.0.0.1';
const MAX_BACKUPS = 21; // 3 backups per day * 7 days

// ... (rest of configuration code if any)

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const createBackup = () => {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    const command = `${PG_DUMP_PATH} -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -f "${filepath}"`;

    console.log(`[Backup] Starting backup: ${filename}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Backup] Error: ${error.message}`);
            return;
        }
        if (stderr) {
            // pg_dump writes to stderr for info/warnings sometimes, but if exit code is 0 it's fine.
            // We just log it as debug info.
            console.log(`[Backup] Info: ${stderr}`);
        }
        console.log(`[Backup] Success: ${filepath}`);
        cleanOldBackups();
    });
};

const cleanOldBackups = () => {
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) {
            console.error('[Backup] Error reading backup directory:', err);
            return;
        }

        const sqlFiles = files
            .filter(file => file.endsWith('.sql'))
            .map(file => {
                const filePath = path.join(BACKUP_DIR, file);
                const stats = fs.statSync(filePath);
                return { file, filePath, mtime: stats.mtime };
            })
            .sort((a, b) => b.mtime - a.mtime); // Newest first

        if (sqlFiles.length > MAX_BACKUPS) {
            const filesToDelete = sqlFiles.slice(MAX_BACKUPS);
            filesToDelete.forEach(backup => {
                fs.unlink(backup.filePath, (err) => {
                    if (err) console.error(`[Backup] Error deleting old backup ${backup.file}:`, err);
                    else console.log(`[Backup] Deleted old backup: ${backup.file}`);
                });
            });
        }
    });
};

const init = () => {
    console.log('[Backup] Service initialized. Schedule: 13:00, 18:00, 23:00 (Retention: 7 days)');

    // Schedule task to run at 13:00, 18:00, and 23:00 every day
    cron.schedule('0 13,18,23 * * *', () => {
        createBackup();
    });

    // Run one immediately on start for verification (Optional, but good for user confidence)
    // createBackup(); 
};

module.exports = { init, createBackup };
