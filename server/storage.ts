import {
  type Zone,
  type InsertZone,
  type Pooja,
  type InsertPooja,
  type Priest,
  type InsertPriest,
  type PriestZone,
  type InsertPriestZone,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type Booking,
  type InsertBooking,
  type Admin,
  type InsertAdmin,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Zones
  getZones(): Promise<Zone[]>;
  getZone(id: string): Promise<Zone | undefined>;
  createZone(zone: InsertZone): Promise<Zone>;

  // Poojas
  getPoojas(): Promise<Pooja[]>;
  getPooja(id: string): Promise<Pooja | undefined>;
  getPoojaBySlug(slug: string): Promise<Pooja | undefined>;
  createPooja(pooja: InsertPooja): Promise<Pooja>;

  // Priests
  getPriests(): Promise<Priest[]>;
  getPriest(id: string): Promise<Priest | undefined>;
  createPriest(priest: InsertPriest): Promise<Priest>;

  // Priest Zones
  createPriestZone(priestZone: InsertPriestZone): Promise<PriestZone>;
  getPriestZones(priestId: string): Promise<PriestZone[]>;

  // Availability Slots
  getAvailabilitySlots(priestId: string): Promise<AvailabilitySlot[]>;
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined>;

  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Admins
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private zones: Map<string, Zone>;
  private poojas: Map<string, Pooja>;
  private priests: Map<string, Priest>;
  private priestZones: Map<string, PriestZone>;
  private availabilitySlots: Map<string, AvailabilitySlot>;
  private bookings: Map<string, Booking>;
  private admins: Map<string, Admin>;

  constructor() {
    this.zones = new Map();
    this.poojas = new Map();
    this.priests = new Map();
    this.priestZones = new Map();
    this.availabilitySlots = new Map();
    this.bookings = new Map();
    this.admins = new Map();
  }

  // Zones
  async getZones(): Promise<Zone[]> {
    return Array.from(this.zones.values()).filter((z) => z.isActive);
  }

  async getZone(id: string): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = randomUUID();
    const zone: Zone = { id, ...insertZone };
    this.zones.set(id, zone);
    return zone;
  }

  // Poojas
  async getPoojas(): Promise<Pooja[]> {
    return Array.from(this.poojas.values()).filter((p) => p.isActive);
  }

  async getPooja(id: string): Promise<Pooja | undefined> {
    return this.poojas.get(id);
  }

  async getPoojaBySlug(slug: string): Promise<Pooja | undefined> {
    return Array.from(this.poojas.values()).find((p) => p.slug === slug);
  }

  async createPooja(insertPooja: InsertPooja): Promise<Pooja> {
    const id = randomUUID();
    const pooja: Pooja = { id, ...insertPooja };
    this.poojas.set(id, pooja);
    return pooja;
  }

  // Priests
  async getPriests(): Promise<Priest[]> {
    return Array.from(this.priests.values()).filter((p) => p.isActive);
  }

  async getPriest(id: string): Promise<Priest | undefined> {
    return this.priests.get(id);
  }

  async createPriest(insertPriest: InsertPriest): Promise<Priest> {
    const id = randomUUID();
    const priest: Priest = { id, ...insertPriest };
    this.priests.set(id, priest);
    return priest;
  }

  // Priest Zones
  async createPriestZone(insertPriestZone: InsertPriestZone): Promise<PriestZone> {
    const id = randomUUID();
    const priestZone: PriestZone = { id, ...insertPriestZone };
    this.priestZones.set(id, priestZone);
    return priestZone;
  }

  async getPriestZones(priestId: string): Promise<PriestZone[]> {
    return Array.from(this.priestZones.values()).filter((pz) => pz.priestId === priestId);
  }

  // Availability Slots
  async getAvailabilitySlots(priestId: string): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values()).filter(
      (slot) => slot.priestId === priestId
    );
  }

  async createAvailabilitySlot(insertSlot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const id = randomUUID();
    const slot: AvailabilitySlot = { id, ...insertSlot };
    this.availabilitySlots.set(id, slot);
    return slot;
  }

  async updateAvailabilitySlot(
    id: string,
    updates: Partial<AvailabilitySlot>
  ): Promise<AvailabilitySlot | undefined> {
    const slot = this.availabilitySlots.get(id);
    if (!slot) return undefined;

    const updated = { ...slot, ...updates };
    this.availabilitySlots.set(id, updated);
    return updated;
  }

  // Bookings
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = {
      id,
      ...insertBooking,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(
    id: string,
    updates: Partial<Booking>
  ): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updated = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  // Admins
  async getAdmin(id: string): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find((a) => a.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { id, ...insertAdmin };
    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
