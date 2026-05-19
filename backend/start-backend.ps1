$ErrorActionPreference = "Stop"

$rootVenvPath = "..\.venv"
if (!(Test-Path $rootVenvPath)) {
  Write-Host "Creating virtual environment at repo root..."
  C:/Users/naman/AppData/Local/Programs/Python/Python312/python.exe -m venv $rootVenvPath
}

Write-Host "Activating virtual environment..."
. "$rootVenvPath\Scripts\Activate.ps1"

Write-Host "Installing dependencies..."
python -m pip install -r requirements.txt

Write-Host "Loading .env into process..."
Get-Content .env | ForEach-Object {
  if ($_ -match '^([A-Z0-9_]+)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
  }
}

Write-Host "Starting FastAPI (uvicorn)..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
