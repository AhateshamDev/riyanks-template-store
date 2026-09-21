import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TemplatePage from "./pages/TemplatePage";
import PaymentSuccess from "./pages/PaymentSuccess";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/template/:slug" element={<TemplatePage />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
