const { execSync } = require('child_process');

try {
    const output = execSync('powershell "Get-CimInstance Win32_Process -Filter \\"Name = \'node.exe\'\\" | Select-Object ProcessId, CommandLine | ConvertTo-Json"').toString();
    console.log(output);
} catch (e) {
    console.error(e.message);
}
