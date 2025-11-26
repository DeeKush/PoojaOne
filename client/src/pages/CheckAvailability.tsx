import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBookingSchema, type Pooja, type Zone } from "@shared/schema";

// Extend shared schema with UI-specific validation
const bookingFormSchema = insertBookingSchema.extend({
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  customerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
  withKit: z.enum(["false", "true"]),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function CheckAvailability() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPoojaId, setSelectedPoojaId] = useState<string>("");

  const { data: poojas } = useQuery<Pooja[]>({
    queryKey: ["/api/poojas"],
  });

  const { data: zones } = useQuery<Zone[]>({
    queryKey: ["/api/zones"],
  });

  // Get URL params to pre-select pooja
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const poojaSlug = params.get("pooja");
    if (poojaSlug && poojas) {
      const pooja = poojas.find((p) => p.slug === poojaSlug);
      if (pooja) {
        setSelectedPoojaId(pooja.id);
        form.setValue("poojaId", pooja.id);
      }
    }
  }, [poojas]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      poojaId: "",
      zoneId: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      pincode: "",
      preferredLanguage: "",
      withKit: "false",
      bookingDate: "",
      bookingStartTime: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Backend will calculate end time based on pooja duration
      const payload = {
        poojaId: data.poojaId,
        zoneId: data.zoneId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        landmark: data.landmark || null,
        pincode: data.pincode,
        preferredLanguage: data.preferredLanguage || null,
        withKit: data.withKit === "true",
        bookingDate: data.bookingDate,
        bookingStartTime: data.bookingStartTime,
        status: "pending_confirmation",
        assignedPriestId: null,
      };

      return await apiRequest("POST", "/api/bookings", payload);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Booking Submitted",
        description: "Your booking request has been received.",
      });
      navigate(`/booking/${data.booking.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const selectedPooja = poojas?.find((p) => p.id === selectedPoojaId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-serif" style={{ color: 'hsl(var(--primary))' }}>
                Check Availability
              </CardTitle>
              <CardDescription>
                Fill in your details to book a pandit for your pooja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createBookingMutation.mutate(data))} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Selection</h3>
                    
                    <FormField
                      control={form.control}
                      name="poojaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Pooja *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedPoojaId(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-pooja">
                                <SelectValue placeholder="Choose a pooja" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {poojas?.map((pooja) => (
                                <SelectItem key={pooja.id} value={pooja.id}>
                                  {pooja.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zoneId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-zone">
                                <SelectValue placeholder="Select your area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {zones?.map((zone) => (
                                <SelectItem key={zone.id} value={zone.id}>
                                  {zone.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bookingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-date" min={new Date().toISOString().split('T')[0]} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bookingStartTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Preferences</h3>

                    <FormField
                      control={form.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Language</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-language">
                                <SelectValue placeholder="No preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Preference</SelectItem>
                              <SelectItem value="kannada">Kannada</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                              <SelectItem value="telugu">Telugu</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="withKit"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Service Type *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem
                                  value="false"
                                  id="priest-only"
                                  className="peer sr-only"
                                  data-testid="radio-priest-only"
                                />
                                <label
                                  htmlFor="priest-only"
                                  className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary"
                                >
                                  <div className="font-semibold">Priest Only</div>
                                  <div className="text-sm text-muted-foreground">You arrange materials</div>
                                  {selectedPooja && (
                                    <div className="text-lg font-bold mt-2" style={{ color: 'hsl(var(--gold))' }}>
                                      ₹{selectedPooja.basePricePriestOnlyMin.toLocaleString()} - ₹{selectedPooja.basePricePriestOnlyMax.toLocaleString()}
                                    </div>
                                  )}
                                </label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="true"
                                  id="with-kit"
                                  className="peer sr-only"
                                  data-testid="radio-with-kit"
                                />
                                <label
                                  htmlFor="with-kit"
                                  className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary"
                                >
                                  <div className="font-semibold">Priest Brings Materials</div>
                                  <div className="text-sm text-muted-foreground">Complete pooja kit included</div>
                                  {selectedPooja && (
                                    <div className="text-lg font-bold mt-2" style={{ color: 'hsl(var(--gold))' }}>
                                      ₹{selectedPooja.basePriceWithKitMin.toLocaleString()} - ₹{selectedPooja.basePriceWithKitMax.toLocaleString()}
                                    </div>
                                  )}
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-name" placeholder="Enter your full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-phone" placeholder="10-digit mobile number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" data-testid="input-email" placeholder="your.email@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address</h3>

                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1 *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-address1" placeholder="Flat/House No, Building Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-address2" placeholder="Street, Area" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Landmark (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-landmark" placeholder="Nearby landmark" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-pincode" placeholder="6-digit pincode" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={createBookingMutation.isPending}
                    data-testid="button-submit-booking"
                  >
                    {createBookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
