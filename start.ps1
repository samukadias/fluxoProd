# ============================================================
# start.ps1  Inicialização limpa do GOR FluxoProd
# Mata processos node antigos antes de subir o sistema
# ============================================================

$ROOT = $PSScriptRoot
$SERVER = Join-Path $ROOT "server"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   GOR FluxoProd  Iniciando sistema  " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Encerrar qualquer processo node em execução
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    Write-Host "  Encerrando $($nodeProcs.Count) processo(s) node anteriores..." -ForegroundColor Yellow
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  Processos anteriores encerrados." -ForegroundColor Green
} else {
    Write-Host "  Nenhum processo node em execução." -ForegroundColor Green
}

# 2. Verificar se a porta 3000 está livre
$port3000 = netstat -ano 2>$null | Select-String ":3000.*LISTENING"
if ($port3000) {
    Write-Host "  Porta 3000 ainda em uso. Aguardando..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host " Subindo servidor backend (porta 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ''$SERVER''; node index.js" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host " Subindo frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ''$ROOT''; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "    Sistema iniciado com sucesso!   " -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3000    " -ForegroundColor Green
Write-Host "   Frontend: http://localhost:80      " -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Gray
$null = [Console]::ReadKey($true)
