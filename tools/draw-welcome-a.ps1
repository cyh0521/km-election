Add-Type -AssemblyName System.Drawing
$outputPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'images/illustrations/political-mountain-a.png'
$bitmap = [System.Drawing.Bitmap]::new(1940, 600, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)
function Brush($hex) { [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
function Stroke($hex, $width) {
    $pen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($hex), [single]$width)
    $pen.StartCap = $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    return $pen
}
$sun = Brush '#E9B357'
$graphics.FillEllipse($sun, 1515, 12, 230, 230)
$sun.Dispose()

# The approved A design offsets the pastel planes from the two contour lines.
$backFill = [System.Drawing.Drawing2D.GraphicsPath]::new()
$backFill.AddBezier(258, 600, 470, 551, 663, 531, 850, 506)
$backFill.AddBezier(850, 506, 1005, 458, 1150, 371, 1315, 348)
$backFill.AddBezier(1315, 348, 1460, 383, 1665, 477, 1940, 503)
$backFill.AddLine(1940, 503, 1940, 600)
$backFill.CloseFigure()
$fill = Brush '#D0E8E1'
$graphics.FillPath($fill, $backFill)
$fill.Dispose()

$frontFill = [System.Drawing.Drawing2D.GraphicsPath]::new()
$frontFill.AddBezier(258, 600, 480, 554, 755, 469, 946, 474)
$frontFill.AddBezier(946, 474, 1100, 478, 1220, 558, 1390, 555)
$frontFill.AddBezier(1390, 555, 1610, 570, 1770, 527, 1940, 537)
$frontFill.AddLine(1940, 537, 1940, 600)
$frontFill.CloseFigure()
$fill = Brush '#BEDFD4'
$graphics.FillPath($fill, $frontFill)
$fill.Dispose()

$backLine = [System.Drawing.Drawing2D.GraphicsPath]::new()
$backLine.AddBezier(818, 403, 965, 350, 1040, 295, 1160, 330)
$backLine.AddBezier(1160, 330, 1230, 345, 1270, 354, 1310, 354)
$backLine.AddBezier(1310, 354, 1405, 329, 1475, 324, 1590, 360)
$backLine.AddBezier(1590, 360, 1725, 400, 1810, 420, 1940, 433)
$frontLine = [System.Drawing.Drawing2D.GraphicsPath]::new()
$frontLine.AddBezier(0, 600, 260, 594, 520, 407, 715, 418)
$frontLine.AddBezier(715, 418, 940, 424, 1145, 567, 1390, 555)
$frontLine.AddBezier(1390, 555, 1540, 551, 1630, 506, 1760, 521)
$frontLine.AddBezier(1760, 521, 1825, 525, 1880, 541, 1940, 557)
$ridgePen = Stroke '#176B6E' 6
$graphics.DrawPath($ridgePen, $backLine)
$graphics.DrawPath($ridgePen, $frontLine)
$ridgePen.Dispose()

# A narrow lattice mast, small platforms, and side dishes follow the real tower.
$towerPen = Stroke '#A47463' 5.5
$graphics.DrawLine($towerPen, 1310, 70, 1310, 129)
$graphics.DrawLine($towerPen, 1304, 108, 1316, 108)
$graphics.DrawRectangle($towerPen, 1292, 129, 36, 20)
$graphics.DrawLine($towerPen, 1295, 149, 1289, 331)
$graphics.DrawLine($towerPen, 1325, 149, 1331, 331)
$graphics.DrawLine($towerPen, 1294, 210, 1327, 210)
$graphics.DrawLine($towerPen, 1291, 270, 1329, 270)
$graphics.DrawLine($towerPen, 1289, 331, 1331, 331)
$graphics.DrawLine($towerPen, 1295, 149, 1327, 210)
$graphics.DrawLine($towerPen, 1325, 149, 1294, 210)
$graphics.DrawLine($towerPen, 1294, 210, 1329, 270)
$graphics.DrawLine($towerPen, 1327, 210, 1291, 270)
$graphics.DrawLine($towerPen, 1291, 270, 1331, 331)
$graphics.DrawLine($towerPen, 1329, 270, 1289, 331)
$dishFill = Brush '#F5F0E6'
foreach ($dish in @(@(1284, 177, 10), @(1281, 213, 12), @(1334, 263, 10))) {
    $cx = $dish[0]; $cy = $dish[1]; $radius = $dish[2]
    $graphics.DrawLine($towerPen, 1310, $cy, $cx, $cy)
    $graphics.FillEllipse($dishFill, ($cx - $radius), ($cy - $radius), (2 * $radius), (2 * $radius))
    $graphics.DrawEllipse($towerPen, ($cx - $radius), ($cy - $radius), (2 * $radius), (2 * $radius))
}
$dishFill.Dispose()
$baseFill = Brush '#EDE5D7'
$graphics.FillRectangle($baseFill, 1280, 331, 60, 23)
$baseFill.Dispose()
$towerPen.Dispose()

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$backFill.Dispose(); $backLine.Dispose(); $frontFill.Dispose(); $frontLine.Dispose()
$graphics.Dispose(); $bitmap.Dispose()
