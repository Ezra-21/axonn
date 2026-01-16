/**
 * Product Seeder
 * Seeds sample furniture products
 */

import { generateSlug, generateSKU } from '../../src/utils/helpers.js';

const seedProducts = async (prisma) => {
  console.log('🌱 Seeding products...');

  // Get categories
  const sofasCategory = await prisma.category.findUnique({
    where: { slug: 'sofas' },
  });

  const bedsCategory = await prisma.category.findUnique({
    where: { slug: 'beds' },
  });

  const diningTablesCategory = await prisma.category.findUnique({
    where: { slug: 'dining-tables' },
  });

  const officeDesksCategory = await prisma.category.findUnique({
    where: { slug: 'office-desks' },
  });

  if (!sofasCategory || !bedsCategory || !diningTablesCategory || !officeDesksCategory) {
    console.log('  ⚠️  Categories not found. Run category seeder first.');
    return;
  }

  const products = [
    // Sofas
    {
      name: 'Modern L-Shaped Sofa',
      description: 'Elegant L-shaped sectional sofa perfect for modern living rooms. Features high-density foam cushions and durable fabric upholstery.',
      shortDescription: 'Elegant L-shaped sectional sofa',
      price: 45000,
      comparePrice: 55000,
      stock: 10,
      categoryId: sofasCategory.id,
      material: 'Fabric, Wood Frame',
      color: 'Gray',
      dimensions: '280 x 180 x 85 cm',
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Classic Leather Sofa',
      description: 'Timeless 3-seater leather sofa with solid wood legs. Premium genuine leather with superior craftsmanship.',
      shortDescription: 'Premium 3-seater leather sofa',
      price: 65000,
      comparePrice: 75000,
      stock: 8,
      categoryId: sofasCategory.id,
      material: 'Genuine Leather, Solid Wood',
      color: 'Brown',
      dimensions: '220 x 90 x 85 cm',
      isFeatured: true,
    },
    // Beds
    {
      name: 'King Size Platform Bed',
      description: 'Contemporary platform bed with upholstered headboard. Includes sturdy slat support system.',
      shortDescription: 'Modern king size platform bed',
      price: 35000,
      comparePrice: 42000,
      stock: 15,
      categoryId: bedsCategory.id,
      material: 'Engineered Wood, Fabric',
      color: 'Beige',
      dimensions: '200 x 180 x 120 cm',
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Minimalist Wooden Bed Frame',
      description: 'Scandinavian-inspired solid wood bed frame. Natural finish with clean lines.',
      shortDescription: 'Scandinavian solid wood bed',
      price: 28000,
      stock: 20,
      categoryId: bedsCategory.id,
      material: 'Solid Oak Wood',
      color: 'Natural Oak',
      dimensions: '200 x 160 x 100 cm',
    },
    // Dining Tables
    {
      name: 'Expandable Dining Table',
      description: '6-8 seater expandable dining table with butterfly leaf extension. Perfect for family gatherings.',
      shortDescription: 'Expandable 6-8 seater dining table',
      price: 32000,
      comparePrice: 38000,
      stock: 12,
      categoryId: diningTablesCategory.id,
      material: 'Solid Wood',
      color: 'Walnut',
      dimensions: '180-240 x 100 x 76 cm',
      isFeatured: true,
    },
    {
      name: 'Glass Top Dining Table',
      description: 'Modern 6-seater dining table with tempered glass top and chrome legs.',
      shortDescription: 'Modern glass top dining table',
      price: 25000,
      stock: 10,
      categoryId: diningTablesCategory.id,
      material: 'Tempered Glass, Chrome Steel',
      color: 'Clear/Silver',
      dimensions: '160 x 90 x 76 cm',
      isNewArrival: true,
    },
    // Office Desks
    {
      name: 'Executive Office Desk',
      description: 'Large executive desk with built-in cable management and multiple drawers.',
      shortDescription: 'Premium executive office desk',
      price: 42000,
      comparePrice: 50000,
      stock: 8,
      categoryId: officeDesksCategory.id,
      material: 'MDF, Metal',
      color: 'Dark Walnut',
      dimensions: '180 x 80 x 76 cm',
      isFeatured: true,
    },
    {
      name: 'Standing Desk - Adjustable',
      description: 'Electric height-adjustable standing desk. Memory settings for different heights.',
      shortDescription: 'Electric height-adjustable desk',
      price: 28000,
      stock: 15,
      categoryId: officeDesksCategory.id,
      material: 'Bamboo Top, Steel Frame',
      color: 'Natural/Black',
      dimensions: '140 x 70 x 65-125 cm',
      isNewArrival: true,
    },
  ];

  for (const productData of products) {
    const slug = generateSlug(productData.name);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          slug,
          sku: generateSKU(productData.material?.substring(0, 3) || 'FUR'),
        },
      });

      // Add placeholder image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://placehold.co/600x400/EEE/333?text=${encodeURIComponent(productData.name)}`,
          altText: productData.name,
          isPrimary: true,
        },
      });

      console.log(`  ✅ Created product: ${productData.name}`);
    } else {
      console.log(`  ⏭️  Product exists: ${productData.name}`);
    }
  }

  console.log('✅ Product seeding completed');
};

export default seedProducts;
