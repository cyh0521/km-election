Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourceDir = Join-Path $root 'images/election-categories'
$outputDir = Join-Path $sourceDir 'palette-v1'
[System.IO.Directory]::CreateDirectory($outputDir) | Out-Null

# The red focus stays in one recognizable part of each original illustration.
$focus = @{
    'president' = @(96, 14, 157, 154)
    'assembly' = @(43, 65, 233, 145)
    'referendum' = @(121, 70, 243, 226)
    'legislator' = @(153, 146, 243, 235)
    'representative' = @(-1, -1, -1, -1)
    'village' = @(19, 89, 244, 151)
    'district' = @(-1, -1, -1, -1)
    'party-list' = @(-1, -1, -1, -1)
    'magistrate' = @(137, 91, 245, 233)
    'mayor' = @(20, 46, 140, 198)
    'council' = @(91, 46, 169, 158)
    'referendum-national' = @(101, 144, 239, 237)
    'referendum-local' = @(18, 78, 245, 153)
}
$goldGeometry = @('assembly', 'legislator', 'representative', 'mayor', 'district', 'referendum-national')

function Convert-HsvColor([double]$h, [double]$s, [double]$v, [int]$alpha) {
    $h = ($h % 360 + 360) % 360
    $s = [Math]::Max(0.0, [Math]::Min(1.0, $s))
    $v = [Math]::Max(0.0, [Math]::Min(1.0, $v))
    $chroma = $v * $s
    $x = $chroma * (1 - [Math]::Abs((($h / 60) % 2) - 1))
    $m = $v - $chroma
    $r = 0.0; $g = 0.0; $b = 0.0
    if ($h -lt 60) { $r = $chroma; $g = $x }
    elseif ($h -lt 120) { $r = $x; $g = $chroma }
    elseif ($h -lt 180) { $g = $chroma; $b = $x }
    elseif ($h -lt 240) { $g = $x; $b = $chroma }
    elseif ($h -lt 300) { $r = $x; $b = $chroma }
    else { $r = $chroma; $b = $x }
    return [System.Drawing.Color]::FromArgb(
        $alpha,
        [int][Math]::Round(($r + $m) * 255),
        [int][Math]::Round(($g + $m) * 255),
        [int][Math]::Round(($b + $m) * 255)
    )
}

foreach ($name in $focus.Keys) {
    $inputPath = Join-Path $sourceDir "$name.png"
    $outputPath = Join-Path $outputDir "$name.png"
    $source = [System.Drawing.Bitmap]::new($inputPath)
    $output = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $focusBox = $focus[$name]
    for ($y = 0; $y -lt $source.Height; $y++) {
        for ($x = 0; $x -lt $source.Width; $x++) {
            $c = $source.GetPixel($x, $y)
            if ($c.A -eq 0) { continue }
            $r = [double]$c.R; $g = [double]$c.G; $b = [double]$c.B
            $max = [Math]::Max($r, [Math]::Max($g, $b))
            $min = [Math]::Min($r, [Math]::Min($g, $b))
            $v = $max / 255
            $s = if ($max -eq 0) { 0 } else { ($max - $min) / $max }
            $new = $c
            $inFocus = $x -ge $focusBox[0] -and $x -le $focusBox[2] -and $y -ge $focusBox[1] -and $y -le $focusBox[3]

            # Pale rose geometry becomes alternating mint and warm cream.
            if ($r -gt $g + 10 -and $g -gt $b - 15 -and $v -gt 0.64 -and $s -lt 0.48) {
                if ($name -in $goldGeometry) {
                    $new = Convert-HsvColor 38 0.19 ([Math]::Min(0.98, $v * 1.06)) $c.A
                } else {
                    $new = Convert-HsvColor 155 0.15 ([Math]::Min(0.96, $v * 1.04)) $c.A
                }
            }
            # Existing orange and yellow details become a more consistent warm gold.
            elseif ($r -gt $g * 1.13 -and $g -gt $b * 1.35 -and $g -gt 45) {
                $new = Convert-HsvColor 36 ([Math]::Max(0.55, [Math]::Min(0.78, $s))) ([Math]::Min(0.88, $v * 1.02)) $c.A
            }
            # Existing dark red strokes keep their shape and anti-aliasing.
            elseif ($r -gt $g + 13 -and $r -gt $b + 12 -and $s -gt 0.26) {
                if ($inFocus) {
                    $new = Convert-HsvColor 2 ([Math]::Min(0.78, $s)) ([Math]::Min(0.66, $v * 1.11)) $c.A
                } else {
                    $new = Convert-HsvColor 183 ([Math]::Min(0.78, $s)) ([Math]::Min(0.66, $v * 0.82)) $c.A
                }
            }
            $output.SetPixel($x, $y, $new)
        }
    }
    $output.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $output.Dispose()
    $source.Dispose()
}
