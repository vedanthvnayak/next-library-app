import Image from "next/image";
import { Book, Users, Clock, Search } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200">
            The Library Experience
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Redefining access to knowledge. Elevating community engagement
            through seamless, innovative services.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              Our Vision
            </h2>
            <p className="text-gray-400 text-lg">
              At ज्ञान भाण्डार (Jñāna Bhāṇḍāra) Library, were not just about
              books. Were about creating an unparalleled experience that
              inspires curiosity and empowers every individual.
            </p>
            <p className="text-gray-400 text-lg">
              Seamlessly blending technology and tradition, we offer a world of
              resources at your fingertips, pushing the boundaries of what a
              library can be.
            </p>
          </div>
          <div className="relative w-full h-80 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/library-baw.jpg"
              alt="Library of the future"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-3xl"></div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-12 text-center">
            Unmatched Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Book,
                title: "Vast Collection",
                description:
                  "Explore over 100,000 meticulously curated books, e-books, and media.",
              },
              {
                icon: Users,
                title: "Engage & Connect",
                description:
                  "Join dynamic events and programs designed to inspire and connect.",
              },
              {
                icon: Clock,
                title: "Always Accessible",
                description:
                  "Seamless access anytime, anywhere. The library, always at your service.",
              },
              {
                icon: Search,
                title: "Precision Search",
                description:
                  "Advanced search tools, tailored to your needs, delivering results effortlessly.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-400 transition-colors duration-300"
              >
                <feature.icon className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 rounded-3xl p-10 mb-20 shadow-2xl">
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-8 text-center">
            Our Legacy
          </h2>
          <div className="space-y-6 text-lg">
            <p className="text-gray-400">
              Since 2024, ज्ञान भाण्डार (Jñāna Bhāṇḍāra) Library has been at the
              forefront of knowledge, continually evolving to meet the needs of
              our community. From a single room of books to a state-of-the-art
              facility, we are proud of our legacy.
            </p>
            <p className="text-gray-400">
              Through decades of innovation, we’ve transformed the way people
              interact with information, always striving to exceed expectations.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-12 text-center">
            Join Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Volunteer With Us
              </h3>
              <p className="text-gray-400 text-lg mb-4">
                Become part of a passionate team and make a meaningful impact.
                From program assistance to behind-the-scenes support, your
                contribution is invaluable.
              </p>
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-4 rounded-md hover:from-gray-500 hover:to-gray-700 transition-colors duration-300">
                Discover More
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Support Us
              </h3>
              <p className="text-gray-400 text-lg mb-4">
                Your generosity drives innovation. Help us expand, evolve, and
                reach new heights with your donation.
              </p>
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-4 rounded-md hover:from-gray-500 hover:to-gray-700 transition-colors duration-300">
                Contribute Today
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
