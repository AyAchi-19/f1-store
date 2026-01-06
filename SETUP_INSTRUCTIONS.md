# E-Commerce Store Setup Instructions

## 🎯 Quick Start

Your F1 Store is almost ready! Follow these steps to complete the setup:

### 1. Database Setup (Supabase)

You need to create the missing database tables for orders to work properly.

**Steps:**
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `miaawygaevsrdweziwzd`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase_schema.sql` (in this folder)
6. Click **Run** to execute the SQL

**What this creates:**
- `orders` table - stores customer orders
- `order_items` table - stores individual items in each order
- Row Level Security (RLS) policies - ensures users can only see their own orders

### 2. Verify Your Database Tables

Make sure you have these tables in Supabase:
- ✅ `profiles` - user profiles with roles
- ✅ `products` - product catalog
- ✅ `orders` - customer orders (NEW - create this!)
- ✅ `order_items` - order line items (NEW - create this!)

### 3. Test the Checkout Flow

1. Make sure `npm run dev` is running
2. Open http://localhost:3000
3. Browse products and add items to cart
4. Click the shopping bag icon to view cart
5. Click "Checkout Now"
6. If you see "Demo Order Placed! (DB not connected)" - the orders tables are missing
7. After running the SQL script, you should see "Order placed successfully! Keep pushing."

### 4. Admin Access

To access the admin dashboard:
1. Log in with a user account
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your user and change `role` from `user` to `admin`
4. Refresh the page - you'll see a "Dashboard" button in the header
5. Navigate to `/admin` to manage products and orders

## 🔧 Troubleshooting

### "Demo Order Placed! (DB not connected)"
- This means the `orders` and `order_items` tables don't exist
- Run the SQL script from `supabase_schema.sql` in Supabase SQL Editor

### Products not showing
- Check if you have products in the `products` table
- You can add products via the admin panel at `/admin`

### Can't log in
- Make sure your Supabase project is active
- Check `.env.local` has correct credentials
- Verify email confirmation is disabled in Supabase Auth settings (for testing)

### Cart items disappearing
- This has been fixed! Cart state is now managed globally
- Clear your browser's localStorage if you still see issues

## 📝 Environment Variables

Your `.env.local` file should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://miaawygaevsrdweziwzd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WClLvhvUJBqN81S7m8v6cw_E7z7hUQd
```

## 🚀 Features

- ✅ Product browsing with categories
- ✅ Shopping cart with persistent storage
- ✅ User authentication (login/signup)
- ✅ Checkout flow
- ✅ Admin dashboard for product management
- ✅ Order history (after DB setup)
- ✅ Responsive design
- ✅ Modern UI with animations

## 📚 Next Steps

1. Run the SQL script to enable full checkout
2. Add more products via admin panel
3. Customize the design/branding
4. Add product images (use real URLs or upload to Supabase Storage)
5. Set up email notifications (Supabase Auth)
6. Deploy to Vercel or your preferred hosting

## 🎨 Customization

- **Colors**: Edit `app/globals.css` for theme colors
- **Logo**: Replace the Trophy icon in `components/store-layout.tsx`
- **Hero Image**: Update the image path in `app/page.tsx`
- **Product Categories**: Modify categories in admin dialogs

Enjoy your F1 Store! 🏎️
