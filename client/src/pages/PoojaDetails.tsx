import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Clock, ArrowLeft } from "lucide-react";
import type { Pooja } from "@shared/schema";

export default function PoojaDetails() {
  const { slug } = useParams();
  
  const { data: pooja, isLoading, error } = useQuery<Pooja>({
    queryKey: ["/api/poojas", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-muted rounded mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pooja) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Pooja not found</p>
              <Link href="/">
                <Button className="mt-4">Go Back Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-4 font-serif"
                  style={{ color: 'hsl(var(--primary))' }}
                  data-testid="text-pooja-name"
                >
                  {pooja.name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg" data-testid="text-duration">
                    Duration: {pooja.durationMinutes} minutes
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Pooja</h2>
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-description">
                  {pooja.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">What the Priest Provides</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Expertise and traditional knowledge of the ritual</li>
                  <li>Proper chanting of mantras and shlokas</li>
                  <li>Guidance throughout the pooja ceremony</li>
                  <li>Blessings and completion of all rituals</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">What You Should Arrange</h2>
                <p className="text-muted-foreground mb-3">
                  If you choose "Priest Only" option, please arrange:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Clean space for the pooja</li>
                  <li>Pooja materials (we'll provide a detailed checklist upon booking)</li>
                  <li>Comfortable seating arrangement</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Or choose "Priest Brings Materials" option for a completely hassle-free experience!
                </p>
              </div>
            </div>

            {/* Right Column - Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book This Pooja</CardTitle>
                  <CardDescription>Choose your preferred option</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Priest Only</h3>
                    </div>
                    <p 
                      className="text-2xl font-bold"
                      style={{ color: 'hsl(var(--gold))' }}
                      data-testid="text-price-priest-only"
                    >
                      ₹{pooja.basePricePriestOnlyMin.toLocaleString()} - ₹{pooja.basePricePriestOnlyMax.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You arrange pooja materials
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Priest Brings Materials</h3>
                    </div>
                    <p 
                      className="text-2xl font-bold"
                      style={{ color: 'hsl(var(--gold))' }}
                      data-testid="text-price-with-kit"
                    >
                      ₹{pooja.basePriceWithKitMin.toLocaleString()} - ₹{pooja.basePriceWithKitMax.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete pooja kit included
                    </p>
                  </div>

                  <Link href={`/check-availability?pooja=${pooja.slug}`} className="block">
                    <Button className="w-full" size="lg" data-testid="button-check-availability">
                      Check Availability
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
