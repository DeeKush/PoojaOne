import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, Clock, MapPin, Shield, Star, Users } from "lucide-react";
import type { Pooja, Zone } from "@shared/schema";
import heroImage from "@assets/generated_images/pandit_performing_pooja_modern_home.png";

export default function Home() {
  const { data: poojas, isLoading: poojasLoading } = useQuery<Pooja[]>({
    queryKey: ["/api/poojas"],
  });

  const { data: zones, isLoading: zonesLoading } = useQuery<Zone[]>({
    queryKey: ["/api/zones"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            data-testid="text-hero-headline"
          >
            Get a verified pandit at your home when you need them
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Convenient and trusted pooja services for busy Bengaluru professionals
          </p>
          <Link href="/check-availability">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover-elevate active-elevate-2 text-lg px-8 py-6 h-auto backdrop-blur-sm"
              data-testid="button-hero-cta"
            >
              Check Availability
            </Button>
          </Link>
          <div className="mt-6">
            <Badge 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm"
              data-testid="badge-coverage-zones"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Serving Bangalore: Whitefield, Koramangala, HSR Layout, Indiranagar
            </Badge>
          </div>
        </div>
      </section>

      {/* Featured Poojas Section */}
      <section className="py-16 md:py-24" data-testid="section-poojas">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 font-serif" style={{ color: 'hsl(var(--primary))' }}>
              Our Poojas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated selection of traditional Hindu rituals
            </p>
          </div>

          {poojasLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover-elevate">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {poojas?.map((pooja) => (
                <Card 
                  key={pooja.id} 
                  className="hover-elevate transition-transform hover:scale-105 duration-200"
                  data-testid={`card-pooja-${pooja.slug}`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-semibold">
                      {pooja.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {pooja.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{pooja.durationMinutes} minutes</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Priest Only</p>
                      <p className="text-lg font-semibold" style={{ color: 'hsl(var(--gold))' }}>
                        ₹{pooja.basePricePriestOnlyMin.toLocaleString()} - ₹{pooja.basePricePriestOnlyMax.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">With Materials</p>
                      <p className="text-lg font-semibold" style={{ color: 'hsl(var(--gold))' }}>
                        ₹{pooja.basePriceWithKitMin.toLocaleString()} - ₹{pooja.basePriceWithKitMax.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/pooja/${pooja.slug}`} className="w-full">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        data-testid={`button-view-details-${pooja.slug}`}
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30" data-testid="section-how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'hsl(var(--primary))' }}>
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple and hassle-free booking in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center" data-testid="step-1">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Select Your Pooja</h3>
              <p className="text-muted-foreground">
                Choose from our curated list of traditional Hindu rituals
              </p>
            </div>

            <div className="text-center" data-testid="step-2">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Date, Time & Language</h3>
              <p className="text-muted-foreground">
                Pick your preferred date, time slot, and language
              </p>
            </div>

            <div className="text-center" data-testid="step-3">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Pandit at Your Home</h3>
              <p className="text-muted-foreground">
                A verified pandit performs the ritual at your convenience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Zones Section */}
      <section className="py-16 md:py-24" data-testid="section-zones">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'hsl(var(--primary))' }}>
              Service Areas
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We currently serve key Bengaluru neighborhoods and are expanding soon
            </p>
          </div>

          {zonesLoading ? (
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-32 bg-muted rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {zones?.map((zone) => (
                <Badge 
                  key={zone.id}
                  variant="secondary"
                  className="px-6 py-3 text-base rounded-full"
                  data-testid={`badge-zone-${zone.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {zone.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-muted/30" data-testid="section-trust">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'hsl(var(--primary))' }}>
              Why Choose PoojaOne
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center" data-testid="trust-verified">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--gold))' }} />
              <h3 className="text-xl font-semibold mb-3">Verified Priests</h3>
              <p className="text-muted-foreground">
                All our pandits are thoroughly verified and experienced
              </p>
            </div>

            <div className="text-center" data-testid="trust-transparent">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--gold))' }} />
              <h3 className="text-xl font-semibold mb-3">Transparent Pricing</h3>
              <p className="text-muted-foreground">
                Clear upfront pricing with no hidden charges
              </p>
            </div>

            <div className="text-center" data-testid="trust-hassle-free">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--gold))' }} />
              <h3 className="text-xl font-semibold mb-3">Hassle-Free Experience</h3>
              <p className="text-muted-foreground">
                Easy booking and reliable service at your doorstep
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Badge variant="outline" className="px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Coming Soon: Customer Reviews & Ratings
            </Badge>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
