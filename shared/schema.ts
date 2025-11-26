import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, time, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zones = pgTable("zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const poojas = pgTable("poojas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  basePricePriestOnlyMin: integer("base_price_priest_only_min").notNull(),
  basePricePriestOnlyMax: integer("base_price_priest_only_max").notNull(),
  basePriceWithKitMin: integer("base_price_with_kit_min").notNull(),
  basePriceWithKitMax: integer("base_price_with_kit_max").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const priests = pgTable("priests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  primaryZoneId: varchar("primary_zone_id").references(() => zones.id),
  supportedLanguages: text("supported_languages").notNull(), // JSON string array
  isActive: boolean("is_active").notNull().default(true),
});

export const priestZones = pgTable("priest_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  priestId: varchar("priest_id").notNull().references(() => priests.id),
  zoneId: varchar("zone_id").notNull().references(() => zones.id),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  priestId: varchar("priest_id").notNull().references(() => priests.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isBooked: boolean("is_booked").notNull().default(false),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poojaId: varchar("pooja_id").notNull().references(() => poojas.id),
  zoneId: varchar("zone_id").notNull().references(() => zones.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  landmark: text("landmark"),
  pincode: text("pincode").notNull(),
  preferredLanguage: text("preferred_language"), // "kannada" | "hindi" | "telugu"
  withKit: boolean("with_kit").notNull(),
  bookingDate: date("booking_date").notNull(),
  bookingStartTime: time("booking_start_time").notNull(),
  bookingEndTime: time("booking_end_time").notNull(),
  status: text("status").notNull(), // "pending_confirmation" | "confirmed" | "cancelled"
  assignedPriestId: varchar("assigned_priest_id").references(() => priests.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isSuperadmin: boolean("is_superadmin").notNull().default(false),
});

// Insert schemas
export const insertZoneSchema = createInsertSchema(zones).omit({ id: true });
export const insertPoojaSchema = createInsertSchema(poojas).omit({ id: true });
export const insertPriestSchema = createInsertSchema(priests).omit({ id: true });
export const insertPriestZoneSchema = createInsertSchema(priestZones).omit({ id: true });
export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({ id: true });
// Make bookingEndTime, status, and assignedPriestId optional - backend will compute them
export const insertBookingSchema = createInsertSchema(bookings)
  .omit({ id: true, createdAt: true, updatedAt: true, bookingEndTime: true, status: true, assignedPriestId: true })
  .extend({
    // Allow optional fields that frontend doesn't send
    status: z.string().optional(),
    assignedPriestId: z.string().optional(),
  });
export const insertAdminSchema = createInsertSchema(admins).omit({ id: true });

// Types
export type Zone = typeof zones.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;

export type Pooja = typeof poojas.$inferSelect;
export type InsertPooja = z.infer<typeof insertPoojaSchema>;

export type Priest = typeof priests.$inferSelect;
export type InsertPriest = z.infer<typeof insertPriestSchema>;

export type PriestZone = typeof priestZones.$inferSelect;
export type InsertPriestZone = z.infer<typeof insertPriestZoneSchema>;

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
