import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Grain, DotScreen, TreeField } from "@/components/Texture";
import { SiteNav } from "@/components/Chrome";
import Index from "@/pages/Index";
import Photography from "@/pages/Photography";
import Archive from "@/pages/Archive";
import Colophon from "@/pages/Colophon";
import Google from "@/pages/Google";
import Aube from "@/pages/Aube";
import Betteride from "@/pages/Betteride";
import Nothing from "@/pages/Nothing";
import Berlin from "@/pages/Berlin";
import NotFound from "@/pages/NotFound";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/**
 * Texture belongs to the archive, not to the zones. A zone is allowed to
 * disagree, and a light Google page with film grain over it would be neither
 * one thing nor the other.
 */
const ZONES = ["/google", "/aube", "/betteride", "/nothing", "/berlin"];

function Texture() {
  const { pathname } = useLocation();
  if (ZONES.includes(pathname)) return null;
  return (
    <>
      <TreeField />
      <DotScreen />
      <Grain />
    </>
  );
}

/** The nav is fixed on archive pages; each zone carries its own way back. */
function Nav() {
  const { pathname } = useLocation();
  if (ZONES.includes(pathname)) return null;
  return <SiteNav />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Texture />
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/index.txt" element={<Colophon />} />
        <Route path="/google" element={<Google />} />
        <Route path="/aube" element={<Aube />} />
        <Route path="/betteride" element={<Betteride />} />
        <Route path="/nothing" element={<Nothing />} />
        <Route path="/berlin" element={<Berlin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
