# ============================================================
# start.ps1  Inicialização limpa do GOR FluxoProd
# Mata processos node órfãos, limpa PM2, e reinicia o sistema
# ============================================================

$ROOT = $PSScriptRoot
$SERVER = Join-Path $ROOT "server"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   GOR FluxoProd  Iniciando sistema  " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Parar todos os processos PM2
Write-Host "  [1/5] Parando processos PM2..." -ForegroundColor Yellow
pm2 delete all 2>$null
Start-Sleep -Seconds 1
Write-Host "        PM2 limpo." -ForegroundColor Green

# 2. Matar qualquer processo node órfão (exceto o PM2 daemon)
$pm2DaemonPid = $null
try {
    $pm2Home = Join-Path $env:USERPROFILE ".pm2"
    $pidFile = Join-Path $pm2Home "pm2.pid"
    if (Test-Path $pidFile) {
        $pm2DaemonPid = [int](Get-Content $pidFile -ErrorAction SilentlyContinue)
    }
} catch {}

$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    $orphans = $nodeProcs | Where-Object { $_.Id -ne $pm2DaemonPid }
    if ($orphans) {
        Write-Host "  [2/5] Encerrando $($orphans.Count) processo(s) node orfao(s)..." -ForegroundColor Yellow
        $orphans | ForEach-Object {
            Write-Host "        PID $($_.Id) encerrado." -ForegroundColor Gray
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
        Write-Host "        Processos orfaos encerrados." -ForegroundColor Green
    } else {
        Write-Host "  [2/5] Nenhum processo node orfao encontrado." -ForegroundColor Green
    }
} else {
    Write-Host "  [2/5] Nenhum processo node em execucao." -ForegroundColor Green
}

# 3. Verificar se a porta 3000 está livre
Write-Host "  [3/5] Verificando porta 3000..." -ForegroundColor Yellow
$retries = 0
while ($retries -lt 5) {
    $port3000 = netstat -ano 2>$null | Select-String ":3000.*LISTENING"
    if (-not $port3000) {
        Write-Host "        Porta 3000 livre." -ForegroundColor Green
        break
    }
    Write-Host "        Porta 3000 ainda em uso. Aguardando... ($($retries+1)/5)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $retries++
}

if ($retries -ge 5) {
    Write-Host "        AVISO: Porta 3000 ainda ocupada. Tentando forcar..." -ForegroundColor Red
    $listening = netstat -ano 2>$null | Select-String ":3000.*LISTENING"
    if ($listening) {
        $pid = ($listening.ToString().Trim() -split '\s+')[-1]
        if ($pid -and $pid -ne "0") {
            taskkill /F /PID $pid 2>$null
            Start-Sleep -Seconds 2
        }
    }
}

# 4. Subir backend via PM2
Write-Host "  [4/5] Subindo servidor backend (PM2 - porta 3000)..." -ForegroundColor Cyan
Push-Location $SERVER
pm2 start index.js --name fluxo-backend
Pop-Location
Start-Sleep -Seconds 3

# Confirmar que o backend está rodando
$backendCheck = netstat -ano 2>$null | Select-String ":3000.*LISTENING"
if ($backendCheck) {
    Write-Host "        Backend rodando na porta 3000." -ForegroundColor Green
} else {
    Write-Host "        ERRO: Backend nao iniciou. Verifique: pm2 logs fluxo-backend" -ForegroundColor Red
}

# 5. Subir frontend (Vite dev server)
Write-Host "  [5/5] Subindo frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "    Sistema iniciado com sucesso!     " -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3000     " -ForegroundColor Green
Write-Host "   Frontend: http://localhost:80       " -ForegroundColor Green
Write-Host "   PM2:      pm2 logs fluxo-backend    " -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Gray
$null = [Console]::ReadKey($true)
