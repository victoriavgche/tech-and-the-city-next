Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
git add -A
git commit -m "Fix publish/unpublish: Use gray-matter stringify, fix corrupted post, add full logging"
git push

