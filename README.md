# TinyTotBooks — offline demo

This is a fully offline storefront prototype. Open `index.html` in any modern browser; no install or server is required.

Included: a colourful home page, searchable book catalogue, book detail views, character and age collections, monthly picks, gift bundles, a persistent shopping bag, a checkout layout that deliberately does not process payment, and a local admin dashboard.

## Admin demo

Open **Shop admin** from the footer (or add `#admin` to the address bar). The demo passcode is `storybook`.

The dashboard can add, edit, and remove books; change every book's title, author, price, age, genre, ratings, description, colour and cover image; mark books available or sold; add/edit/remove character and collection cards with their own picture; set the free-shipping threshold; and edit the key home-page wording.

Changes are saved in this browser's local storage, so there is no database or real security in this standalone version. Custom photo uploads are also stored only in the current browser, so use images under 1 MB. Exporting this into a live business website should move this content and images into Supabase Storage (or another image host) with real authentication.

## Before publishing

- Move the data into Supabase (books, stock, reviews, orders, site settings).
- Put authentication and all admin actions on the server — the local passcode is demo-only.
- Integrate a real payment provider (Razorpay/Stripe) and connect checkout to it.
- Replace the sample content, email address, and browser-generated book art.
