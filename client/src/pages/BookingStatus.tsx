import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, Clock, XCircle, Home } from "lucide-react";
import type { Booking, Pooja, Zone } from "@shared/schema";

export default function BookingStatus() {
  const { id } = useParams();

  const { data: booking, isLoading, error } = useQuery<Booking & { pooja?: Pooja; zone?: Zone }>({
    queryKey: ["/api/bookings", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4" />
            <div className="h-6 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find the booking you're looking for.
              </p>
              <Link href="/">
                <Button>Go Back Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (booking.status) {
      case "confirmed":
        return <CheckCircle className="w-20 h-20 text-green-500" data-testid="icon-confirmed" />;
      case "pending_confirmation":
        return <Clock className="w-20 h-20 text-yellow-500" data-testid="icon-pending" />;
      case "cancelled":
        return <XCircle className="w-20 h-20 text-destructive" data-testid="icon-cancelled" />;
      default:
        return <Clock className="w-20 h-20 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (booking.status) {
      case "confirmed":
        return {
          title: "Your Booking is Confirmed!",
          description: "Your booking has been confirmed. We'll share priest details soon.",
          variant: "default" as const,
        };
      case "pending_confirmation":
        return {
          title: "Booking Pending Confirmation",
          description: "Your booking request has been received. Our team will confirm availability shortly.",
          variant: "secondary" as const,
        };
      case "cancelled":
        return {
          title: "Booking Cancelled",
          description: "This booking has been cancelled.",
          variant: "destructive" as const,
        };
      default:
        return {
          title: "Booking Status Unknown",
          description: "Please contact support for more information.",
          variant: "secondary" as const,
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center pb-0">
              <div className="flex justify-center mb-4">
                {getStatusIcon()}
              </div>
              <CardTitle className="text-3xl font-serif" data-testid="text-status-title">
                {statusMessage.title}
              </CardTitle>
              <CardDescription className="text-base" data-testid="text-status-description">
                {statusMessage.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Booking ID</span>
                  <Badge variant="outline" data-testid="text-booking-id">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </Badge>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Pooja</span>
                  <span className="font-semibold" data-testid="text-booking-pooja">
                    {booking.pooja?.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Zone</span>
                  <span className="font-semibold" data-testid="text-booking-zone">
                    {booking.zone?.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Date & Time</span>
                  <span className="font-semibold" data-testid="text-booking-datetime">
                    {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingStartTime}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Service Type</span>
                  <span className="font-semibold" data-testid="text-booking-service-type">
                    {booking.withKit ? "With Materials" : "Priest Only"}
                  </span>
                </div>

                {booking.preferredLanguage && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Preferred Language</span>
                    <span className="font-semibold capitalize" data-testid="text-booking-language">
                      {booking.preferredLanguage}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Customer Name</span>
                  <span className="font-semibold" data-testid="text-customer-name">
                    {booking.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Contact</span>
                  <span className="font-semibold" data-testid="text-customer-phone">
                    {booking.customerPhone}
                  </span>
                </div>

                {booking.customerEmail && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <span className="font-semibold text-sm" data-testid="text-customer-email">
                      {booking.customerEmail}
                    </span>
                  </div>
                )}

                <Separator />

                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-2">Address</span>
                  <div className="text-sm" data-testid="text-booking-address">
                    <p>{booking.addressLine1}</p>
                    {booking.addressLine2 && <p>{booking.addressLine2}</p>}
                    {booking.landmark && <p>Landmark: {booking.landmark}</p>}
                    <p>Pincode: {booking.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full" data-testid="button-back-home">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>

              {booking.status === "pending_confirmation" && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Our team will contact you shortly to confirm your booking details.
                    You will receive a confirmation call or message within 24 hours.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
