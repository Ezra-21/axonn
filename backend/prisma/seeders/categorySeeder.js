/**
 * Category Seeder
 * Seeds furniture categories
 */

import { generateSlug } from '../../src/utils/helpers.js';

const seedCategories = async (prisma) => {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      name: 'Living Room',
      description: 'Comfortable furniture for your living space',
      subcategories: ['Sofas', 'Coffee Tables', 'TV Stands', 'Armchairs', 'Ottomans'],
    },
    {
      name: 'Bedroom',
      description: 'Quality furniture for restful sleep',
      subcategories: ['Beds', 'Wardrobes', 'Dressers', 'Nightstands', 'Mattresses'],
    },
    {
      name: 'Dining Room',
      description: 'Elegant dining furniture',
      subcategories: ['Dining Tables', 'Dining Chairs', 'Sideboards', 'Bar Stools'],
    },
    {
      name: 'Office',
      description: 'Professional office furniture',
      subcategories: ['Office Desks', 'Office Chairs', 'Bookshelves', 'Filing Cabinets'],
    },
    {
      name: 'Outdoor',
      description: 'Durable outdoor furniture',
      subcategories: ['Patio Sets', 'Garden Chairs', 'Outdoor Tables', 'Loungers'],
    },
    {
      name: 'Kids Room',
      description: 'Safe and fun furniture for children',
      subcategories: ['Kids Beds', 'Study Desks', 'Toy Storage', 'Bunk Beds'],
    },
  ];

  for (const category of categories) {
    const slug = generateSlug(category.name);

    // Check if parent category exists
    let parentCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (!parentCategory) {
      parentCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug,
          description: category.description,
          isActive: true,
        },
      });
      console.log(`  ✅ Created category: ${category.name}`);
    } else {
      console.log(`  ⏭️  Category exists: ${category.name}`);
    }

    // Create subcategories
    for (const subName of category.subcategories) {
      const subSlug = generateSlug(subName);

      const existingSub = await prisma.category.findUnique({
        where: { slug: subSlug },
      });

      if (!existingSub) {
        await prisma.category.create({
          data: {
            name: subName,
            slug: subSlug,
            parentId: parentCategory.id,
            isActive: true,
          },
        });
        console.log(`    ✅ Created subcategory: ${subName}`);
      }
    }
  }

  console.log('✅ Category seeding completed');
};

export default seedCategories;
