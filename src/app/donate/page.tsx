import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen flex flex-col items-center">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="Your contribution can become someone’s first meal." />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
            
            {/* Donation Information / Bank Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-green/10">
              <h3 className="font-editorial text-2xl font-bold text-primary-green mb-4">Make a Direct Transfer</h3>
              <p className="text-muted mb-8 text-sm">
                Please transfer your donation amount using UPI or Bank Transfer to the details below. Once completed, fill out the form with your transaction reference number to help us track and acknowledge your contribution.
              </p>
              
              <div className="space-y-6">
                <div className="bg-ivory p-6 rounded-2xl border border-primary-brown/10">
                  <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">1</span> 
                    UPI Transfer
                  </h4>
                  <div className="space-y-2 text-sm text-charcoal font-medium">
                    <p className="flex justify-between border-b border-primary-brown/10 pb-2">
                      <span className="text-muted">UPI ID:</span> 
                      <span>YOUR_UPI_ID_HERE</span>
                    </p>
                  </div>
                </div>

                <div className="bg-ivory p-6 rounded-2xl border border-primary-brown/10">
                  <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">2</span> 
                    Bank Transfer
                  </h4>
                  <div className="space-y-3 text-sm text-charcoal font-medium">
                    <p className="flex justify-between border-b border-primary-brown/10 pb-2">
                      <span className="text-muted">Bank Name:</span> 
                      <span>YOUR_BANK_NAME_HERE</span>
                    </p>
                    <p className="flex justify-between border-b border-primary-brown/10 pb-2">
                      <span className="text-muted">Account Name:</span> 
                      <span>YOUR_ACCOUNT_NAME_HERE</span>
                    </p>
                    <p className="flex justify-between border-b border-primary-brown/10 pb-2">
                      <span className="text-muted">Account Number:</span> 
                      <span>YOUR_ACCOUNT_NUMBER_HERE</span>
                    </p>
                    <p className="flex justify-between border-b border-primary-brown/10 pb-2">
                      <span className="text-muted">IFSC Code:</span> 
                      <span>YOUR_IFSC_HERE</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Form Container */}
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-primary-green/10 w-full max-w-full overflow-hidden h-[1080px]">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLScwT8k43VzTdVyDvaU_QEbojMrdNwP9qKzk1zSdoDog92jppQ/viewform?embedded=true"
                title="DeepRoots Foundation Donation Form"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                className="w-full h-full block rounded-2xl"
              >
                Loading…
              </iframe>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
