param(
    [Parameter(Position = 0)]
    [ValidateSet("start", "stop", "restart", "status", "update")]
    [string]$Action = "status"
)

$ErrorActionPreference = "Stop"

# ============================================================
# Jason Chen Portfolio Server Manager
# ============================================================

$ProjectDir = "D:\projects\jason-portfolio"
$VenvPython = Join-Path $ProjectDir ".venv\Scripts\python.exe"

$OllamaModels = "D:\AI\ollama-models"

$FastApiPort = 8000
$NextPort = 3001
$OllamaPort = 11434

$LogDir = Join-Path $ProjectDir ".server-logs"

$FastApiOut = Join-Path $LogDir "fastapi.out.log"
$FastApiErr = Join-Path $LogDir "fastapi.err.log"

$NextOut = Join-Path $LogDir "next.out.log"
$NextErr = Join-Path $LogDir "next.err.log"

$OllamaOut = Join-Path $LogDir "ollama.out.log"
$OllamaErr = Join-Path $LogDir "ollama.err.log"


# ============================================================
# Helpers
# ============================================================

function Write-Section {
    param([string]$Text)

    Write-Host ""
    Write-Host "============================================================"
    Write-Host $Text
    Write-Host "============================================================"
}


function Test-Port {
    param([int]$Port)

    try {
        $connection = Get-NetTCPConnection `
            -State Listen `
            -LocalPort $Port `
            -ErrorAction SilentlyContinue

        return ($null -ne $connection)
    }
    catch {
        return $false
    }
}


function Wait-ForPort {
    param(
        [int]$Port,
        [int]$TimeoutSeconds = 30
    )

    for ($i = 0; $i -lt $TimeoutSeconds; $i++) {

        if (Test-Port $Port) {
            return $true
        }

        Start-Sleep -Seconds 1
    }

    return $false
}


function Stop-PortProcess {
    param([int]$Port)

    $connections = Get-NetTCPConnection `
        -State Listen `
        -LocalPort $Port `
        -ErrorAction SilentlyContinue

    foreach ($connection in $connections) {

        $processId = $connection.OwningProcess

        if ($processId -and $processId -ne 0) {

            Write-Host "Stopping PID $processId on port $Port..."

            Stop-Process `
                -Id $processId `
                -Force `
                -ErrorAction SilentlyContinue
        }
    }
}


function Test-Http {
    param([string]$Url)

    try {

        $response = Invoke-WebRequest `
            -Uri $Url `
            -UseBasicParsing `
            -TimeoutSec 5

        return (
            $response.StatusCode -ge 200 -and
            $response.StatusCode -lt 400
        )
    }
    catch {
        return $false
    }
}


function Ensure-LogDirectory {

    if (-not (Test-Path $LogDir)) {

        New-Item `
            -ItemType Directory `
            -Path $LogDir `
            -Force | Out-Null
    }
}


# ============================================================
# Start Ollama
# ============================================================

function Start-Ollama {

    Write-Section "Starting Ollama"

    if (Test-Port $OllamaPort) {

        Write-Host "Ollama is already running on port $OllamaPort."
        return
    }

    Ensure-LogDirectory

    $env:OLLAMA_MODELS = $OllamaModels

    Start-Process `
        -FilePath "ollama" `
        -ArgumentList "serve" `
        -WorkingDirectory $ProjectDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $OllamaOut `
        -RedirectStandardError $OllamaErr

    Write-Host "Waiting for Ollama..."

    if (Wait-ForPort $OllamaPort 30) {

        Write-Host "Ollama started successfully."

    }
    else {

        throw "Ollama failed to start. Check $OllamaErr"
    }
}


# ============================================================
# Start FastAPI
# ============================================================

function Start-FastAPI {

    Write-Section "Starting FastAPI"

    if (Test-Port $FastApiPort) {

        Write-Host "FastAPI is already running on port $FastApiPort."
        return
    }

    Ensure-LogDirectory

    if (-not (Test-Path $VenvPython)) {

        throw "Python virtual environment was not found: $VenvPython"
    }

    Start-Process `
        -FilePath $VenvPython `
        -ArgumentList @(
        "-m",
        "uvicorn",
        "backend.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "$FastApiPort"
    ) `
        -WorkingDirectory $ProjectDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $FastApiOut `
        -RedirectStandardError $FastApiErr

    Write-Host "Waiting for FastAPI..."

    if (Wait-ForPort $FastApiPort 30) {

        Write-Host "FastAPI started successfully."

    }
    else {

        throw "FastAPI failed to start. Check $FastApiErr"
    }
}


# ============================================================
# Start Next.js Production
# ============================================================

function Start-NextJS {

    Write-Section "Starting Next.js Production"

    if (Test-Port $NextPort) {

        Write-Host "Next.js is already running on port $NextPort."
        return
    }

    Ensure-LogDirectory

    $BuildDir = Join-Path $ProjectDir ".next"

    if (-not (Test-Path $BuildDir)) {

        Write-Host "Production build not found."
        Write-Host "Running npm run build..."

        Push-Location $ProjectDir

        try {

            npm run build

            if ($LASTEXITCODE -ne 0) {

                throw "npm run build failed."
            }

        }
        finally {

            Pop-Location
        }
    }

    Start-Process `
        -FilePath "npm.cmd" `
        -ArgumentList @(
        "start",
        "--",
        "-p",
        "$NextPort",
        "-H",
        "127.0.0.1"
    ) `
        -WorkingDirectory $ProjectDir `
        -WindowStyle Hidden `
        -RedirectStandardOutput $NextOut `
        -RedirectStandardError $NextErr

    Write-Host "Waiting for Next.js..."

    if (Wait-ForPort $NextPort 45) {

        Write-Host "Next.js started successfully."

    }
    else {

        throw "Next.js failed to start. Check $NextErr"
    }
}


# ============================================================
# Start Tailscale Funnel
# ============================================================

function Start-Funnel {

    Write-Section "Starting Tailscale Funnel"

    try {

        tailscale funnel --bg $NextPort

        if ($LASTEXITCODE -ne 0) {

            throw "Tailscale Funnel command failed."
        }

        Write-Host "Tailscale Funnel configured."

    }
    catch {

        Write-Warning "Unable to start Tailscale Funnel automatically."
        Write-Warning $_
    }
}


# ============================================================
# Health / Status
# ============================================================

function Show-Health {

    Write-Section "Portfolio Server Status"

    $ollamaRunning = Test-Port $OllamaPort
    $fastApiRunning = Test-Port $FastApiPort
    $nextRunning = Test-Port $NextPort

    Write-Host (
        "Ollama   : " +
        $(if ($ollamaRunning) { "RUNNING" } else { "STOPPED" })
    )

    Write-Host (
        "FastAPI  : " +
        $(if ($fastApiRunning) { "RUNNING" } else { "STOPPED" })
    )

    Write-Host (
        "Next.js  : " +
        $(if ($nextRunning) { "RUNNING" } else { "STOPPED" })
    )

    Write-Host ""

    if ($fastApiRunning) {

        if (
            Test-Http "http://127.0.0.1:$FastApiPort/health"
        ) {

            Write-Host "FastAPI health check : OK"

        }
        else {

            Write-Host "FastAPI health check : FAILED"
        }
    }

    if ($nextRunning) {

        if (
            Test-Http "http://127.0.0.1:$NextPort"
        ) {

            Write-Host "Next.js health check : OK"

        }
        else {

            Write-Host "Next.js health check : FAILED"
        }
    }

    Write-Host ""

    try {

        Write-Host "Tailscale Funnel:"
        tailscale funnel status

    }
    catch {

        Write-Host "Unable to read Funnel status."
    }
}


# ============================================================
# Start Everything
# ============================================================

function Start-Portfolio {

    Write-Section "Starting Jason Chen Portfolio"

    Ensure-LogDirectory

    Start-Ollama
    Start-FastAPI
    Start-NextJS
    Start-Funnel

    Start-Sleep -Seconds 2

    Show-Health

    Write-Host ""
    Write-Host "Portfolio startup completed."
}


# ============================================================
# Stop Everything
# ============================================================

function Stop-Portfolio {

    Write-Section "Stopping Jason Chen Portfolio"

    Write-Host "Turning off Tailscale Funnel..."

    try {

        tailscale funnel reset

    }
    catch {

        Write-Warning "Could not reset Tailscale Funnel."
    }

    Write-Host ""

    if (Test-Port $NextPort) {

        Stop-PortProcess $NextPort
    }

    if (Test-Port $FastApiPort) {

        Stop-PortProcess $FastApiPort
    }

    if (Test-Port $OllamaPort) {

        Stop-PortProcess $OllamaPort
    }

    Start-Sleep -Seconds 2

    Write-Host ""
    Write-Host "Portfolio services stopped."

    Show-Health
}


# ============================================================
# Update / Deploy Latest GitHub Version
# ============================================================

function Update-Portfolio {

    Write-Section "Updating Jason Chen Portfolio"

    Set-Location $ProjectDir

    # --------------------------------------------------------
    # 1. Protect production from local server-side edits
    # --------------------------------------------------------

    Write-Host "Checking Git status..."

    $gitChanges = git status --porcelain

    if ($gitChanges) {

        Write-Host ""
        Write-Warning "Server repository contains local changes."
        Write-Host ""

        git status

        Write-Host ""

        throw "Update cancelled. Commit, restore, or remove the server-side changes first."
    }

    # --------------------------------------------------------
    # 2. Fetch latest GitHub version
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Fetching latest version from GitHub..."

    git fetch origin main

    if ($LASTEXITCODE -ne 0) {

        throw "git fetch failed."
    }

    $localCommit = git rev-parse HEAD
    $remoteCommit = git rev-parse origin/main

    if ($LASTEXITCODE -ne 0) {

        throw "Unable to compare Git revisions."
    }

    # --------------------------------------------------------
    # 3. Nothing new
    # --------------------------------------------------------

    if ($localCommit -eq $remoteCommit) {

        Write-Host ""
        Write-Host "Server is already up to date."
        Write-Host ""

        Show-Health

        return
    }

    # --------------------------------------------------------
    # 4. Pull latest code
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "New version found."
    Write-Host "Pulling latest changes..."

    git pull --ff-only origin main

    if ($LASTEXITCODE -ne 0) {

        throw "git pull failed."
    }

    # --------------------------------------------------------
    # 5. Install exact Node dependencies
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Installing Node.js dependencies..."

    npm ci

    if ($LASTEXITCODE -ne 0) {

        throw "npm ci failed."
    }

    # --------------------------------------------------------
    # 6. Production build
    #
    # IMPORTANT:
    # We build BEFORE stopping the existing production server.
    # If build fails, the current public website stays online.
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Building Next.js production application..."

    npm run build

    if ($LASTEXITCODE -ne 0) {

        throw "Production build failed. Existing production services were not restarted."
    }

    # --------------------------------------------------------
    # 7. Restart production
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "Build successful."
    Write-Host "Restarting portfolio services..."

    Stop-Portfolio

    Start-Sleep -Seconds 2

    Start-Portfolio

    # --------------------------------------------------------
    # 8. Final deployment information
    # --------------------------------------------------------

    Write-Section "Deployment Complete"

    Write-Host "Latest GitHub version deployed successfully."
    Write-Host ""

    Write-Host "Current version:"
    git log -1 --oneline

    Write-Host ""

    Write-Host "Public portfolio:"
    Write-Host "https://jasonchen-portfolio.tail355344.ts.net/"
}


# ============================================================
# Main
# ============================================================

Set-Location $ProjectDir

switch ($Action) {

    "start" {

        Start-Portfolio
    }

    "stop" {

        Stop-Portfolio
    }

    "restart" {

        Stop-Portfolio

        Start-Sleep -Seconds 2

        Start-Portfolio
    }

    "status" {

        Show-Health
    }

    "update" {

        Update-Portfolio
    }
}