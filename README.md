# Colora

One-click HDR merge web app for real-estate bracket photos.

Upload low, middle, and high exposure photos. The app automatically groups sets, aligns frames, merges them with OpenCV exposure fusion, protects window highlights, brightens interiors naturally, and returns a ZIP of finished JPG files.

## Run Locally

```bash
pip install -r requirements.txt
python server.py
```

Open:

```text
http://127.0.0.1:4174
```

## Deploy

This app needs a Python backend. GitHub Pages alone cannot run it.

Recommended free/low-cost hosts:

- Render Web Service
- Railway
- Fly.io
- VPS with Python

Start command:

```bash
gunicorn server:app --bind 0.0.0.0:$PORT
```

## Notes

- Best input order is low, middle, high for every bracket set.
- If file names contain `low`, `mid`/`middle`, and `high`, the app groups automatically.
- Large batches need enough server memory and request upload size.
