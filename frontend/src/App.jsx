import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import Success from "./pages/Success/Success";
import MyOrders from "./pages/MyOrders/myOrders";
import Menu from "./pages/Menu/Menu";
import Navbar from "./components/Navbar/Navbar";
import { useEffect, useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Footer from "./components/Footer/Footer";
import OurService from "./components/OurService/OurService";
import About from "./components/About/About";
import Chatbot from "./components/Chatbot/Chatbot";
import Contact from "./components/Contact/Contact";
import Context from "./pages/Context/Context";
const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const { pathname } = useLocation();
  const hideFooter = pathname === "/contact";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-fg)] transition-colors duration-300">
      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <Navbar setShowLogin={setShowLogin} />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/services" element={<OurService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/context" element={<Context />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
      <Chatbot />
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
        