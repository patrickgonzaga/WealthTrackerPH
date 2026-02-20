Add-Type -AssemblyName System.Drawing

$sizes = @{
    'mdpi' = 48
    'hdpi' = 72
    'xhdpi' = 96
    'xxhdpi' = 144
    'xxxhdpi' = 192
}

foreach ($name in $sizes.Keys) {
    $size = [int]$sizes[$name]
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = "AntiAlias"
    $graphics.TextRenderingHint = "AntiAlias"
    
    # Black background
    $graphics.FillRectangle([System.Drawing.Brushes]::Black, 0, 0, $size, $size)
    
    # Gold Peso sign using Unicode - try multiple approaches
    $fontSize = [int]($size * 0.6)
    
    # Try different fonts that support Peso symbol
    $fonts = @("Segoe UI Symbol", "Arial Unicode MS", "Calibri", "Arial", "Microsoft Sans Serif")
    $pesoSymbol = "₱"
    $success = $false
    
    foreach ($fontName in $fonts) {
        try {
            $font = New-Object System.Drawing.Font($fontName, $fontSize, [System.Drawing.FontStyle]::Bold)
            $goldBrush = [System.Drawing.Brushes]::Gold
            
            # Test if we can measure the string (font supports the character)
            $textSize = $graphics.MeasureString($pesoSymbol, $font)
            if ($textSize.Width -gt 0) {
                $x = ($size - $textSize.Width) / 2
                $y = ($size - $textSize.Height) / 2
                $graphics.DrawString($pesoSymbol, $font, $goldBrush, $x, $y)
                $success = $true
                $font.Dispose()
                break
            }
            $font.Dispose()
        } catch {
            continue
        }
    }
    
    # If text approach fails, create a custom Peso symbol with graphics
    if (-not $success) {
        $penWidth = $size * 0.06
        $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 215, 0), $penWidth)
        
        # Draw custom Peso symbol
        $centerX = $size / 2
        $centerY = $size / 2
        $symbolSize = $size * 0.35
        
        # P shape
        $pLeft = $centerX - $symbolSize * 0.3
        $pRight = $centerX + $symbolSize * 0.3
        $pTop = $centerY - $symbolSize * 0.5
        $pMiddle = $centerY
        $pBottom = $centerY + $symbolSize * 0.5
        
        # Vertical line
        $graphics.DrawLine($goldPen, $pLeft, $pTop, $pLeft, $pBottom)
        # Top horizontal
        $graphics.DrawLine($goldPen, $pLeft, $pTop, $pRight, $pTop)
        # Middle horizontal
        $graphics.DrawLine($goldPen, $pLeft, $pMiddle, $pRight * 0.8, $pMiddle)
        # Right vertical
        $graphics.DrawLine($goldPen, $pRight, $pTop, $pRight, $pMiddle)
        
        # Add double horizontal lines (Peso characteristic)
        $doubleOffset = $penWidth * 1.5
        $graphics.DrawLine($goldPen, $pLeft - $doubleOffset, $pMiddle, $pRight * 0.8 - $doubleOffset, $pMiddle)
        
        $goldPen.Dispose()
    }
    
    $outputPath = "android/app/src/main/res/mipmap-$name/ic_launcher.png"
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Generated $outputPath (${size}x$size) - Method used: $(if ($success) { 'Text' } else { 'Graphics' })"
    
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Host "Icon generation complete!"
