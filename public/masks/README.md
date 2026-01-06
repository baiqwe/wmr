# Gemini Watermark Mask Files

This directory should contain the Alpha Mask files used by the Inverse Alpha Blending algorithm.

## Required Files

| File | Purpose | Source |
|------|---------|--------|
| `gemini_mask_48.png` | For images ≤ 1024x1024 | Extract from Gemini-generated 1024x1024 image |
| `gemini_mask_96.png` | For images > 1024x1024 | Extract from Gemini-generated 2048x2048 image |

## How to Create Mask Files

1. Generate a **solid black image** using Google Gemini (e.g., "Generate a completely black image")
2. Download at 1024x1024 resolution → Crop the bottom-right logo area (48x48) → Save as `gemini_mask_48.png`
3. Download at 2048x2048 resolution → Crop the bottom-right logo area (96x96) → Save as `gemini_mask_96.png`

The mask should be **white-on-black**: the Gemini logo in white, background in black.

## Technical Details

- **Small mask (48px)**: Used when `width <= 1024 || height <= 1024`
  - Logo position: 32px margin from bottom-right
- **Large mask (96px)**: Used when `width > 1024 && height > 1024`
  - Logo position: 64px margin from bottom-right

## Important

Without these mask files, the watermark removal feature will fail with error:
"系统缺少水印蒙版文件。请联系管理员。"
