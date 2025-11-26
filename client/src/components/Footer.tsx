export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-serif mb-4" style={{ color: 'hsl(var(--primary))' }}>
              PoojaOne
            </h3>
            <p className="text-sm text-muted-foreground">
              Trusted pooja services for busy Bengaluru professionals
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover-elevate px-2 py-1 rounded cursor-pointer">About Us</span></li>
              <li><span className="hover-elevate px-2 py-1 rounded cursor-pointer">How It Works</span></li>
              <li><span className="hover-elevate px-2 py-1 rounded cursor-pointer">Contact</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover-elevate px-2 py-1 rounded cursor-pointer">Terms of Service</span></li>
              <li><span className="hover-elevate px-2 py-1 rounded cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PoojaOne. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
