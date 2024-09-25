import Image from "next/image";
import { Book, Users, Clock, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-relaxed sm:leading-relaxed md:leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 ">
            {t("libraryExperience")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("subTitel")}
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="leading-relaxed sm:leading-relaxed md:leading-relaxed text-2xl sm:text-3xl md:text-4xl font-semibold   text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              {t("visionTitle")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              {t("visionContent1")}
            </p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              {t("visionContent2")}
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
          <h2 className=" text-2xl sm:text-3xl md:text-4xl  font-semibold leading-relaxed sm:leading-relaxed md:leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-12 text-center">
            {t("unmatchedFeaturesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Book,
                title: t("features.vastCollection.title"),
                description: t("features.vastCollection.description"),
              },
              {
                icon: Users,
                title: t("features.engageConnect.title"),
                description: t("features.engageConnect.description"),
              },
              {
                icon: Clock,
                title: t("features.alwaysAccessible.title"),
                description: t("features.alwaysAccessible.description"),
              },
              {
                icon: Search,
                title: t("features.precisionSearch.title"),
                description: t("features.precisionSearch.description"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-400 transition-colors duration-300"
              >
                <feature.icon className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 leading-relaxed">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 rounded-3xl p-6 sm:p-10 mb-20 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed sm:leading-relaxed md:leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-8 text-center">
            {t("legacyTitle")}
          </h2>
          <div className="space-y-6 text-sm sm:text-base md:text-lg">
            <p className="text-gray-400 leading-relaxed">
              {t("legacyContent1")}
            </p>
            <p className="text-gray-400 leading-relaxed">
              {t("legacyContent2")}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-relaxed sm:leading-relaxed md:leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-12 text-center">
            {t("joinUsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-relaxed">
                {t("volunteerWithUs.title")}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 leading-relaxed">
                {t("volunteerWithUs.description")}
              </p>
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-4 rounded-md hover:from-gray-500 hover:to-gray-700 transition-colors duration-300">
                {t("discoverMore")}
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-relaxed">
                {t("supportUs.title")}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 leading-relaxed">
                {t("supportUs.description")}
              </p>
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-2 px-4 rounded-md hover:from-gray-500 hover:to-gray-700 transition-colors duration-300">
                {t("contributeToday")}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
