# ============================================================
# stop.ps1 — Para todos os serviços do GOR FluxoProd
# ============================================================

Write-Host ""
Write-Host "======================================" -ForegroundColor Red
Write-Host "   GOR FluxoProd — Encerrando...      " -ForegroundColor Red
Write-Host "======================================" -ForegroundColor Red
Write-Host ""

$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    Write-Host "🛑 Encerrando $($nodeProcs.Count) processo(s) node..." -ForegroundColor Yellow
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✅ Todos os processos encerrados." -ForegroundColor Green
} else {
    Write-Host "✅ Nenhum processo node em execução." -ForegroundColor Green
}

Write-Host ""
Write-Host "Sistema encerrado. Pressione qualquer tecla para fechar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
