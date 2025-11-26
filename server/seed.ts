import { storage } from "./storage";

export async function seedData() {
  console.log("🌱 Starting database seeding...");

  // Create 4 launch zones
  const zones = [
    { name: "Whitefield", isActive: true },
    { name: "Koramangala", isActive: true },
    { name: "HSR Layout", isActive: true },
    { name: "Indiranagar", isActive: true },
  ];

  const createdZones = [];
  for (const zone of zones) {
    const created = await storage.createZone(zone);
    createdZones.push(created);
    console.log(`✓ Created zone: ${zone.name}`);
  }

  // Create 5 poojas
  const poojas = [
    {
      name: "Griha Pravesh",
      slug: "griha-pravesh",
      description: "Traditional housewarming ceremony to invoke blessings for your new home. This sacred ritual purifies the space and invites prosperity, peace, and positive energy into your dwelling. Perfect for new homeowners seeking divine blessings.",
      durationMinutes: 90,
      basePricePriestOnlyMin: 2500,
      basePricePriestOnlyMax: 3500,
      basePriceWithKitMin: 4500,
      basePriceWithKitMax: 6000,
      isActive: true,
    },
    {
      name: "Satyanarayan Pooja",
      slug: "satyanarayan-pooja",
      description: "A powerful ceremony dedicated to Lord Vishnu for prosperity, health, and harmony. This traditional pooja brings peace to the household and is performed on auspicious occasions, festivals, or when seeking divine blessings for family welfare.",
      durationMinutes: 120,
      basePricePriestOnlyMin: 2000,
      basePricePriestOnlyMax: 3000,
      basePriceWithKitMin: 4000,
      basePriceWithKitMax: 5500,
      isActive: true,
    },
    {
      name: "Lakshmi Pooja",
      slug: "lakshmi-pooja",
      description: "Invoke the blessings of Goddess Lakshmi for wealth, prosperity, and abundance. This auspicious ceremony is especially popular during Diwali and for business openings. Experience divine grace and financial well-being through this sacred ritual.",
      durationMinutes: 75,
      basePricePriestOnlyMin: 1800,
      basePricePriestOnlyMax: 2500,
      basePriceWithKitMin: 3500,
      basePriceWithKitMax: 4500,
      isActive: true,
    },
    {
      name: "Ganesh Pooja",
      slug: "ganesh-pooja",
      description: "Begin any new venture with the blessings of Lord Ganesha, the remover of obstacles. This fundamental ceremony ensures success, wisdom, and smooth progress in all endeavors. Ideal for new beginnings, exams, or important life events.",
      durationMinutes: 60,
      basePricePriestOnlyMin: 1500,
      basePricePriestOnlyMax: 2000,
      basePriceWithKitMin: 3000,
      basePriceWithKitMax: 4000,
      isActive: true,
    },
    {
      name: "Rudrabhishek",
      slug: "rudrabhishek",
      description: "An elaborate ritual dedicated to Lord Shiva for health, peace, and spiritual growth. This powerful ceremony involves sacred chanting and abhishekam (ritual bathing) of the Shiva Lingam. Brings divine blessings and spiritual elevation to devotees.",
      durationMinutes: 150,
      basePricePriestOnlyMin: 3500,
      basePricePriestOnlyMax: 5000,
      basePriceWithKitMin: 6000,
      basePriceWithKitMax: 8000,
      isActive: true,
    },
  ];

  const createdPoojas = [];
  for (const pooja of poojas) {
    const created = await storage.createPooja(pooja);
    createdPoojas.push(created);
    console.log(`✓ Created pooja: ${pooja.name}`);
  }

  // Create sample priests
  const priests = [
    {
      fullName: "Pandit Ramesh Sharma",
      phone: "9876543210",
      primaryZoneId: createdZones[0].id, // Whitefield
      supportedLanguages: JSON.stringify(["kannada", "hindi"]),
      isActive: true,
    },
    {
      fullName: "Pandit Venkatesh Iyer",
      phone: "9876543211",
      primaryZoneId: createdZones[1].id, // Koramangala
      supportedLanguages: JSON.stringify(["kannada", "telugu"]),
      isActive: true,
    },
    {
      fullName: "Pandit Suresh Bhat",
      phone: "9876543212",
      primaryZoneId: createdZones[2].id, // HSR Layout
      supportedLanguages: JSON.stringify(["hindi", "telugu"]),
      isActive: true,
    },
    {
      fullName: "Pandit Krishna Murthy",
      phone: "9876543213",
      primaryZoneId: createdZones[3].id, // Indiranagar
      supportedLanguages: JSON.stringify(["kannada", "hindi", "telugu"]),
      isActive: true,
    },
  ];

  const createdPriests = [];
  for (const priest of priests) {
    const created = await storage.createPriest(priest);
    createdPriests.push(created);
    console.log(`✓ Created priest: ${priest.fullName}`);

    // Create priest zones (priests can serve multiple zones)
    for (const zone of createdZones) {
      await storage.createPriestZone({
        priestId: created.id,
        zoneId: zone.id,
      });
    }
  }

  // Create sample availability slots for next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const priest of createdPriests) {
    for (let day = 0; day < 7; day++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + day);

      // Morning slot: 8 AM - 12 PM
      const morningStart = new Date(slotDate);
      morningStart.setHours(8, 0, 0, 0);
      const morningEnd = new Date(slotDate);
      morningEnd.setHours(12, 0, 0, 0);

      await storage.createAvailabilitySlot({
        priestId: priest.id,
        startTime: morningStart,
        endTime: morningEnd,
        isBooked: false,
      });

      // Evening slot: 4 PM - 8 PM
      const eveningStart = new Date(slotDate);
      eveningStart.setHours(16, 0, 0, 0);
      const eveningEnd = new Date(slotDate);
      eveningEnd.setHours(20, 0, 0, 0);

      await storage.createAvailabilitySlot({
        priestId: priest.id,
        startTime: eveningStart,
        endTime: eveningEnd,
        isBooked: false,
      });
    }
    console.log(`✓ Created availability slots for ${priest.fullName}`);
  }

  console.log("✅ Database seeding completed successfully!");
  console.log(`   - ${createdZones.length} zones`);
  console.log(`   - ${createdPoojas.length} poojas`);
  console.log(`   - ${createdPriests.length} priests`);
  console.log(`   - ${createdPriests.length * 7 * 2} availability slots`);
}
