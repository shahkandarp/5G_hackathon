import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Mainindex from "./scenes/dashboard/mainindex";
import UserMainindex from "./scenes/dashboard/usermainindex";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./scenes/login";
import Form from "../src/scenes/form";
import Bar from "../src/scenes/bar";
import Dashboard from "./scenes/dashboard";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import Thresholdcrossedtable from "./components/Thresholdcrossedtable";
import UserDashboard from "./scenes/userdashboard/user";
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: "usermainindex", element: <UserMainindex />,
    children: [
      {
        index: true,element: <UserDashboard />
      },
      {
        path: "Form", element: <Form />,
      },
      {
        path: "bar", element: <Bar />
      },
      {
        path: "pie", element: < Pie />
      },
      {
        path: "line", element: < Line />
      },
      {
        path: "geography", element: < Geography />
      }

    ]
  },
  {
    path: 'mainindex', element: <Mainindex />,
    children: [
      {
        index: true, element: <Dashboard />
      },
      {
        path: "Form", element: <Form />,
      },
      {
        path: "bar", element: <Bar />
      },
      {
        path: "pie", element: < Pie />
      },
      {
        path: "line", element: < Line />
      },
      {
        path: "geography", element: < Geography />
      },
      {
        path: "thresholdcrossed/:type", element: < Thresholdcrossedtable />
      }

    ]
  }])

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
// function App() {
//   const [theme, colorMode] = useMode();
//   // const [isSidebar, setIsSidebar] = useState(true);

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div className="app">
//           {/* <Sidebar isSidebar={isSidebar} /> */}
//           <main className="content">
//             {/* <Topbar setIsSidebar={setIsSidebar} /> */}
//             <Routes>

//               <Route path="/login" element={<Login />} />
//               <Route path="/*" element={<Mainindex />} />
//               <Route path="/usermainindex" element={<UserMainindex />} />
//             </Routes>
//           </main>
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App;
