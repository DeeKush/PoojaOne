import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Public API Routes

  // GET /api/poojas - List all active poojas
  app.get("/api/poojas", async (_req, res) => {
    try {
      const poojas = await storage.getPoojas();
      res.json(poojas);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch poojas" });
    }
  });

  // GET /api/poojas/:slug - Get pooja details by slug
  app.get("/api/poojas/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const pooja = await storage.getPoojaBySlug(slug);
      
      if (!pooja) {
        return res.status(404).json({ message: "Pooja not found" });
      }
      
      res.json(pooja);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch pooja" });
    }
  });

  // GET /api/zones - List all active zones
  app.get("/api/zones", async (_req, res) => {
    try {
      const zones = await storage.getZones();
      res.json(zones);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch zones" });
    }
  });

  // POST /api/bookings - Create a new booking with hybrid logic
  app.post("/api/bookings", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertBookingSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid booking data",
          errors: validationResult.error.errors,
        });
      }

      const bookingData = validationResult.data;

      // Get pooja to calculate end time
      const pooja = await storage.getPooja(bookingData.poojaId);
      if (!pooja) {
        return res.status(400).json({ message: "Invalid pooja selected" });
      }

      // Calculate booking end time based on start time and pooja duration
      const [startHours, startMinutes] = bookingData.bookingStartTime.split(":").map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = startTotalMinutes + pooja.durationMinutes;
      const endHours = Math.floor(endTotalMinutes / 60);
      const endMinutes = endTotalMinutes % 60;
      const bookingEndTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;

      // Hybrid booking logic: Try to auto-confirm
      let assignedPriestId: string | null = null;
      let status = "pending_confirmation";
      let message = "Your booking request is received. Our team will confirm availability shortly.";

      // Get all active priests
      const allPriests = await storage.getPriests();

      // Filter priests by zone and language preference
      const eligiblePriests = await Promise.all(
        allPriests.map(async (priest) => {
          // Check if priest serves this zone
          const priestZones = await storage.getPriestZones(priest.id);
          const servesZone = priestZones.some((pz) => pz.zoneId === bookingData.zoneId);
          
          if (!servesZone && priest.primaryZoneId !== bookingData.zoneId) {
            return null;
          }

          // Check language preference if provided
          if (bookingData.preferredLanguage) {
            const supportedLanguages = JSON.parse(priest.supportedLanguages);
            if (!supportedLanguages.includes(bookingData.preferredLanguage)) {
              return null;
            }
          }

          return priest;
        })
      ).then((priests) => priests.filter((p) => p !== null));

      // Check availability for eligible priests
      if (eligiblePriests.length > 0) {
        // Construct requested datetime range
        const requestedDate = new Date(bookingData.bookingDate);
        
        const requestedStart = new Date(requestedDate);
        requestedStart.setHours(startHours, startMinutes, 0, 0);
        
        const requestedEnd = new Date(requestedDate);
        requestedEnd.setHours(endHours, endMinutes, 0, 0);

        // Find first available priest
        for (const priest of eligiblePriests) {
          const slots = await storage.getAvailabilitySlots(priest.id);
          
          // Find a free slot that covers the requested time
          const availableSlot = slots.find((slot) => {
            if (slot.isBooked) return false;
            
            const slotStart = new Date(slot.startTime);
            const slotEnd = new Date(slot.endTime);
            
            // Check if slot covers requested time
            return slotStart <= requestedStart && slotEnd >= requestedEnd;
          });

          if (availableSlot) {
            // Found available priest - auto-confirm
            assignedPriestId = priest.id;
            status = "confirmed";
            message = "Your booking is confirmed. We'll share priest details soon.";
            
            // Mark slot as booked
            await storage.updateAvailabilitySlot(availableSlot.id, { isBooked: true });
            break;
          }
        }
      }

      // Create booking with calculated end time
      const booking = await storage.createBooking({
        ...bookingData,
        bookingEndTime,
        status,
        assignedPriestId,
      });

      res.status(201).json({
        booking,
        message,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create booking" });
    }
  });

  // GET /api/bookings/:id - Get booking details
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Fetch related pooja and zone data
      const pooja = booking.poojaId ? await storage.getPooja(booking.poojaId) : undefined;
      const zone = booking.zoneId ? await storage.getZone(booking.zoneId) : undefined;

      res.json({
        ...booking,
        pooja,
        zone,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch booking" });
    }
  });

  // Admin API Routes (basic implementation)

  // GET /api/admin/bookings - List all bookings
  app.get("/api/admin/bookings", async (_req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch bookings" });
    }
  });

  // PATCH /api/admin/bookings/:id - Update booking
  app.patch("/api/admin/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, assignedPriestId } = req.body;
      
      const updates: any = {};
      if (status) updates.status = status;
      if (assignedPriestId !== undefined) updates.assignedPriestId = assignedPriestId;
      
      const booking = await storage.updateBooking(id, updates);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update booking" });
    }
  });

  // GET /api/admin/priests - List all priests
  app.get("/api/admin/priests", async (_req, res) => {
    try {
      const priests = await storage.getPriests();
      res.json(priests);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch priests" });
    }
  });

  // POST /api/admin/priests - Create a priest
  app.post("/api/admin/priests", async (req, res) => {
    try {
      const { fullName, phone, primaryZoneId, supportedLanguages, isActive } = req.body;
      
      if (!fullName || !phone || !supportedLanguages) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const priest = await storage.createPriest({
        fullName,
        phone,
        primaryZoneId: primaryZoneId || null,
        supportedLanguages: typeof supportedLanguages === 'string' 
          ? supportedLanguages 
          : JSON.stringify(supportedLanguages),
        isActive: isActive ?? true,
      });

      res.status(201).json(priest);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create priest" });
    }
  });

  return httpServer;
}
