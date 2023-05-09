// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './login.css'
// import { createClient } from "@supabase/supabase-js";
// import Navbar from "../../components/Navbar/Navbar";

// const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
// const SUPABASE_ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// function Login() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleLogin = async () => {
//     setError(null);
//     const { user, error } = await supabase.auth.signInWithPassword({
//       phone: phoneNumber,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//     } else {
//       console.log("User logged in successfully", user);
//     }
//   };

//   return (
//     <div >
//       <h2>Login</h2>
//       <form>
//         <input
//           type="text"
//           placeholder="Phone number"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="button" onClick={handleLogin}>
//           Log In
//         </button>
//       </form>
//       <button onClick={() => }>Don't Have An Acount? Sign Up</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// }

// export default Hamada;
