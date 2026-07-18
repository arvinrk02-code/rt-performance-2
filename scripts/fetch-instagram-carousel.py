#!/usr/bin/env python3
"""
Download every image from one or more Instagram carousel posts via the
official Instagram Graph API, for use as Our Work gallery photos.

Setup (one-time):
  1. Your Instagram account must be a Business or Creator account, linked to
     a Facebook Page.
  2. Create a Meta developer app: https://developers.facebook.com/apps
  3. Generate a long-lived Page access token with the
     instagram_basic + pages_show_list permissions (Graph API Explorer, or
     the standard OAuth flow) for the Page linked to the IG account.
  4. Find your IG Business Account ID (Graph API Explorer:
     GET /me/accounts -> instagram_business_account).
  5. Set the two env vars below, or pass --token / --account-id.

Usage:
  export IG_ACCESS_TOKEN="EAAB..."
  export IG_ACCOUNT_ID="17841400..."

  # List recent carousel posts with their media IDs (to find what to pull)
  python3 fetch-instagram-carousel.py --list

  # Download every image in one carousel post to a folder
  python3 fetch-instagram-carousel.py --media-id 1789XXXXXXXXXXXXX --out public/work/mclaren-570s

  # Download several posts at once, one subfolder per post
  python3 fetch-instagram-carousel.py --media-id 111 222 333 --out public/work

Output: numbered .jpg files (01.jpg, 02.jpg, ...) in the destination folder,
in the same order they appear in the carousel. Prints the list of saved
paths as JSON at the end so it's easy to pipe into another step.
"""

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

GRAPH_URL = "https://graph.facebook.com/v21.0"


def api_get(path: str, token: str, **params) -> dict:
    params["access_token"] = token
    qs = "&".join(f"{k}={urllib.parse.quote(str(v))}" for k, v in params.items())
    url = f"{GRAPH_URL}/{path}?{qs}"
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read().decode())


def list_recent_media(account_id: str, token: str, limit: int = 25) -> None:
    data = api_get(
        f"{account_id}/media",
        token,
        fields="id,caption,media_type,timestamp,permalink",
        limit=limit,
    )
    for item in data.get("data", []):
        caption = (item.get("caption") or "").replace("\n", " ")[:60]
        print(f"{item['id']}  {item.get('media_type'):12}  {item.get('timestamp')}  {caption}")


def carousel_image_urls(media_id: str, token: str) -> list[str]:
    """Return every image URL in a carousel, in display order.
    Falls back to a single URL if the post isn't a carousel."""
    item = api_get(media_id, token, fields="media_type,media_url,children{media_type,media_url}")

    if item.get("media_type") == "CAROUSEL_ALBUM":
        children = item.get("children", {}).get("data", [])
        return [
            c["media_url"]
            for c in children
            if c.get("media_type") in ("IMAGE", "CAROUSEL_ALBUM")
        ]

    if item.get("media_type") == "IMAGE":
        return [item["media_url"]]

    return []  # VIDEO or unsupported type — skip


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp, open(dest, "wb") as f:
        f.write(resp.read())


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--token", default=os.environ.get("IG_ACCESS_TOKEN"), help="Graph API access token")
    p.add_argument("--account-id", default=os.environ.get("IG_ACCOUNT_ID"), help="IG Business Account ID (for --list)")
    p.add_argument("--media-id", nargs="+", help="One or more IG media (post) IDs to download")
    p.add_argument("--out", default="public/work", help="Output dir. One post -> that dir; several posts -> a subfolder per post ID")
    p.add_argument("--list", action="store_true", help="List recent posts with their media IDs, then exit")
    p.add_argument("--limit", type=int, default=25, help="How many recent posts to list")
    args = p.parse_args()

    if not args.token:
        sys.exit("Missing access token: set IG_ACCESS_TOKEN or pass --token")

    if args.list:
        if not args.account_id:
            sys.exit("Missing account id: set IG_ACCOUNT_ID or pass --account-id")
        list_recent_media(args.account_id, args.token, args.limit)
        return

    if not args.media_id:
        sys.exit("Nothing to do: pass --media-id (or --list to find one)")

    saved: dict[str, list[str]] = {}
    multi = len(args.media_id) > 1

    for media_id in args.media_id:
        urls = carousel_image_urls(media_id, args.token)
        if not urls:
            print(f"[{media_id}] no images found (video post, or not accessible)", file=sys.stderr)
            continue

        out_dir = Path(args.out) / media_id if multi else Path(args.out)
        paths = []
        for i, url in enumerate(urls, start=1):
            dest = out_dir / f"{i:02d}.jpg"
            download(url, dest)
            paths.append(str(dest))
            print(f"[{media_id}] saved {dest}")
        saved[media_id] = paths

    print(json.dumps(saved, indent=2))


if __name__ == "__main__":
    import urllib.parse
    main()
