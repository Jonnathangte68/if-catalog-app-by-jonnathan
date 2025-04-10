Write-Host "Restoring and Building Backend..."
dotnet restore "./backend/ProductCatalog.Api/ProductCatalog.Api.csproj"
dotnet build "./backend/ProductCatalog.Api/ProductCatalog.Api.csproj" --no-restore
Write-Host "Starting Backend API..."
$backendProcess  = Start-Process "dotnet" -ArgumentList "run --project ./backend/ProductCatalog.Api" -PassThru
Write-Host "Starting Frontend App..."
$frontendProcess = Start-Process "npm" -ArgumentList "run dev" -WorkingDirectory "./frontend" -PassThru
Write-Host "Backend and Frontend are running."
Write-Host "Press ENTER to stop both servers."
[Console]::ReadLine() | Out-Null
Write-Host "Stopping Backend and Frontend..."
Stop-Process -Id $backendProcess.Id, $frontendProcess.Id
Write-Host "Both services stopped."