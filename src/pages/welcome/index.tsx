const HomeScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div className="w-full flex flex-col justify-center items-center !py-6">
        <h1 className="text-4xl font-bold text-left text-[#FF9D00] flex gap-2.5 items-center">
          <img src="/assets/book-logo.svg" alt="" />
          <span className="text-white">TextEase</span>
        </h1>
      </div>
    </div>
  );
};

export default HomeScreen;
