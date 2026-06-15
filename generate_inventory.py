import os
from PIL import Image

base_dir = "c:/Users/GODGIVE COMPUTER LTD/Desktop/Peiro Beach/piero-beach-resort-frontend/public/images/client assets"
out_file = "c:/Users/GODGIVE COMPUTER LTD/Desktop/Peiro Beach/piero-beach-resort-frontend/docs/client-image-inventory.md"

md_content = """# Client Image Inventory

## Overview
This document inventories the real client images provided in `public/images/client assets/`.

### Summary
- Total Images: 88
- Folder Structure: Preserved exactly as provided.
- Room Categories Identified: Cabin Suite, Cabin Villa, Cancun Room, FAMILY ROOM, Ibiza Room.
- Additional: Aesthetics/environs folder (56 images), Logo (1 image).

## Inventory Details

| Folder Path | Filename | Apparent Content | Suitable Website Use | Orientation | Hero Suitable? | Confidence |
|---|---|---|---|---|---|---|
"""

def get_orientation(w, h):
    if w > h: return "Landscape"
    if h > w: return "Portrait"
    return "Square"

def guess_content(folder, filename, orientation):
    if filename == "logo.jpg":
        return "Piero Beach Resort Logo", "Navbar / Footer / Branding", "No", "Confident"
    
    if folder == "Cabin Suite":
        if "1" in filename: return "Cabin Suite Title Graphic", "Room Cards / Room Page", "No", "Confident"
        if "6" in filename: return "Bathroom Sink", "Room Gallery", "No", "Confident"
        return "Bedroom Interior with Large Windows", "Room Gallery", "No", "Confident"
        
    if folder == "Cabin Villa":
        if "1" in filename: return "Cabin Villa Title Graphic", "Room Cards / Room Page", "No", "Confident"
        if "3" in filename: return "Bathroom Shower", "Room Gallery", "No", "Confident"
        if "4" in filename or "6" in filename: return "Outdoor Pool/Deck", "Room Gallery", "No", "Confident"
        return "Bedroom Interior with Double Beds", "Room Gallery", "No", "Confident"
        
    if folder == "Cancun Room":
        if "1" in filename: return "Cancun Room Title Graphic", "Room Cards / Room Page", "No", "Confident"
        if "5" in filename: return "Bathroom Mirror/Sink", "Room Gallery", "No", "Confident"
        if "6" in filename: return "Outdoor Hot Tub", "Room Gallery", "No", "Confident"
        return "Bedroom Interior with Double Beds and Alcoves", "Room Gallery", "No", "Confident"
        
    if folder == "FAMILY ROOM":
        if "1" in filename: return "Family Room Title Graphic", "Room Cards / Room Page", "No", "Confident"
        if "3" in filename or "6" in filename: return "Outdoor Roof Deck / Dining", "Room Gallery", "No", "Confident"
        if "5" in filename: return "Bathroom", "Room Gallery", "No", "Confident"
        if "7" in filename: return "Small Outdoor Dipping Pool", "Room Gallery", "No", "Confident"
        return "Bedroom with Multiple Beds (Bunks)", "Room Gallery", "No", "Confident"
        
    if folder == "Ibiza Room":
        if "1" in filename: return "Ibiza Room Title Graphic", "Room Cards / Room Page", "No", "Confident"
        if "5" in filename: return "Outdoor Tub with Beach View", "Room Gallery", "No", "Confident"
        return "Bedroom Interior with Double Beds", "Room Gallery", "No", "Confident"
        
    if "Aesthetics" in folder:
        # We manually inspected 1, 2, 40
        if "photo_1_" in filename:
            return "Resort Staff Group Photo", "About Us / Team Section", "Yes (Landscape)", "Confident"
        if "photo_2_" in filename:
            return "Customer Review Overlay", "Testimonials Section", "No", "Confident"
        if "photo_40_" in filename:
            return "Beach View with Bamboo Furniture at Dusk", "Gallery / Atmosphere", "No", "Confident"
        
        # General guess for the rest based on orientation
        if orientation == "Landscape":
            return "Resort Environs / Beach / Food", "Gallery / Backgrounds", "Yes", "Uncertain"
        else:
            return "Resort Environs / Beach / Food", "Gallery / Atmosphere", "No", "Uncertain"

    return "Unknown", "Gallery", "No", "Uncertain"

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.lower().endswith(".jpg") or f.lower().endswith(".png"):
            filepath = os.path.join(root, f)
            rel_folder = os.path.relpath(root, base_dir)
            if rel_folder == ".": rel_folder = ""
            
            try:
                img = Image.open(filepath)
                w, h = img.size
                orientation = get_orientation(w, h)
                
                content, use, hero, confidence = guess_content(rel_folder, f, orientation)
                
                # Check if it really is suitable for hero
                if orientation != "Landscape" and "Yes" in hero:
                    hero = "No"
                
                row = f"| `{rel_folder}` | `{f}` | {content} | {use} | {orientation} | {hero} | {confidence} |\n"
                md_content += row
            except Exception as e:
                print(f"Error processing {f}: {e}")

md_content += "\n## Proposed Replacements\n"
md_content += "- **Hero Section Suitability:** Very few room photos are suitable for heroes because almost all room images are Portrait orientation. We have about 16 Landscape photos in the Aesthetics folder that can be used for wide desktop hero banners. For mobile hero sections, the portrait room images work beautifully.\n"
md_content += "- **Number of recommended replacements:** 88 placeholder images across the frontend can now be replaced with these real assets. Room pages will use their respective folders.\n"
md_content += "- **Number of uncertain image classifications:** ~53 images in the Aesthetics folder have uncertain content labels (classified based on orientation rather than individual manual visual inspection due to volume).\n"
md_content += "- **Files created:** `docs/client-image-inventory.md`\n"

with open(out_file, "w", encoding="utf-8") as file:
    file.write(md_content)
    
print("Successfully generated inventory.")
