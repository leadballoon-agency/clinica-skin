#!/bin/bash

# ND Skin Clinic Image Download Script
echo "Downloading ND Skin Clinic branding assets..."

# Create backup of original images
mkdir -p public/images/original-backup
cp public/images/* public/images/original-backup/ 2>/dev/null

# Download logo
echo "Downloading logo..."
curl -o public/images/logo.png "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/logo-nd-.png"
cp public/images/logo.png public/images/footer.png

# Download CO2 treatment image
echo "Downloading CO2 treatment image..."
curl -o public/images/co2-treatment.png "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/co2-resurfacing-1-2-500x397.png"

# Download staff photos
echo "Downloading staff photos..."
curl -o public/images/natalia.jpg "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/6bd8ada6-f20b-4b2e-a2c9-c4b63af2ef0c-500x500.jpg"
curl -o public/images/lilia.jpg "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/2e736647-4754-4137-a7af-dde558f7e8c4-500x500.jpg"
curl -o public/images/yulia.jpg "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/2f60a3c7-44d0-4c74-a156-66f190ad3551-500x500.jpg"

# Download other treatment images for variety
echo "Downloading additional treatment images..."
curl -o public/images/ipl-treatment.png "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/ipl-facials-1-500x397.png"
curl -o public/images/rf-microneedling.png "https://ndskinclinic.co.uk/wp-content/uploads/2025/03/RF-micro-needling-1-500x397.png"

echo "✅ Download complete!"
echo "📁 Original images backed up to public/images/original-backup/"
echo "🖼️  New ND Skin Clinic assets downloaded to public/images/"
echo ""
echo "Next steps:"
echo "1. Update home1.jpg and home2.jpg with appropriate hero images"
echo "2. Replace beforeafter*.jpg with actual ND Skin Clinic before/after photos"
echo "3. Update treatment.jpg with CO2-specific imagery"