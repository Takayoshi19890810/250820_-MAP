# 依存ファイルをダウンロード（Leaflet, JSZip, togeojson）
$ErrorActionPreference = "Stop"
$deps = @{
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" = "leaflet.js";
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" = "leaflet.css";
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" = "images/marker-icon.png";
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png" = "images/marker-icon-2x.png";
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png" = "images/marker-shadow.png";
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" = "jszip.min.js";
  "https://unpkg.com/@tmcw/togeojson@5.7.0/dist/togeojson.umd.js" = "togeojson.umd.js";
}

# 画像フォルダ
$imgDir = "images"
if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

foreach ($Url in $deps.Keys) {
  $OutPath = $deps[$Url]
  Write-Host "Downloading $Url -> $OutPath"
  Invoke-WebRequest -Uri $Url -OutFile $OutPath -UseBasicParsing
}
Write-Host "Done."
