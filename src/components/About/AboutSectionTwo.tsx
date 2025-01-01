import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/aboutSectionTwo.webp"
                alt="WAPI API Integration"
                fill
                className="rounded-2xl object-cover drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/aboutSectionTwo.webp"
                alt="WAPI API Integration"
                fill
                className="hidden rounded-2xl object-cover drop-shadow-three dark:block dark:drop-shadow-none "
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Easy and Reliable API
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Integrate WAPI effortlessly with minimal setup. Designed for
                  simplicity and reliability, it&apos;s the perfect solution for
                  your get-go applications.
                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Unlimited Sessions
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Enjoy unlimited session capabilities, allowing your
                  applications to scale without restrictions.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Developer-Friendly
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  WAPI is open-source and built with developers in mind. Access
                  simple and easy to use documentation and start using it now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
