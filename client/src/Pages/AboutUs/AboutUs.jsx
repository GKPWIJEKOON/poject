import React from "react";

const AboutUs = () => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/020/831/999/non_2x/laptop-computer-blank-white-screen-on-table-photo.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-70 p-10 md:p-16 rounded-2xl max-w-4xl text-center shadow-2xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 animate-fade-in">
          Welcome to E-LearnXpert
        </h1>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed animate-fade-in delay-200">
          At <span className="font-semibold text-cyan-400">E-LearnXpert</span>,
          we empower learners and educators through innovative, easy-to-use online
          learning solutions. Our platform offers high-quality courses,
          expert-led training, and interactive tools designed to make education more
          accessible, engaging, and effective. Whether you're a student, teacher,
          or lifelong learner, E-LearnXpert is your trusted partner on the path
          to knowledge and success.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
