import burjKhalifa from "@/assets/burj-khalifa.jpg";
import desertSafari from "@/assets/desert-safari.jpg";
import yachtTour from "@/assets/yacht-tour.jpg";
import dubaiFountain from "@/assets/dubai-fountain.jpg";
import atlantisPalm from "@/assets/atlantis-palm.jpg";

export interface Activity {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  location: string;
  category: string;
  tags: string[];
  openingHours: string;
  instantConfirmation: boolean;
  bestTime: string;
  whatToExpect: string[];
  inclusions: string[];
  exclusions: string[];
  dressCode: string;
  ageRequirements: string;
  cancellationPolicy: string;
  timeSlots: string[];
}

export const activities: Activity[] = [
  {
    id: "burj-khalifa-at-the-top",
    title: "Burj Khalifa At The Top",
    description: "Experience breathtaking 360-degree views from the world's tallest building. Visit the iconic observation decks on levels 124, 125, and 148 for an unforgettable panoramic view of Dubai's stunning skyline, the Arabian Gulf, and the surrounding desert.",
    shortDescription: "World's tallest building observation deck experience",
    image: burjKhalifa,
    price: 149,
    originalPrice: 189,
    rating: 4.9,
    reviewCount: 12847,
    duration: "2-3 hours",
    location: "Downtown Dubai",
    category: "Attractions",
    tags: ["Iconic", "Family-Friendly", "Photography"],
    openingHours: "8:00 AM - 11:00 PM",
    instantConfirmation: true,
    bestTime: "Sunset (5:30 PM - 7:00 PM) for the most spectacular views",
    whatToExpect: [
      "High-speed elevator journey reaching observation deck in 60 seconds",
      "Interactive multimedia presentations about Dubai's history",
      "Outdoor terrace access with 360-degree views",
      "Photo opportunities at world's highest observation deck",
      "Café with refreshments available"
    ],
    inclusions: [
      "Entry ticket to At The Top observation decks",
      "Multimedia tour guide",
      "Commemorative photo opportunity"
    ],
    exclusions: [
      "Food and beverages",
      "Hotel pickup and drop-off",
      "Private guide"
    ],
    dressCode: "Smart casual recommended. Shoulders and knees should be covered.",
    ageRequirements: "Open to all ages. Children under 4 enter free.",
    cancellationPolicy: "Free cancellation up to 24 hours before the experience",
    timeSlots: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
  },
  {
    id: "dubai-desert-safari",
    title: "Premium Desert Safari Adventure",
    description: "Embark on an exhilarating journey into the golden dunes of Dubai. Experience heart-pounding dune bashing, camel riding, sandboarding, and a magical evening under the stars with authentic BBQ dinner and live entertainment.",
    shortDescription: "Ultimate desert adventure with BBQ dinner & entertainment",
    image: desertSafari,
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewCount: 8934,
    duration: "6-7 hours",
    location: "Dubai Desert Conservation Reserve",
    category: "Adventure",
    tags: ["Adventure", "Cultural", "Family-Friendly"],
    openingHours: "Pickup at 3:00 PM",
    instantConfirmation: true,
    bestTime: "October to April for comfortable temperatures",
    whatToExpect: [
      "Pickup from your hotel in luxury 4x4 Land Cruiser",
      "30-minute thrilling dune bashing experience",
      "Camel riding across the desert",
      "Sandboarding on pristine dunes",
      "Henna painting and traditional Arabic attire",
      "Lavish BBQ dinner under the stars",
      "Live belly dancing and Tanoura show"
    ],
    inclusions: [
      "Hotel pickup and drop-off",
      "Professional safari guide",
      "All activities mentioned",
      "Unlimited soft drinks and water",
      "BBQ dinner with vegetarian options",
      "Traditional Arabic coffee and dates"
    ],
    exclusions: [
      "Alcoholic beverages",
      "Quad biking (available at extra cost)",
      "Professional photography"
    ],
    dressCode: "Comfortable, loose-fitting clothes. Closed-toe shoes recommended.",
    ageRequirements: "Minimum age 3 years. Dune bashing not recommended for pregnant women.",
    cancellationPolicy: "Free cancellation up to 48 hours before the experience",
    timeSlots: ["15:00", "15:30", "16:00"]
  },
  {
    id: "luxury-yacht-cruise",
    title: "Luxury Yacht Cruise Marina",
    description: "Sail through Dubai's glittering Marina on a private luxury yacht. Enjoy stunning views of iconic skyscrapers, Ain Dubai, JBR Beach, and Palm Jumeirah while indulging in gourmet refreshments and world-class service.",
    shortDescription: "Private yacht experience with stunning skyline views",
    image: yachtTour,
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: 3421,
    duration: "2-3 hours",
    location: "Dubai Marina",
    category: "Luxury",
    tags: ["Luxury", "Romantic", "Photography"],
    openingHours: "Multiple departures daily",
    instantConfirmation: true,
    bestTime: "Sunset cruise for magical golden hour photography",
    whatToExpect: [
      "Welcome aboard with sparkling refreshments",
      "Cruise past Dubai Marina's stunning architecture",
      "Views of Ain Dubai, the world's largest observation wheel",
      "Sail around Palm Jumeirah",
      "Swimming and water activities (optional)",
      "Professional crew at your service"
    ],
    inclusions: [
      "Private yacht charter",
      "Welcome drinks and canapes",
      "Professional captain and crew",
      "Swimming equipment",
      "Fishing equipment",
      "Bluetooth music system"
    ],
    exclusions: [
      "Alcoholic beverages",
      "Full meal packages",
      "Water sports equipment"
    ],
    dressCode: "Resort casual. Swimwear recommended. Bring sunscreen.",
    ageRequirements: "All ages welcome. Life jackets provided for children.",
    cancellationPolicy: "Free cancellation up to 72 hours before departure",
    timeSlots: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"]
  },
  {
    id: "dubai-fountain-show",
    title: "Dubai Fountain Show & Lake Ride",
    description: "Witness the world's largest choreographed fountain system from an exclusive traditional Abra boat. Get up close to the spectacular water, music, and light show set against the backdrop of Burj Khalifa.",
    shortDescription: "Magical fountain show from traditional boat ride",
    image: dubaiFountain,
    price: 79,
    originalPrice: 99,
    rating: 4.7,
    reviewCount: 15632,
    duration: "30 minutes",
    location: "Downtown Dubai, Burj Lake",
    category: "Attractions",
    tags: ["Romantic", "Family-Friendly", "Evening"],
    openingHours: "Shows every 30 mins from 6:00 PM - 11:00 PM",
    instantConfirmation: true,
    bestTime: "8:00 PM or 9:00 PM for best ambiance",
    whatToExpect: [
      "Board a traditional Abra boat",
      "Front-row seats to the fountain spectacle",
      "Water jets reaching up to 150 meters",
      "Choreographed to world music",
      "Stunning Burj Khalifa backdrop",
      "Professional photography moments"
    ],
    inclusions: [
      "30-minute lake ride",
      "One fountain show viewing",
      "Traditional Abra boat experience",
      "Bottled water"
    ],
    exclusions: [
      "Food and beverages",
      "Transportation",
      "Burj Khalifa tickets"
    ],
    dressCode: "Casual attire suitable for outdoor activity.",
    ageRequirements: "Suitable for all ages.",
    cancellationPolicy: "Free cancellation up to 24 hours before the show",
    timeSlots: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"]
  },
  {
    id: "atlantis-aquaventure",
    title: "Atlantis Aquaventure Waterpark",
    description: "Dive into the ultimate water adventure at the Middle East's largest waterpark. With record-breaking slides, a private beach, and The Lost Chambers Aquarium, Aquaventure offers endless thrills for the whole family.",
    shortDescription: "Middle East's largest waterpark adventure",
    image: atlantisPalm,
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviewCount: 21456,
    duration: "Full Day",
    location: "Palm Jumeirah",
    category: "Theme Parks",
    tags: ["Family-Friendly", "Adventure", "Beach"],
    openingHours: "10:00 AM - 6:00 PM",
    instantConfirmation: true,
    bestTime: "Weekdays for shorter queues",
    whatToExpect: [
      "Access to 105 slides and attractions",
      "Private beach access",
      "The Lost Chambers Aquarium entry",
      "Lazy river adventure",
      "World's largest waterslide",
      "Kids' splash zones"
    ],
    inclusions: [
      "Full-day park access",
      "Private beach access",
      "The Lost Chambers Aquarium",
      "Locker and towel",
      "Free parking"
    ],
    exclusions: [
      "Food and beverages",
      "Cabana rentals",
      "Dolphin experiences"
    ],
    dressCode: "Swimwear required for water attractions. Cover-ups for dining areas.",
    ageRequirements: "Height restrictions apply for certain slides. Children under 3 free.",
    cancellationPolicy: "Free cancellation up to 24 hours before visit",
    timeSlots: ["10:00", "10:30", "11:00", "11:30", "12:00"]
  }
];

export interface ComboDeal {
  id: string;
  title: string;
  description: string;
  activities: string[]; // Activity IDs
  totalOriginalPrice: number;
  comboPrice: number;
  savings: number;
  savingsPercent: number;
  image: string;
  duration: string;
  highlights: string[];
  bestFor: string[];
  validUntil: string;
  popular?: boolean;
}

export const comboDeals: ComboDeal[] = [
  {
    id: "dubai-essentials",
    title: "Dubai Essentials Combo",
    description: "Experience the must-see icons of Dubai in one incredible package. Perfect for first-time visitors who want to see the best of the city.",
    activities: ["burj-khalifa-at-the-top", "dubai-fountain-show"],
    totalOriginalPrice: 288,
    comboPrice: 199,
    savings: 89,
    savingsPercent: 31,
    image: burjKhalifa,
    duration: "1 Day",
    highlights: [
      "World's tallest building observation deck",
      "Iconic Dubai Fountain lake ride",
      "Perfect Instagram-worthy moments",
      "Flexible scheduling"
    ],
    bestFor: ["First-time visitors", "Couples", "Photography enthusiasts"],
    validUntil: "2025-12-31",
    popular: true
  },
  {
    id: "ultimate-adventure",
    title: "Ultimate Adventure Package",
    description: "Thrill-seekers rejoice! Combine the desert's adrenaline rush with the waterpark's record-breaking slides for the ultimate Dubai adventure.",
    activities: ["dubai-desert-safari", "atlantis-aquaventure"],
    totalOriginalPrice: 598,
    comboPrice: 449,
    savings: 149,
    savingsPercent: 25,
    image: desertSafari,
    duration: "2 Days",
    highlights: [
      "Desert dune bashing & BBQ dinner",
      "105+ waterpark slides & attractions",
      "Camel riding & sandboarding",
      "Private beach access"
    ],
    bestFor: ["Adventure seekers", "Families with teens", "Thrill lovers"],
    validUntil: "2025-12-31"
  },
  {
    id: "luxury-dubai",
    title: "Luxury Dubai Experience",
    description: "Indulge in Dubai's finest experiences with a private yacht cruise and VIP access to Burj Khalifa. The ultimate luxury package.",
    activities: ["luxury-yacht-cruise", "burj-khalifa-at-the-top"],
    totalOriginalPrice: 638,
    comboPrice: 449,
    savings: 189,
    savingsPercent: 30,
    image: yachtTour,
    duration: "1 Day",
    highlights: [
      "Private luxury yacht charter",
      "Burj Khalifa sunset slot",
      "Welcome champagne on yacht",
      "Priority access, skip the queues"
    ],
    bestFor: ["Couples", "Honeymoons", "Special occasions"],
    validUntil: "2025-12-31",
    popular: true
  },
  {
    id: "family-fun",
    title: "Family Fun Bundle",
    description: "Create unforgettable family memories with this perfect combination of entertainment, adventure, and magical experiences.",
    activities: ["atlantis-aquaventure", "dubai-fountain-show", "burj-khalifa-at-the-top"],
    totalOriginalPrice: 537,
    comboPrice: 399,
    savings: 138,
    savingsPercent: 26,
    image: atlantisPalm,
    duration: "2 Days",
    highlights: [
      "Full day at Aquaventure waterpark",
      "Views from world's tallest building",
      "Magical fountain show experience",
      "Activities for all ages"
    ],
    bestFor: ["Families with kids", "Multi-generational trips", "Fun seekers"],
    validUntil: "2025-12-31"
  },
  {
    id: "complete-dubai",
    title: "Complete Dubai Discovery",
    description: "The ultimate Dubai experience package. See everything from the desert to the skyline to the sea. Miss nothing!",
    activities: ["burj-khalifa-at-the-top", "dubai-desert-safari", "luxury-yacht-cruise", "dubai-fountain-show"],
    totalOriginalPrice: 986,
    comboPrice: 699,
    savings: 287,
    savingsPercent: 29,
    image: yachtTour,
    duration: "3 Days",
    highlights: [
      "4 iconic experiences in one package",
      "Desert, sea, and sky adventures",
      "Flexible multi-day scheduling",
      "Concierge booking service included"
    ],
    bestFor: ["Extended stays", "Bucket list travelers", "Experience seekers"],
    validUntil: "2025-12-31",
    popular: true
  }
];

export const categories = [
  "All",
  "Attractions",
  "Adventure", 
  "Luxury",
  "Theme Parks",
  "Cultural"
];

export const getActivityById = (id: string): Activity | undefined => {
  return activities.find(activity => activity.id === id);
};

export const getComboById = (id: string): ComboDeal | undefined => {
  return comboDeals.find(combo => combo.id === id);
};

export const getActivitiesForCombo = (combo: ComboDeal): Activity[] => {
  return combo.activities
    .map(id => getActivityById(id))
    .filter((activity): activity is Activity => activity !== undefined);
};