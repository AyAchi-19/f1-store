-- Run this in your Supabase SQL Editor to set up the checkout tables

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  total numeric not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  price numeric not null
);

-- Enable RLS (Row Level Security) if not already enabled
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies (Adjust strictness as needed)
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own orders" on orders
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own order items" on order_items
  for select using (
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

create policy "Users can insert their own order items" on order_items
  for insert with check (
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );
