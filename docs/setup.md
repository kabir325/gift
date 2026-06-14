# Setup Notes

## Recommended stack

- App: Next.js on Vercel
- Answer storage: Upstash Redis
- Email alerts: Resend
- Video hosting: Cloudinary, Bunny Stream, or Cloudflare R2

## Why this setup

- It avoids Supabase.
- It stays cheap or free for a personal project with light traffic.
- It supports both answer tracking and email notifications.
- It lets you host larger videos outside the app bundle.

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_MESSAGE_VIDEO_URL`: direct URL for your talking video
- `NEXT_PUBLIC_BACKGROUND_VIDEO_URL`: direct URL for the looping memory montage
- `NEXT_PUBLIC_SONG_ONE_URL`: audio or video URL for the first song performance
- `NEXT_PUBLIC_SONG_ONE_COVER_URL`: cover image URL for the first song card
- `NEXT_PUBLIC_SONG_TWO_URL`: audio or video URL for the second song performance
- `NEXT_PUBLIC_SONG_TWO_COVER_URL`: cover image URL for the second song card
- `NEXT_PUBLIC_SONG_THREE_URL`: audio or video URL for the third song performance
- `NEXT_PUBLIC_SONG_THREE_COVER_URL`: cover image URL for the third song card
- `NEXT_PUBLIC_WHATSAPP_LINK`: full WhatsApp chat link for the final page button
- `RESEND_API_KEY`: API key from Resend
- `NOTIFY_TO_EMAIL`: your email address
- `NOTIFY_FROM_EMAIL`: verified sender in Resend
- `DASHBOARD_ACCESS_KEY`: password for `/dashboard`
- `UPSTASH_REDIS_REST_URL`: Upstash REST URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash REST token
- `UPSTASH_REDIS_KEY`: Redis list key for answers, defaults to `gift:answers`

## Local fallback

If Upstash is not configured, answers are saved to a local file in `data/submissions.json`.

This is useful for local development only. It is not durable after deployment on most serverless hosts.

On Vercel without Upstash, the site still works, but answer tracking is disabled until the Upstash env vars are added.

## Upstash setup

1. Create a Redis database in Upstash.
2. Open the database details page.
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Pick a dashboard password and set `DASHBOARD_ACCESS_KEY`.
5. Optionally keep `UPSTASH_REDIS_KEY=gift:answers` unless you want a custom key.

## Vercel env vars for tracking

Add these in your Vercel project settings:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_KEY`
- `DASHBOARD_ACCESS_KEY`

After saving them, redeploy the project.

## How tracking works

- Each answer from the three question screens is pushed into Upstash as a JSON string.
- The dashboard reads the most recent answers from the same Redis list.
- If Upstash is configured correctly, the deployed site records answers and the dashboard can display them.

## Asset plan

- Small images can live in `public/` if you are happy to redeploy when they change.
- Good places for repo-managed assets:
  - `public/photos/landing-photo.jpg`
  - `public/photos/timeline/`
  - `public/covers/`
- Upload your main message video to a video host and paste the URL into `NEXT_PUBLIC_MESSAGE_VIDEO_URL`.
- Upload your background montage video separately and paste the URL into `NEXT_PUBLIC_BACKGROUND_VIDEO_URL`.
- Upload your singing recordings as either audio or video and paste them into the song URL variables.
- Use the matching song cover URLs for artwork if you want the player to look more polished.

## What goes in the repo

- Best for repo storage:
  - landing photos
  - gallery images
  - song cover art
  - short decorative clips if they are very small
- Avoid keeping these in the repo:
  - long talking videos
  - montage videos
  - large audio recordings
  - multiple large photo exports straight from a phone

## Best Vercel media workflow

- Vercel is great for the app itself, but not ideal for serving lots of heavy media directly from the repo.
- Recommended setup:
  - app on Vercel
  - photos in `public/` if they are small and mostly final
  - larger videos and audio on Cloudinary, Bunny, or Cloudflare R2
- For your use case:
  - use `public/` for small images and cover art
  - use an external host for the long message video, montage video, and song recordings

## How to manage photos and videos

1. Put small static files in `public/`.
2. Put larger audio/video files on your media host.
3. Copy the hosted URLs into `.env.local`.
4. In Vercel, open the project settings and add the same env vars there.
5. Redeploy after changing env vars.

## WhatsApp button

- The final page supports a WhatsApp button if `NEXT_PUBLIC_WHATSAPP_LINK` is set.
- Use a full link like:
  - `https://wa.me/15551234567`
  - `https://wa.me/15551234567?text=hey`
- Add the same value to Vercel env vars before redeploying.

## Suggested media hosts

- Easiest: Cloudinary
- Cheapest long-term: Cloudflare R2
- Very simple for video delivery: Bunny Stream

## Song and lyrics setup

- The songs page supports both audio and video recordings.
- Lyrics are timed manually in `src/components/song-stage.tsx`.
- For each song:
  - replace the title and artist
  - set the media URL
  - set the cover image URL
  - edit the lyric lines and their `time` values
- The highlighted lyric follows the playback time automatically.

## Suggested next content pass

- Replace the placeholder photo panel with your real image
- Rewrite the slide text in your own voice
- Fill the timeline nodes with real memories
- Replace the placeholder letters with actual letters from you
