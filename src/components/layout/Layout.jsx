// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import { Outlet } from 'react-router-dom';
// import { motion } from 'framer-motion';

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Navbar />
//         <motion.main
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="flex-1 p-6 overflow-auto"
//         >
//           <Outlet />
//         </motion.main>
//       </div>
//     </div>
//   );
// }

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen min-w-full bg-slate-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-x-auto">
        {' '}
        {/* buraya overflow-x-auto eklendi */}
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-6 overflow-auto"
        >
          <div className="overflow-x-auto">
            {' '}
            {/* table parent’ına ekledik */}
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
