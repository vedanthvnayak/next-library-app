import dynamic from "next/dynamic";
import TopBooks from "@/components/ui/TopBooks";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import { BookRepository } from "@/repository/books.repository";
import { FaBook, FaDatabase } from "react-icons/fa";

const bookRepository = new BookRepository();

// Dynamically import the HeroSection and LumaEmbed (client components)
const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: true,
});
const LumaEmbed = dynamic(() => import("@/components/LumaEmbed"), {
  ssr: false, // Client-side only for iframe
});

export default async function HomePage() {
  const topBooks = await bookRepository.getTopFiveBook();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 mt-16 sm:mt-20 ">
        <HeroSection />
        <TopBooksSection topBooks={topBooks} />

        <VisionSection />
        <LumaEmbed />
      </main>
    </div>
  );
}

function TopBooksSection({ topBooks }) {
  return (
    <section className="py-12 bg-gray-900">
      <TopBooks
        title="Top 5 New Arrivals 🔥"
        topBooks={topBooks}
        maxBooksPerRow={3}
      />
    </section>
  );
}

function VisionSection() {
  return (
    <section className="w-full py-12 bg-black">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 sm:gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
              Our Vision
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 leading-relaxed">
              Redefining the library experience. With a vast collection and
              innovative features, ज्ञान भाण्डार (Jñāna Bhāṇḍāra) Library
              empowers you to explore and connect with knowledge like never
              before.
            </p>
          </div>
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-white">
              Why Choose Us
            </h3>
            <ul className="list-none space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <FaBook className="text-indigo-400 text-xl" />
                Seamless and intelligent search functionality
              </li>
              <li className="flex items-center gap-3">
                <FaDatabase className="text-indigo-400 text-xl" />
                Tailored user experiences with personalized accounts
              </li>
              <li className="flex items-center gap-3">
                <FaBook className="text-indigo-400 text-xl" />
                Effortless book reservations and management
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
