require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Color = require('./models/Color');
const Pattern = require('./models/Pattern');

const colorsData = [
  { name: 'Pure White', hex: '#FFFFFF', rgb: '255,255,255', categoryTags: ['Neutral', 'Living Room'] },
  { name: 'Charcoal', hex: '#36454F', rgb: '54,69,79', categoryTags: ['Dark', 'Accent'] },
  { name: 'Sky Blue', hex: '#87CEEB', rgb: '135,206,235', categoryTags: ['Cool', 'Bedroom'] },
  { name: 'Mint Green', hex: '#98FF98', rgb: '152,255,152', categoryTags: ['Cool', 'Kitchen'] },
  { name: 'Warm Beige', hex: '#F5F5DC', rgb: '245,245,220', categoryTags: ['Warm', 'Living Room'] },
  { name: 'Crimson Red', hex: '#DC143C', rgb: '220,20,60', categoryTags: ['Warm', 'Accent'] },
  { name: 'Mustard Yellow', hex: '#FFDB58', rgb: '255,219,88', categoryTags: ['Warm', 'Kitchen'] },
  { name: 'Lavender', hex: '#E6E6FA', rgb: '230,230,250', categoryTags: ['Cool', 'Bedroom'] },
  { name: 'Ocean Teal', hex: '#008080', rgb: '0,128,128', categoryTags: ['Cool', 'Bathroom'] },
  { name: 'Blush Pink', hex: '#FFB6C1', rgb: '255,182,193', categoryTags: ['Warm', 'Bedroom'] },
  { name: 'Slate Gray', hex: '#708090', rgb: '112,128,144', categoryTags: ['Neutral', 'Exterior'] },
  { name: 'Sage Green', hex: '#9DC183', rgb: '157,193,131', categoryTags: ['Cool', 'Living Room'] },
  { name: 'Navy Blue', hex: '#000080', rgb: '0,0,128', categoryTags: ['Dark', 'Accent'] },
  { name: 'Terracotta', hex: '#E2725B', rgb: '226,114,91', categoryTags: ['Warm', 'Exterior'] },
  { name: 'Peach', hex: '#FFE5B4', rgb: '255,229,180', categoryTags: ['Warm', 'Bedroom'] },
  { name: 'Mocha', hex: '#493D26', rgb: '73,61,38', categoryTags: ['Dark', 'Living Room'] },
  { name: 'Emerald', hex: '#50C878', rgb: '80,200,120', categoryTags: ['Cool', 'Accent'] },
  { name: 'Ruby', hex: '#E0115F', rgb: '224,17,95', categoryTags: ['Warm', 'Accent'] },
  { name: 'Cobalt', hex: '#0047AB', rgb: '0,71,171', categoryTags: ['Cool', 'Accent'] },
  { name: 'Coral', hex: '#FF7F50', rgb: '255,127,80', categoryTags: ['Warm', 'Bathroom'] },
  { name: 'Ivory', hex: '#FFFFF0', rgb: '255,255,240', categoryTags: ['Neutral', 'Living Room'] },
  { name: 'Olive', hex: '#808000', rgb: '128,128,0', categoryTags: ['Warm', 'Kitchen'] },
  { name: 'Plum', hex: '#DDA0DD', rgb: '221,160,221', categoryTags: ['Cool', 'Bedroom'] },
  { name: 'Sand', hex: '#C2B280', rgb: '194,178,128', categoryTags: ['Neutral', 'Exterior'] },
  { name: 'Turquoise', hex: '#40E0D0', rgb: '64,224,208', categoryTags: ['Cool', 'Bathroom'] },
  { name: 'Silver', hex: '#C0C0C0', rgb: '192,192,192', categoryTags: ['Neutral', 'Living Room'] },
  { name: 'Gold', hex: '#FFD700', rgb: '255,215,0', categoryTags: ['Warm', 'Accent'] },
  { name: 'Rust', hex: '#B7410E', rgb: '183,65,14', categoryTags: ['Warm', 'Exterior'] },
  { name: 'Indigo', hex: '#4B0082', rgb: '75,0,130', categoryTags: ['Dark', 'Bedroom'] },
  { name: 'Rose', hex: '#FF007F', rgb: '255,0,127', categoryTags: ['Warm', 'Accent'] }
];

const patternsData = [
  { name: 'Stripes', imageUrl: '/patterns/stripes.png', scale: 1 },
  { name: 'Polka Dots', imageUrl: '/patterns/dots.png', scale: 1 },
  { name: 'Chevron', imageUrl: '/patterns/chevron.png', scale: 1 },
  { name: 'Geometric', imageUrl: '/patterns/geometric.png', scale: 1 },
  { name: 'Floral', imageUrl: '/patterns/floral.png', scale: 1 },
  { name: 'Damask', imageUrl: '/patterns/damask.png', scale: 1 },
  { name: 'Brick', imageUrl: '/patterns/brick.png', scale: 1 },
  { name: 'Wood', imageUrl: '/patterns/wood.png', scale: 1 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wall-paint-visualizer');
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Color.deleteMany();
    await Pattern.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    await User.create({
      name: 'Admin',
      email: 'admin@demo.com',
      passwordHash,
      role: 'admin'
    });

    await Color.insertMany(colorsData);
    await Pattern.insertMany(patternsData);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
