# Piero Beach Resort - Admin Setup Guide

## Creating an Admin Account

Because of strict security rules, you cannot register an admin account from the public app. Admins must be created directly in the Supabase Dashboard.

### Step 1: Create the User
1. Go to your Supabase Project Dashboard.
2. Navigate to **Authentication** > **Users**.
3. Click **Add User** -> **Create new user**.
4. Enter the email address and a secure password.
5. Disable "Auto Confirm User" if you want them to verify their email, or leave it enabled to let them log in immediately.
6. Click **Create User**.
7. Copy the newly created user's **User UID**.

### Step 2: Grant Admin Rights
1. Navigate to the **Table Editor**.
2. Open the `admin_profiles` table.
3. Click **Insert Row**.
4. Paste the **User UID** into the `id` field.
5. Enter the user's name in the `full_name` field (optional).
6. Click **Save**.

The user can now navigate to `https://<your-domain>/admin/login` and sign in.
