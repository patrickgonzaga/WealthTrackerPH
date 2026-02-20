import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';

void main() async {
  // Read the SVG file
  final svgString = await File('icon.svg').readAsString();
  
  // Generate different sizes
  final sizes = [
    {'name': 'mdpi', 'size': 48},
    {'name': 'hdpi', 'size': 72},
    {'name': 'xhdpi', 'size': 96},
    {'name': 'xxhdpi', 'size': 144},
    {'name': 'xxxhdpi', 'size': 192},
  ];
  
  for (final sizeInfo in sizes) {
    final size = sizeInfo['size'] as int;
    final name = sizeInfo['name'] as String;
    
    // Create picture from SVG
    final DrawableRoot svgRoot = await svg.fromSvgString(svgString, svgString);
    
    // Create canvas
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    
    // Draw SVG to canvas
    svgRoot.draw(canvas, Rect.fromLTWH(0, 0, size.toDouble(), size.toDouble()));
    
    // Convert to image
    final picture = recorder.endRecording();
    final image = await picture.toImage(size, size);
    
    // Convert to PNG bytes
    final pngBytes = await image.toByteData(format: ui.ImageByteFormat.png);
    
    // Save to file
    final outputPath = 'android/app/src/main/res/mipmap-$name/ic_launcher.png';
    await File(outputPath).writeAsBytes(pngBytes!.buffer.asUint8List());
    
    print('Generated $outputPath (${size}x$size)');
  }
  
  print('Icon generation complete!');
}
