$previewProjectRoot = Split-Path -Parent $PSScriptRoot
Write-Host 'Preview: http://127.0.0.1:8766/preview/'
Write-Host 'Press Ctrl+C to stop. Original site files are unchanged.'
python -m http.server 8766 --bind 127.0.0.1 --directory $previewProjectRoot
