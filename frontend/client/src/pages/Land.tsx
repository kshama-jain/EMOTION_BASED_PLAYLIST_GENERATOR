// import React from "react";
// import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

// export default function Land(){
//     return (
//         <BackgroundGradientAnimation>
//           <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
//             <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
//               Welcome to Emotify...
//             </p>
            
//           </div>
//           <p>Get ready to get personalised playlists based on your day. Need to vent ? We are here for you!</p>

//         </BackgroundGradientAnimation>
//       );
// }





// green black


// import React, { useState, useEffect } from "react";
// import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

// export default function Land() {
//   const [showButtons, setShowButtons] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowButtons(true);
//     }, 2000);
    
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <BackgroundGradientAnimation
//       gradientBackgroundStart="rgb(0, 40, 20)"
//       gradientBackgroundEnd="rgb(0, 0, 0)"
//       firstColor="0, 255, 100"
//       secondColor="0, 200, 80"
//       thirdColor="0, 150, 70"
//       fourthColor="0, 100, 50"
//       fifthColor="50, 200, 100"
//       pointerColor="0, 255, 120"
//     >
//       <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none">
//         <p className="text-3xl text-center md:text-4xl lg:text-7xl bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 mb-6">
//           Welcome to Emotify...
//         </p>
//         <p className="text-sm md:text-base lg:text-xl text-center max-w-md text-white/80 mt-2">
//           Get ready to get personalised playlists based on your day. Need to vent? We are here for you!
//         </p>
//       </div>
      
//       {showButtons && (
//         <div className="absolute z-50 bottom-1/4 left-0 right-0 flex items-center justify-center gap-4 pointer-events-auto animate-fade-in">
//           <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-700 text-white font-medium hover:shadow-lg transition-all duration-300">
//             Login
//           </button>
//           <button className="px-6 py-3 rounded-lg bg-transparent border-2 border-green-500 text-white font-medium hover:bg-green-500/20 transition-all duration-300">
//             Sign Up
//           </button>
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 1s ease forwards;
//         }
//       `}</style>
//     </BackgroundGradientAnimation>
//   );
// }





//- p green blue but more blue

// import React, { useState, useEffect } from "react";
// import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

// export default function Land() {
//   const [showButtons, setShowButtons] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowButtons(true);
//     }, 2000);
    
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <BackgroundGradientAnimation
//       gradientBackgroundStart="rgb(0, 30, 40)"
//       gradientBackgroundEnd="rgb(0, 10, 15)"
//       firstColor="0, 210, 200"
//       secondColor="20, 180, 170"
//       thirdColor="0, 150, 180"
//       fourthColor="0, 120, 140"
//       fifthColor="20, 220, 200"
//       pointerColor="0, 200, 180"
//     >
//       <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none">
//         <p className="text-3xl text-center md:text-4xl lg:text-7xl bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 mb-6">
//           Welcome to Emotify...
//         </p>
//         <p className="text-sm md:text-base lg:text-xl text-center max-w-md text-white/80 mt-2">
//           Get ready to get personalised playlists based on your day. Need to vent? We are here for you!
//         </p>
//       </div>
      
//       {showButtons && (
//         <div className="absolute z-50 bottom-1/4 left-0 right-0 flex items-center justify-center gap-4 pointer-events-auto animate-fade-in">
//           <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-700 text-white font-medium hover:shadow-lg transition-all duration-300">
//             Login
//           </button>
//           <button className="px-6 py-3 rounded-lg bg-transparent border-2 border-teal-400 text-white font-medium hover:bg-teal-500/20 transition-all duration-300">
//             Sign Up
//           </button>
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 1s ease forwards;
//         }
//       `}</style>
//     </BackgroundGradientAnimation>
//   );
// }



import React, { useState, useEffect } from "react";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { useNavigate } from 'react-router-dom';

export default function Land() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 40, 33)"
      gradientBackgroundEnd="rgb(0, 15, 4)"
      firstColor="0, 210, 200"
      secondColor="20, 180, 170"
      thirdColor="0, 150, 180"
      fourthColor="0, 120, 140"
      fifthColor="20, 220, 200"
      pointerColor="0, 200, 180"
    >
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none">
        <p className="text-3xl text-center md:text-4xl lg:text-7xl bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 mb-6">
          Welcome to Emotify...
        </p>
        <p className="text-sm md:text-base lg:text-xl text-center max-w-md text-white/80 mt-2">
          Get ready to get personalised playlists based on your day. Need to vent? We are here for you!
        </p>
      </div>
      
      {showButtons && (
        <div className="absolute z-50 bottom-1/4 left-0 right-0 flex items-center justify-center gap-4 pointer-events-auto animate-fade-in">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-700 text-white font-medium hover:shadow-lg transition-all duration-300"
          onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="px-6 py-3 rounded-lg bg-transparent border-2 border-teal-400 text-white font-medium hover:bg-teal-500/20 transition-all duration-300"
          onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </BackgroundGradientAnimation>
  );
}