import { Link } from "react-router-dom";
import { BsTranslate } from "react-icons/bs";
import { GiArchiveResearch } from "react-icons/gi";
import { MdSummarize } from "react-icons/md";
import { IconType } from "react-icons";

const HomeScreen = () => {
  const services = [
    {
      icon: GiArchiveResearch,
      title: "Language Detection",
      description:
        "Instantly identify the language of any text with precision.",
    },
    {
      icon: BsTranslate,
      title: "Text Translation",
      description:
        "Condense long texts into concise summaries while retaining key information.",
    },
    {
      icon: MdSummarize,
      title: "Text Summarization",
      description:
        "Seamlessly translate your text into multiple languages for global communication.",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-10 bg-[#0D1117] min-h-screen !text-white p-3 lg:p-12">
      <div className="w-full flex flex-col justify-center items-center gap-4 ">
        <h1 className="text-4xl font-bold text-left text-[#FF9D00] flex gap-2.5 items-center">
          <img src="/assets/book-logo.svg" alt="" />
          <span className="text-white">TextEase</span>
        </h1>
        <p className="text-lg font-semibold text-center">
          Your 99.9% accurate AI Text processor!
        </p>
        <p className="text-sm text-gray-200">
          Effortlessly process, understand, and communicate across languages—all
          in one intuitive interface!
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <Link
            to={"/main"}
            className=" px-5 py-3 rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-sm text-white font-semibold cursor-pointer"
          >
            Get Started
          </Link>
          <Link
            to={
              "https://devlink-liart.vercel.app/share/QpXIaLYWSqaUwIRMGHIFowVtgt13"
            }
            target="blank"
            className="hidden md:block px-5 py-3 rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-sm text-white font-semibold cursor-pointer"
          >
            Contact Developer
          </Link>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-10">
        {services.map(
          (service: { icon: IconType; title: string; description: string }) => (
            <div
              key={service.title}
              className="w-full rounded-xl flex flex-col items-center gap-4 bg-gray-200/10 p-8"
            >
              <span className="w-fit p-6 rounded-full bg-gray-200/20">
                <service.icon size={40} className="text-[#FF9D00]" />
              </span>
              <p className="text-xl font-semibold text-center">
                {service.title}
              </p>
              <p className="text-center text-gray-100">{service.description}</p>
              <Link
                to={"/main"}
                className="w-full px-5 py-3 text-center rounded-lg bg-[#FF9D00] hover:bg-[#e68a00] text-sm text-white font-semibold cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
