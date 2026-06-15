# Admin System Foundation

## Authentication
Admin authentication utilizes Supabase's built-in Auth but restricts access using an `admin_profiles` table. The application validates admin status securely on the server via `src/lib/admin/auth.ts`. 

- **Client Routes**: All protected admin pages are inside `src/app/admin/(protected)` which uses a shared layout to enforce authentication before any content is rendered.
- **Server Actions**: All database writes from the admin area inside `src/lib/admin/actions.ts` call `requireAdmin()` first to verify identity and authorization. 

## Pricing Model
The resort operates with a "50% Discount" display model, which is managed dynamically in the admin settings. 
The real booking price (what the guest pays) remains untouched when this setting changes.

- `discounted_rate`: The actual source of truth for pricing. E.g., `4500`
- `original_rate_markup_percentage`: Stored in `resort_settings`. If the discount is 50%, the markup is 100%. E.g., `100`
- `regular_rate`: Derived using `discounted_rate * (1 + markup/100)`. E.g., `9000`.

This approach ensures stability. Even if the discount slider is changed frequently for marketing, historical booking records and checkout flows rely solely on the stable `discounted_rate`.

## Security
- The **Supabase Service Role Key** is never exposed to the client. It is encapsulated inside `src/lib/supabase/admin.ts` using the `'server-only'` directive to strictly prevent it from leaking into client bundles.
- File uploads for payment proofs are stored securely in the `payment-proofs` bucket. They are not publicly accessible. The admin dashboard generates short-lived signed URLs for viewing proofs on the server side.
- No CMS components have been created that modify public-facing components, maximizing site performance and stability while keeping the codebase tight.
