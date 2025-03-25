'use client';

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branch 1 Information */}
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Branch 1</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Address:</strong> near Goal Institute, Buddha Colony, Patna, Bihar 800001
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+919065297402" className="text-blue-400 hover:underline">
                +91 9065297402
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@xatun.in" className="text-blue-400 hover:underline">
                  support@xatun.in
                </a>
              </p>
              <p>
                <strong>Business Hours:</strong> Mon-sun: 11:30 AM - 10:30 PM
              </p>
            </div>

            {/* Embedded Google Map for Branch 1 */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Location</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28779.8260406606!2d85.092351436615!3d25.622248020719248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59a72756c70d%3A0x222b604c69f77182!2sXATUN%20STREETWEAR!5e0!3m2!1sen!2sin!4v1740158169208!5m2!1sen!2sin"
                  className="w-full h-full rounded-lg border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Branch 2 Information */}
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Branch 2</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong>Address:</strong> near Goal Institute, Buddha Colony, Patna, Bihar 800001
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+919065297402" className="text-blue-400 hover:underline">
                  +91 9065297402
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@xatunstreetwear.com" className="text-blue-400 hover:underline">
                  info@xatunstreetwear.com
                </a>
              </p>
              <p>
                <strong>Business Hours:</strong> Mon-sun: 11:30 AM - 10:30 PM
              </p>
            </div>

            {/* Embedded Google Map for Branch 2 */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Location</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28779.8260406606!2d85.092351436615!3d25.622248020719248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed596a940022d7%3A0x8a79fb1ab9599ac1!2sXATUN%20STREETWEAR!5e0!3m2!1sen!2sin!4v1740158141913!5m2!1sen!2sin"
                  className="w-full h-full rounded-lg border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}

      </div>
    </div>
  );
}