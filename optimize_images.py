from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import shutil

def optimize_image(input_path, output_path, quality=85, max_size=1920):
    """Optimize image with high quality compression and resizing"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if saving as JPEG
            if img.mode in ('RGBA', 'LA', 'P') and output_path.suffix.lower() in ['.jpg', '.jpeg']:
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if image is too large
            if max(img.size) > max_size:
                ratio = max_size / max(img.size)
                new_size = tuple(int(dim * ratio) for dim in img.size)
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Enhance image quality (only for RGB/RGBA images)
            if img.mode in ('RGB', 'RGBA', 'L'):
                # Slight sharpening for better clarity
                img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=3))
                
                # Enhance contrast slightly
                enhancer = ImageEnhance.Contrast(img)
                img = enhancer.enhance(1.05)
                
                # Enhance color slightly (only for color images)
                if img.mode in ('RGB', 'RGBA'):
                    color_enhancer = ImageEnhance.Color(img)
                    img = color_enhancer.enhance(1.1)
            
            # Save with optimization
            if output_path.suffix.lower() in ['.jpg', '.jpeg']:
                img.save(output_path, 'JPEG', quality=quality, optimize=True)
            elif output_path.suffix.lower() == '.png':
                img.save(output_path, 'PNG', optimize=True)
            else:
                img.save(output_path, optimize=True)
            
            return True
    except Exception as e:
        print(f"Error: {input_path.name}: {e}")
        return False

# Source and destination
source_folder = Path('portoflio')
dest_folder = Path('portoflio_optimized')

# Create destination
dest_folder.mkdir(exist_ok=True)

# Process all images
total_before = 0
total_after = 0
count = 0

for img_path in source_folder.glob('*'):
    if img_path.is_file() and img_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']:
        dest_path = dest_folder / img_path.name
        
        original_size = img_path.stat().st_size
        total_before += original_size
        
        if optimize_image(img_path, dest_path):
            new_size = dest_path.stat().st_size
            total_after += new_size
            reduction = ((original_size - new_size) / original_size * 100) if original_size > 0 else 0
            print(f"✓ {img_path.name} ({original_size//1024}KB → {new_size//1024}KB, {reduction:.1f}%)")
            count += 1

print(f"\n{'='*60}")
print(f"Optimized: {count} images")
print(f"Size: {total_before/1024/1024:.2f} MB → {total_after/1024/1024:.2f} MB")
print(f"Reduction: {((total_before - total_after)/total_before*100):.1f}%")
print(f"{'='*60}")
