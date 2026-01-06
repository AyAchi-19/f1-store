-- Seed some initial F1 merchandise
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity)
VALUES 
('Oracle Red Bull Racing 2024 Team Cap', 'Official 2024 team cap with adjustable closure.', 35.00, 'Apparel', '/placeholder.svg?height=400&width=400', 100),
('Mercedes-AMG Petronas W15 1:43 Model', 'High-quality diecast model of the 2024 Mercedes W15.', 85.00, 'Collectibles', '/placeholder.svg?height=400&width=400', 50),
('Scuderia Ferrari Team T-Shirt', 'Official Ferrari team t-shirt in iconic Rosso Corsa.', 55.00, 'Apparel', '/placeholder.svg?height=400&width=400', 200),
('McLaren F1 Team Rain Jacket', 'Lightweight waterproof jacket with McLaren branding.', 120.00, 'Apparel', '/placeholder.svg?height=400&width=400', 30);
