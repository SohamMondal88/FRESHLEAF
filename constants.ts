
import { Product, BlogPost, Testimonial, Order, DeliverySlot, Rider, Coupon } from './types';

export const COMPANY_INFO = {
  name: "FreshLeaf",
  phone: "+91 8513028892",
  email: "subhajitabir@gmail.com",
  whatsapp: "918513028892", // Format for API
  address: "123 Green Market, Sector 4, Kolkata, West Bengal 700001",
  minOrderValue: 150
};

export const COUPONS: Coupon[] = [
  { id: 'c1', code: 'FRESH50', type: 'flat', value: 50, minOrder: 300, description: 'Flat ₹50 off on orders above ₹300', isActive: true },
  { id: 'c2', code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, description: '10% off for new users', isActive: true },
  { id: 'c3', code: 'VEGGIE20', type: 'percent', value: 20, minOrder: 500, description: '20% off on orders above ₹500', isActive: true },
  { id: 'c4', code: 'SUMMER30', type: 'flat', value: 30, minOrder: 200, description: 'Cool off with ₹30 discount', isActive: false },
];

export const RIDERS: Rider[] = [
  { id: 'r1', name: 'Ramesh Kumar', phone: '9876543210', status: 'Available', rating: 4.8, vehicle: 'Honda Activa' },
  { id: 'r2', name: 'Suresh Singh', phone: '9876543211', status: 'Busy', currentOrderId: 'FL-928374', rating: 4.5, vehicle: 'Bajaj Pulsar' },
  { id: 'r3', name: 'Abdul Rahman', phone: '9876543212', status: 'Offline', rating: 4.9, vehicle: 'TVS Jupiter' },
  { id: 'r4', name: 'Vikram Das', phone: '9876543213', status: 'Available', rating: 4.7, vehicle: 'Hero Splendor' },
];

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 's1', label: 'Early Morning', time: '6:00 AM - 9:00 AM', price: 0, available: true },
  { id: 's2', label: 'Mid Morning', time: '9:00 AM - 12:00 PM', price: 0, available: true },
  { id: 's3', label: 'Afternoon', time: '12:00 PM - 3:00 PM', price: 0, available: true },
  { id: 's4', label: 'Evening', time: '3:00 PM - 6:00 PM', price: 0, available: true },
  { id: 's5', label: 'Instant Delivery', time: 'Within 45 mins', price: 49, available: true }, // Premium slot
];

export const FAQS = [
  {
    question: "How fresh are the vegetables?",
    answer: "We source our produce directly from certified organic farmers within 12 hours of your order. Our 'Farm-to-Fork' policy ensures maximum freshness."
  },
  {
    question: "Do you deliver to my location?",
    answer: "We currently deliver to Kolkata, New Delhi, Mumbai, Bangalore, and Pune. You can check serviceability by entering your pincode at checkout."
  },
  {
    question: "What is the return policy?",
    answer: "We have a 'No Questions Asked' return policy at the time of delivery. If you are unhappy with the quality, you can return it instantly to the rider."
  },
  {
    question: "Can I schedule a delivery?",
    answer: "Yes! At checkout, you can choose a delivery slot that suits your convenience, including early morning and evening slots."
  },
  {
    question: "How do I use my wallet balance?",
    answer: "If you have a balance in your FreshLeaf Wallet, it will be automatically applied at checkout. You can pay the remaining amount via other methods."
  }
];

// Helper to create products with 3 images
const createProduct = (
  id: string, 
  en: string, 
  hi: string, 
  bn: string, 
  cat: string, 
  price: number, 
  imgMain: string, 
  desc: string = 'Fresh and high quality produce sourced directly from farmers.',
  baseUnit: string = 'kg',
  flags: { isNew?: boolean; isOrganic?: boolean; isLocal?: boolean } = {}
): Product => {
  const gallery = [
    imgMain,
    `${imgMain}?auto=format&fit=crop&w=800&q=80`,
    `${imgMain}?auto=format&fit=crop&w=800&q=80`
  ];

  return {
    id,
    name: { en, hi, bn },
    price,
    oldPrice: Math.round(price * 1.25),
    category: cat,
    image: imgMain,
    gallery: gallery,
    description: desc,
    inStock: true,
    rating: 4.5 + (Math.random() * 0.5),
    reviews: Math.floor(Math.random() * 500) + 50,
    baseUnit,
    ...flags
  };
};

export const PRODUCTS: Product[] = [
  // --- FRUITS ---
  createProduct('f-1', 'Apple Washington', 'वाशिंगटन सेब', 'ওয়াশিংটন আপেল', 'Imported Fruit', 135, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80', 'Crisp and sweet Washington apples.', 'kg'),
  createProduct('f-2', 'Apple Shimla', 'शिमला सेब', 'শিমলা আপেল', 'Apple', 115, 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80', 'Fresh apples from Shimla orchards.', 'kg', { isLocal: true }),
  createProduct('f-3', 'Apple Green', 'हरा सेब', 'সবুজ আপেল', 'Apple', 165, 'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?auto=format&fit=crop&w=800&q=80', 'Tangy and crunchy green apples.', 'kg'),
  createProduct('f-4', 'Apricot', 'खुबानी', 'এপ্রিকট', 'Stone Fruit', 175, 'https://images.unsplash.com/photo-1599522316689-53e30e157796?auto=format&fit=crop&w=800&q=80', 'Sweet and velvety apricots.', 'kg'),
  createProduct('f-5', 'Avocado', 'एवोकाडो', 'অ্যাভোকাডো', 'Exotic', 205, 'https://images.unsplash.com/photo-1523049673856-6485b5801825?auto=format&fit=crop&w=800&q=80', 'Creamy butter fruit.', 'pc', { isNew: true }),
  createProduct('f-6', 'Banana Morris', 'मॉरिस केला', 'মরিস কলা', 'Banana', 31, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80', 'Sweet Morris bananas.', 'kg'),
  createProduct('f-7', 'Banana', 'केला', 'কলা', 'Banana', 63, '/images/Banana.jpg', 'Regular Cavendish bananas.', 'kg'),
  createProduct('f-8', 'Banana Poovam', 'पूवन केला', 'পুভাম কলা', 'Banana', 63, '/images/Banana Poovam.png', 'Small sweet Poovam bananas.', 'kg'),
  createProduct('f-9', 'Cantaloupe', 'खरबूजा', 'খরমুজ', 'Melon', 31, '/images/Cantaloupe.jpg', 'Sweet muskmelon.', 'kg'),
  createProduct('f-10', 'Custard Apple', 'सीताफल', 'আতা', 'Tropical', 57, '/images/Custard Apple.jpg', 'Creamy custard apples.', 'kg', { isLocal: true }),
  createProduct('f-11', 'Gooseberry', 'आंवला', 'আমলকী', 'Berry', 115, '/images/Gooseberry.jpg', 'Vitamin C rich Amla.', 'kg'),
  createProduct('f-12', 'Grapes Black', 'काले अंगूर', 'কালো আঙ্গুর', 'Grapes', 85, '/images/Black Grapes.jpg', 'Seedless black grapes.', 'kg'),
  createProduct('f-13', 'Grapes Green', 'हरे अंगूर', 'সবুজ আঙ্গুর', 'Grapes', 95, '/images/Green Grapes.jpg', 'Sweet green grapes.', 'kg'),
  createProduct('f-14', 'Guava', 'अमरूद', 'পেয়ারা', 'Tropical', 56, '/images/Guava.jpg', 'Fresh pink guava.', 'kg'),
  createProduct('f-15', 'Jackfruit', 'कटहल', 'কাঁঠাল', 'Tropical', 85, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', 'Raw or ripe jackfruit.', 'kg'),
  createProduct('f-16', 'Lychee', 'लीची', 'লিচু', 'Exotic', 215, '/images/Lychee.jpg', 'Sweet juicy lychees.', 'kg'),
  createProduct('f-17', 'Mango', 'आम', 'আম', 'Mango', 102, '/images/Mango.jpg', 'King of fruits.', 'kg'),
  createProduct('f-18', 'Orange', 'संतरा', 'কমলা', 'Citrus', 70, '/images/Orange.jpg', 'Fresh Nagpur oranges.', 'kg'),
  createProduct('f-19', 'Papaya', 'पपीता', 'পেঁপে', 'Tropical', 38, '/images/Papaya.jpg', 'Ripe sweet papaya.', 'pc'),
  createProduct('f-20', 'Pears', 'नाशपाती', 'নাশপাতি', 'Imported Fruit', 97, '/images/Pear.jpg', 'Imported pears.', 'kg'),
  createProduct('f-21', 'Pineapple', 'अननास', 'আনারস', 'Tropical', 35, '/images/Pineapple.jpg', 'Fresh pineapple.', 'pc'),
  createProduct('f-22', 'Pomegranate Kabul', 'काबुली अनार', 'কাবুলি বেদানা', 'Exotic', 125, '/images/Pomegranate.jpg', 'Deep red pomegranate.', 'kg'),
  createProduct('f-23', 'Sapota', 'चीकू', 'সবেদা', 'Tropical', 55, '/images/Sapota.jpg', 'Sweet sapota (Chiku).', 'kg'),
  createProduct('f-24', 'Sugar Cane', 'गन्ना', 'आঁখ', 'Other', 30, '/images/Sugarcane.jpg', 'Fresh sugar cane stalks.', 'pc'),
  createProduct('f-25', 'Sweet Lime (Mosambi)', 'मौसम्बी', 'মৌসাম্বি', 'Citrus', 50, 'https://images.unsplash.com/photo-1615485500662-7201de3cb377?auto=format&fit=crop&w=800&q=80', 'Juicy sweet lime.', 'kg'),
  createProduct('f-26', 'Watermelon', 'तरबूज', 'তরমুজ', 'Melon', 28, '/images/Watermelon.jpg', 'Dark green watermelon.', 'pc'),

  // --- VEGETABLES ---
  createProduct('v-1', 'Onion Big', 'बड़ा प्याज', 'बड़े पेयाज़', 'Bulb', 34, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 'Large red onions.', 'kg'),
  createProduct('v-2', 'Onion Small', 'छोटा प्याज', 'ছোট পেঁয়াজ', 'Bulb', 53, 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&w=800&q=80', 'Small sambar onions.', 'kg'),
  createProduct('v-3', 'Tomato', 'टमाटर', 'টমেটো', 'Fruit Veg', 51, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Ripe red tomatoes.', 'kg'),
  createProduct('v-4', 'Green Chilli', 'हरी मिर्च', 'কাঁচা लঙ্কা', 'Fruit Veg', 45, 'https://images.unsplash.com/photo-1560163353-93630f9a244b?auto=format&fit=crop&w=800&q=80', 'Spicy green chillies.', 'kg'),
  createProduct('v-5', 'Beetroot', 'चुकंदर', 'বিট', 'Root Veg', 35, 'https://images.unsplash.com/photo-1596489853965-7467ba605663?auto=format&fit=crop&w=800&q=80', 'Fresh beetroot.', 'kg'),
  createProduct('v-6', 'Potato', 'आलू', 'আলু', 'Root Veg', 41, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', 'Standard potatoes.', 'kg'),
  createProduct('v-7', 'Raw Banana (Plantain)', 'कच्चा केला', 'কাঁচ কলা', 'Other Veg', 17, 'https://images.unsplash.com/photo-1588613309228-3e4b3017a782?auto=format&fit=crop&w=800&q=80', 'Green plantains for cooking.', 'pc'),
  createProduct('v-8', 'Amaranth Leaves', 'चौलाई', 'নটে শাক', 'Leafy', 21, 'https://images.unsplash.com/photo-1550411294-b3b1bd5fce1b?auto=format&fit=crop&w=800&q=80', 'Fresh red/green amaranth.', 'bunch'),
  createProduct('v-9', 'Amla', 'आंवला', 'আমলকী', 'Other Veg', 90, 'https://images.unsplash.com/photo-1603208761073-2b2207908d07?auto=format&fit=crop&w=800&q=80', 'Indian gooseberry.', 'kg'),
  createProduct('v-10', 'Ash Gourd', 'पेठा', 'চাল কুমড়া', 'Other Veg', 22, 'https://images.unsplash.com/photo-1469324707621-3e0e7195d45d?auto=format&fit=crop&w=800&q=80', 'Winter melon.', 'kg'),
  createProduct('v-11', 'Baby Corn', 'बेबी कॉर्न', 'बेबि कॉर्न', 'Other Veg', 57, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 'Tender corn cobs.', 'kg'),
  createProduct('v-12', 'Banana Flower', 'केले का फूल', 'মোচা', 'Other Veg', 23, 'https://images.unsplash.com/photo-1602497864303-34e8ce978749?auto=format&fit=crop&w=800&q=80', 'Fresh banana flower.', 'pc'),
  createProduct('v-13', 'Capsicum', 'शिमला मिर्च', 'क্যাপসিকাম', 'Fruit Veg', 45, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80', 'Green bell pepper.', 'kg'),
  createProduct('v-14', 'Bitter Gourd', 'करेला', 'করলা', 'Fruit Veg', 41, 'https://images.unsplash.com/photo-1598025362874-49480e041cce?auto=format&fit=crop&w=800&q=80', 'Karela.', 'kg'),
  createProduct('v-15', 'Bottle Gourd', 'लौकी', 'লাউ', 'Fruit Veg', 41, 'https://plus.unsplash.com/premium_photo-1675237625683-1c39d8920199?auto=format&fit=crop&w=800&q=80', 'Lauki.', 'pc'),
  createProduct('v-16', 'Butter Beans', 'मक्खन सेम', 'শিম', 'Beans/Legumes', 52, 'https://images.unsplash.com/photo-1622206151226-18ca0c960306?auto=format&fit=crop&w=800&q=80', 'Large lima beans.', 'kg'),
  createProduct('v-17', 'Broad Beans', 'बड़ी सेम', 'শিম', 'Beans/Legumes', 43, 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?auto=format&fit=crop&w=800&q=80', 'Fresh broad beans.', 'kg'),
  createProduct('v-18', 'Cabbage', 'पत्ता गोभी', 'বাঁধাকপি', 'Leafy', 34, 'https://images.unsplash.com/photo-1551154881-30d0d8299281?auto=format&fit=crop&w=800&q=80', 'Green cabbage.', 'pc'),
  createProduct('v-19', 'Carrot', 'गाजर', 'গাজর', 'Root Veg', 43, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', 'Orange carrots.', 'kg'),
  createProduct('v-20', 'Cauliflower', 'फूलगोभी', 'ফুলকপি', 'Flower Veg', 31, 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80', 'Fresh cauliflower.', 'pc'),
  createProduct('v-21', 'Cluster Beans', 'ग्वार फली', 'গওয়ার ফলি', 'Beans/Legumes', 50, 'https://images.unsplash.com/photo-1592394533824-9436d7d25407?auto=format&fit=crop&w=800&q=80', 'Guar beans.', 'kg'),
  createProduct('v-22', 'Coconut', 'नारियल', 'নারকেল', 'Other Veg', 70, 'https://images.unsplash.com/photo-1596434441559-99e535c3453b?auto=format&fit=crop&w=800&q=80', 'Coconut with husk.', 'pc'),
  createProduct('v-23', 'Colocasia Leaves', 'अरबी के पत्ते', 'কচু শাক', 'Leafy', 18, 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80', 'Arbi leaves.', 'bunch'),
  createProduct('v-24', 'Colocasia', 'अरबी', 'কচু', 'Root Veg', 33, 'https://images.unsplash.com/photo-1635332679679-242617757996?auto=format&fit=crop&w=800&q=80', 'Taro roots.', 'kg'),
  createProduct('v-25', 'Coriander Leaves', 'धनिया', 'ধনে পাতা', 'Leafy', 18, 'https://images.unsplash.com/photo-1588879464312-3277cb797d74?auto=format&fit=crop&w=800&q=80', 'Fresh dhaniya.', 'bunch'),
  createProduct('v-26', 'Corn', 'भुट्टा', 'ভুট্টা', 'Other Veg', 33, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 'Sweet corn.', 'pc'),
  createProduct('v-27', 'Cucumber', 'खीरा', 'শসা', 'Fruit Veg', 31, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80', 'Green cucumber.', 'kg'),
  createProduct('v-28', 'Curry Leaves', 'करी पत्ता', 'কারিপাতা', 'Leafy', 30, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', 'Fresh curry leaves.', 'bunch'),
  createProduct('v-29', 'Dill Leaves', 'सोया मेथी', 'শুল্ফা শাক', 'Leafy', 18, 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&w=800&q=80', 'Fresh dill.', 'bunch'),
  createProduct('v-30', 'Drumsticks', 'सहजन', 'सজনে ডাঁটা', 'Fruit Veg', 65, 'https://images.unsplash.com/photo-1561053720-76cd737463d3?auto=format&fit=crop&w=800&q=80', 'Moringa pods.', 'kg'),
  createProduct('v-31', 'Brinjal', 'बैंगन', 'বেগুন', 'Fruit Veg', 40, 'https://images.unsplash.com/photo-1615484477780-d6c299c8332d?auto=format&fit=crop&w=800&q=80', 'Small eggplants.', 'kg'),
  createProduct('v-32', 'Brinjal (Big)', 'बड़ा बैंगन', 'বড় বেগুন', 'Fruit Veg', 52, 'https://images.unsplash.com/photo-1599347893701-34440026e792?auto=format&fit=crop&w=800&q=80', 'Large roasting brinjal.', 'kg'),
  createProduct('v-33', 'Elephant Yam', 'जिमीकंद', 'ওল', 'Root Veg', 50, 'https://images.unsplash.com/photo-1633959603598-636952777329?auto=format&fit=crop&w=800&q=80', 'Suran/Yam.', 'kg'),
  createProduct('v-34', 'Fenugreek Leaves', 'मेथी', 'মেথি শাক', 'Leafy', 16, 'https://images.unsplash.com/photo-1588879464312-3277cb797d74?auto=format&fit=crop&w=800&q=80', 'Fresh Methi leaves.', 'bunch'),
  createProduct('v-35', 'French Beans', 'फ्रेंच बीन्स', 'বিনস', 'Beans/Legumes', 59, 'https://images.unsplash.com/photo-1592394533824-9436d7d25407?auto=format&fit=crop&w=800&q=80', 'Green beans.', 'kg'),
  createProduct('v-36', 'Garlic', 'लहसुन', 'রসুন', 'Bulb', 103, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80', 'Fresh garlic.', 'kg'),
  createProduct('v-37', 'Ginger', 'अदरक', 'आदा', 'Root Veg', 77, 'https://images.unsplash.com/photo-1635839958022-7221b6559385?auto=format&fit=crop&w=800&q=80', 'Root ginger.', 'kg'),
  createProduct('v-38', 'Onion Green', 'हरा प्याज', 'पेयरा कॉल', 'Leafy', 45, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 'Spring onions.', 'bunch'),
  createProduct('v-39', 'Green Peas', 'मटर', 'मटर', 'Beans/Legumes', 54, 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80', 'Fresh peas.', 'kg'),
  createProduct('v-40', 'Ivy Gourd', 'कुंदरू', 'कुंदरी', 'Fruit Veg', 37, 'https://images.unsplash.com/photo-1605307393433-437537307062?auto=format&fit=crop&w=800&q=80', 'Tindora.', 'kg'),
  createProduct('v-41', 'Lemon (Lime)', 'नींबू', 'लेबू', 'Fruit Veg', 59, 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80', 'Yellow lemons.', 'kg'),
  createProduct('v-42', 'Mango Raw', 'कच्चा आम', 'कच्चा आम', 'Fruit Veg', 51, 'https://images.unsplash.com/photo-1621961048738-a296d933be75?auto=format&fit=crop&w=800&q=80', 'Green mango for pickle.', 'kg'),
  createProduct('v-43', 'Mint Leaves', 'पुदीना', 'पुदीना', 'Leafy', 10, 'https://images.unsplash.com/photo-1609124973516-724bc2407567?auto=format&fit=crop&w=800&q=80', 'Fresh pudina.', 'bunch'),
  createProduct('v-44', 'Mushroom', 'मशरूम', 'मशरूम', 'Other Veg', 89, 'https://images.unsplash.com/photo-1504387432042-6bf78b2459a2?auto=format&fit=crop&w=800&q=80', 'Button mushrooms.', 'kg'),
  createProduct('v-45', 'Mustard Leaves', 'सरसों का साग', 'सरसों का साग', 'Leafy', 23, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', 'Sarson leaves.', 'bunch'),
  createProduct('v-46', 'Ladies Finger', 'भिंडी', 'भिंडी', 'Fruit Veg', 43, 'https://images.unsplash.com/photo-1425543103986-226d3d8db61e?auto=format&fit=crop&w=800&q=80', 'Okra.', 'kg'),
  createProduct('v-47', 'Pumpkin', 'कद्दू', 'कद्दू', 'Other Veg', 27, 'https://images.unsplash.com/photo-1570586437263-ab629fbd8181?auto=format&fit=crop&w=800&q=80', 'Yellow pumpkin.', 'kg'),
  createProduct('v-48', 'Radish', 'मूली', 'मूली', 'Root Veg', 33, 'https://images.unsplash.com/photo-1590623359560-59f6be2b6510?auto=format&fit=crop&w=800&q=80', 'White radish.', 'kg'),
  createProduct('v-49', 'Ridge Gourd', 'तोरई', 'तोरई', 'Fruit Veg', 42, 'https://images.unsplash.com/photo-1598025362874-49480e041cce?auto=format&fit=crop&w=800&q=80', 'Torai.', 'kg'),
  createProduct('v-50', 'Shallot (Pearl Onion)', 'सांभर प्याज', 'छोटा प्याज', 'Bulb', 45, 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&w=800&q=80', 'Pearl onions.', 'kg'),
  createProduct('v-51', 'Snake Gourd', 'चिचिंडा', 'चिचिंडा', 'Fruit Veg', 37, 'https://images.unsplash.com/photo-1563865436874-99d1ca6e327b?auto=format&fit=crop&w=800&q=80', 'Long snake gourd.', 'kg'),
  createProduct('v-52', 'Sorrel Leaves', 'खट्टी भाजी', 'खट्टी भाजी', 'Leafy', 17, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', 'Sour spinach.', 'bunch'),
  createProduct('v-53', 'Spinach', 'पालक', 'पालक', 'Leafy', 16, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', 'Fresh spinach.', 'bunch'),
  createProduct('v-54', 'Sweet Potato', 'शकरकंद', 'शकरकंद', 'Root Veg', 65, 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=800&q=80', 'Red sweet potato.', 'kg'),
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Benefits of Organic Farming in India',
    excerpt: 'Discover how organic farming helps the soil and provides healthier produce for your family.',
    date: 'Oct 12, 2023',
    author: 'Dr. R. Sharma',
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d72?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    title: 'Seasonal Fruits You Must Try This Summer',
    excerpt: 'Beat the heat with these hydrating and delicious seasonal fruits available now.',
    date: 'Sep 28, 2023',
    author: 'Priya Patel',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    title: '5 Healthy Smoothies for Breakfast',
    excerpt: 'Quick and easy recipes to start your day with a boost of energy.',
    date: 'Sep 15, 2023',
    author: 'Amit Roy',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Anjali Gupta',
    location: 'Kolkata',
    comment: 'The quality of FreshLeaf vegetables is unmatched. The delivery to Salt Lake was so fast!',
    rating: 5
  },
  {
    id: '2',
    name: 'Rahul Sen',
    location: 'Kolkata',
    comment: 'I love the bilingual names. It helps my mother order easily. Great initiative.',
    rating: 5
  },
  {
    id: '3',
    name: 'Vikram Singh',
    location: 'Kolkata',
    comment: 'Fresh mangoes were perfectly packed. Will definitely order again.',
    rating: 4
  }
];

export const MOCK_ORDERS: Order[] = [];
