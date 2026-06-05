import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { ShoppingCart, MapPin, Phone, MessageCircle, Clock, ChefHat, Lock, CheckCircle2, XCircle, PackageCheck, Settings, Eye, CalendarDays, Sparkles, UtensilsCrossed, Search, ChevronDown, Clipboard } from "lucide-react";
import "./style.css";

const BRAND = { name: "KRUA PEÈN THAÏ", phone: "0670395523", email: "kruapeenthai@gmail.com", instagram: "@krua_peen_thai", facebook: "KRUA Peèn-Thaï" };

const initialLocations = [
  { id: "PLAB", city: "Plabennec", label: "Mardi soir", place: "Devant l’église", day: "Mardi", hours: "15h30 – 20h30", active: true },
  { id: "KERJ", city: "Kerlouan", label: "Jeudi matin", place: "Place de la mairie", day: "Jeudi", hours: "08h00 – 13h00", active: false },
  { id: "KERD", city: "Kerlouan", label: "Dimanche matin", place: "Place de la mairie", day: "Dimanche", hours: "08h00 – 13h00", active: false },
  { id: "BRI", city: "Brignogan", label: "Dimanche soir", place: "Devant le camping Slow Village", day: "Dimanche", hours: "16h00 – 21h00", active: true },
];

const categoryOrder = ["Entrées","Accompagnements","Plats avec nouilles","Plats avec riz","Currys","Mix sushi découverte","Sushis","Makis","California","Sushis spécial","Crunch","Makis printemps","Poké bowls"];
const categoryLabels = {
  "Entrées": "🥟 Entrées", "Accompagnements": "🍚 Accompagnements",
  "Plats avec nouilles": "🍜 Plats avec nouilles", "Plats avec riz": "🍚 Plats avec riz", "Currys": "🌶️ Currys",
  "Mix sushi découverte": "🍱 Mix sushi découverte",
  "Sushis": "🍣 Sushis", "Makis": "🥒 Makis", "California": "🥑 California", "Sushis spécial": "⭐ Sushis spéciaux",
  "Crunch": "🔥 Crunch", "Makis printemps": "🌿 Makis printemps", "Poké bowls": "🥗 Poké bowls",
};

const productsSeed = [
  { id: "e1", code: "E1", name: "Rouleau de printemps crevette", category: "Entrées", price: 3.5, available: true, fixed: true, desc: "1 pièce." },
  { id: "e1-4", code: "E1", name: "Rouleaux de printemps crevette x4", category: "Entrées", price: 12, available: true, fixed: true, desc: "4 pièces." },
  { id: "e2", code: "E2", name: "Nems crevettes", category: "Entrées", price: 1.5, available: true, fixed: true, desc: "1 pièce." },
  { id: "e2-4", code: "E2", name: "Nems crevettes x4", category: "Entrées", price: 5.5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e3", code: "E3", name: "Nems porc", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e3-4", code: "E3", name: "Nems porc x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e4", code: "E4", name: "Nems légumes", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e4-4", code: "E4", name: "Nems légumes x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e5", code: "E5", name: "Nems poulet", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e5-4", code: "E5", name: "Nems poulet x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e6", code: "E6", name: "Samoussas bœuf", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e6-4", code: "E6", name: "Samoussas bœuf x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e7", code: "E7", name: "Samoussas porc basilic Thaï", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e7-4", code: "E7", name: "Samoussas porc basilic Thaï x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e8", code: "E8", name: "Brochette de poulet pané", category: "Entrées", price: 2, available: true, fixed: true, desc: "1 pièce." },
  { id: "e9", code: "E9", name: "Bouchée vapeur poulet & crevette", category: "Entrées", price: 1, available: true, fixed: true, desc: "1 pièce." },
  { id: "e9-6", code: "E9", name: "Bouchées vapeur poulet & crevette x6", category: "Entrées", price: 5.5, available: true, fixed: true, desc: "6 pièces." },
  { id: "riz-cantonais", code: "A1", name: "Riz cantonais", category: "Accompagnements", price: 5.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "nouilles-sautees-accompagnement", code: "A2", name: "Nouilles de blé sautées", category: "Accompagnements", price: 5.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "option-riz-cantonais", code: "OPT", name: "Option riz cantonais", category: "Accompagnements", price: 2.5, available: true, fixed: true, desc: "Remplacer le riz nature par du riz cantonais." },
  { id: "option-nouilles-sautees", code: "OPT", name: "Option nouilles sautées", category: "Accompagnements", price: 2.5, available: true, fixed: true, desc: "Remplacer le riz nature par des nouilles sautées." },
  { id: "pad-thai-poulet", code: "P1", name: "Pad Thaï poulet", category: "Plats avec nouilles", price: 10.5, available: true, fixed: true, desc: "Nouilles de riz, œuf, soja, cacahuètes, ciboulettes. Variante poulet." },
  { id: "pad-thai-crevettes", code: "P1", name: "Pad Thaï crevettes", category: "Plats avec nouilles", price: 10.5, available: true, fixed: true, desc: "Nouilles de riz, œuf, soja, cacahuètes, ciboulettes. Variante crevettes." },
  { id: "nouilles-sautees", code: "P2", name: "Nouilles sautées", category: "Plats avec nouilles", price: 9.5, available: true, fixed: true, desc: "Nouilles de riz sautées avec légumes. Au choix : porc, poulet ou crevettes." },
  { id: "pad-nam-man-hoi", code: "P3", name: "Pad Nam Man Hoi", category: "Plats avec riz", price: 9.9, available: true, fixed: false, desc: "Bœuf sauté, sauce huître, oignons, ciboulettes. Au choix : porc, poulet ou crevettes." },
  { id: "pad-kra-pao", code: "P4", name: "Pad Kra Pao", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Viande hachée, basilic thaï, oignons. Au choix : porc, poulet ou crevettes." },
  { id: "porc-caramel", code: "P5", name: "Porc au caramel", category: "Plats avec riz", price: 9.9, available: true, fixed: false, desc: "Porc mijoté sauce caramélisée maison." },
  { id: "poulet-cajou", code: "P6", name: "Poulet aux noix de cajou", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Poulet sauté, légumes, noix de cajou." },
  { id: "pad-phong-curry", code: "P7", name: "Pad Phong Curry", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Poulet ou crevettes sautées au curry jaune, oignons, ciboulettes." },
  { id: "curry-panang", code: "P8", name: "Curry Panang", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "curry-rouge", code: "P9", name: "Curry rouge", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "curry-vert", code: "P10", name: "Curry vert", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "s1", code: "S1", name: "6 sushis saumon", category: "Sushis", price: 8.5, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "m1", code: "M1", name: "Mix découverte 18 pièces", category: "Mix sushi découverte", price: 16.9, available: true, fixed: true, desc: "6 maki concombre fromage, 8 california thon mayonnaise, 4 sushi saumon." },
  { id: "m2", code: "M2", name: "Mix découverte 18 pièces", category: "Mix sushi découverte", price: 16.9, available: true, fixed: true, desc: "6 maki saumon, 8 california saumon, 4 sushi saumon." },
  { id: "m3", code: "M3", name: "Mix découverte 20 pièces", category: "Mix sushi découverte", price: 19.5, available: true, fixed: true, desc: "8 california thon mayonnaise, 6 maki saumon, 6 sushi saumon." },
  { id: "m4", code: "M4", name: "Mix découverte 20 pièces", category: "Mix sushi découverte", price: 19.5, available: true, fixed: true, desc: "8 california saumon, 6 maki avocat, 6 sushi saumon." },
  { id: "m5", code: "M5", name: "Mix découverte 22 pièces", category: "Mix sushi découverte", price: 21.9, available: true, fixed: true, desc: "8 california saumon, 8 california thon mayonnaise, 6 sushi saumon." },
  { id: "m6", code: "M6", name: "Mix découverte 22 pièces", category: "Mix sushi découverte", price: 17.9, available: true, fixed: true, desc: "8 california saumon, 8 california thon mayonnaise, 6 maki saumon." },
  { id: "opt-crunch", code: "OPT", name: "Option crunch", category: "Mix sushi découverte", price: 1, available: true, fixed: true, desc: "Ajout oignons frits et sauce crunch." },

  { id: "s2", code: "S2", name: "10 sushis saumon", category: "Sushis", price: 12.9, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "s3", code: "S3", name: "6 sushis crevettes", category: "Sushis", price: 8.9, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "s4", code: "S4", name: "10 sushis crevettes", category: "Sushis", price: 12.9, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "s5", code: "S5", name: "6 sushis saumon avocat", category: "Sushis", price: 9.5, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "s6", code: "S6", name: "6 sushis crevettes avocat", category: "Sushis", price: 9.5, available: true, fixed: true, desc: "Précommandes ouvertes jusqu’à la veille du service à 23h." },
  { id: "s7", code: "S7", name: "Maki concombre x6", category: "Makis", price: 4, available: true, fixed: true, desc: "6 pièces." },
  { id: "s8", code: "S8", name: "Maki avocat x6", category: "Makis", price: 4, available: true, fixed: true, desc: "6 pièces." },
  { id: "s9", code: "S9", name: "Maki fromage x6", category: "Makis", price: 4.5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s10", code: "S10", name: "Maki saumon x6", category: "Makis", price: 4.5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s11", code: "S11", name: "Maki saumon fromage x6", category: "Makis", price: 5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s12", code: "S12", name: "Maki saumon avocat x6", category: "Makis", price: 5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s13", code: "S13", name: "Maki concombre fromage x6", category: "Makis", price: 5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s14", code: "S14", name: "Maki crevettes fromage x6", category: "Makis", price: 5.5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s15", code: "S15", name: "California thon mayonnaise x8", category: "California", price: 6.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s16", code: "S16", name: "California saumon x8", category: "California", price: 7, available: true, fixed: true, desc: "8 pièces." },
  { id: "s17", code: "S17", name: "California saumon fromage x8", category: "California", price: 7.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s18", code: "S18", name: "California végétarien x8", category: "California", price: 6.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s19", code: "S19", name: "California surimi x8", category: "California", price: 6.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s20", code: "S20", name: "California crevettes fromage x8", category: "California", price: 7.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s21", code: "S21", name: "Sandwich sushis x8", category: "Sushis spécial", price: 12.9, available: true, fixed: true, desc: "8 pièces." },
  { id: "s22", code: "S22", name: "Dragon sushis x8", category: "Sushis spécial", price: 8.9, available: true, fixed: true, desc: "8 pièces." },
  { id: "s23", code: "S23", name: "Crunch saumon x8", category: "Crunch", price: 8.5, available: true, fixed: true, desc: "Tempura frits, 8 pièces." },
  { id: "s24", code: "S24", name: "Crunch thon mayonnaise x8", category: "Crunch", price: 8, available: true, fixed: true, desc: "Tempura frits, 8 pièces." },
  { id: "s25", code: "S25", name: "Crunch végétarien x8", category: "Crunch", price: 8, available: true, fixed: true, desc: "Tempura frits, 8 pièces." },
  { id: "s26", code: "S26", name: "Crunch surimi x8", category: "Crunch", price: 8.5, available: true, fixed: true, desc: "Tempura frits, 8 pièces." },
  { id: "s27", code: "S27", name: "Maki printemps saumon x8", category: "Makis printemps", price: 7.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s28", code: "S28", name: "Maki printemps saumon fromage x8", category: "Makis printemps", price: 8.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s29", code: "S29", name: "Maki printemps thon mayonnaise x8", category: "Makis printemps", price: 7.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s30", code: "S30", name: "Maki printemps végétarien x8", category: "Makis printemps", price: 7, available: true, fixed: true, desc: "8 pièces." },
  { id: "s31", code: "S31", name: "Maki printemps crevettes fromage x8", category: "Makis printemps", price: 8.5, available: true, fixed: true, desc: "8 pièces." },
  { id: "s32", code: "S32", name: "6 Roll saumon fromage", category: "Makis printemps", price: 9.5, available: true, fixed: true, desc: "6 pièces." },
  { id: "s33", code: "S33", name: "Poké bowl saumon", category: "Poké bowls", price: 10, available: true, fixed: true, desc: "Avocat, concombre, radis, oignons frits." },
  { id: "s34", code: "S34", name: "Poké bowl thon mayonnaise", category: "Poké bowls", price: 10, available: true, fixed: true, desc: "Avocat, concombre, radis, oignons frits." },
  { id: "s35", code: "S35", name: "Riz vinaigré", category: "Accompagnements", price: 3.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "s36", code: "S36", name: "Tartare de riz saumon avocat", category: "Accompagnements", price: 8.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "s37", code: "S37", name: "Salade de chou", category: "Accompagnements", price: 2.5, available: true, fixed: true, desc: "Accompagnement." },
];

const padThaiVariantProducts = productsSeed.filter((product) =>
  ["pad-thai-poulet", "pad-thai-crevettes"].includes(product.id)
);

const showcase = ["Pad Thaï signature","Currys thaï","Poulet noix de cajou","Porc caramel","Pad Kra Pao","Sushis sur commande","Poké bowls","Nems, samoussas, bouchées vapeur","Traiteur mariage, retour de mariage, entreprise"];

const menuVisualCards = [
  {
    id: "thai",
    title: "Spécialités thaïlandaises",
    subtitle: "Cuisine traditionnelle thaïlandaise maison",
    text: "Pad Thaï, currys, plats avec riz ou nouilles, entrées à partager.",
    image: "/krua-v3/menu-thai.png",
    category: "Plats avec nouilles"
  },
  {
    id: "sushi",
    title: "Sushis & Poké bowls",
    subtitle: "Sushis, makis, california, crunch & poké bowls",
    text: "Sushis, makis, california, crunch, makis printemps et poké bowls.",
    image: "/krua-v3/menu-sushis.png",
    category: "Sushis"
  }
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function euro(value) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value || 0); }
function locationCode(locationId) {
  if (locationId === "KERJ" || locationId === "KERD") return "KER";
  if (locationId === "PLAB") return "PLAB";
  if (locationId === "BRI") return "BRI";
  return locationId;
}

async function makeOrderCode(locationId) {
  // Code court et unique pour le dashboard Tina.
  // Exemple : PLAB-12345, KER-12346, BRI-12347
  const clean = locationCode(locationId);
  return `${clean}-${Date.now().toString().slice(-5)}`;
}
function normalizePhoneForLinks(phone = "") {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("33")) return digits;
  if (digits.startsWith("0")) return `33${digits.slice(1)}`;
  return digits;
}
function whatsappLink(phone, text) {
  const normalized = normalizePhoneForLinks(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function KruaSite() {

  const [view, setView] = useState("site");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState("orders");
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [serviceOrdersOpen, setServiceOrdersOpen] = useState(false);
  const [stockBlocks, setStockBlocks] = useState({});
  const [siteMessage, setSiteMessage] = useState("Précommandes ouvertes jusqu’à la veille 23h");
  const [products, setProducts] = useState(productsSeed);
  const [locations, setLocations] = useState(initialLocations);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [locationId, setLocationId] = useState("");
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", phone: "", email: "", note: "" });
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [openCategory, setOpenCategory] = useState("thai-nouilles");
  const [orderSearch, setOrderSearch] = useState("");
  const [appMode, setAppMode] = useState(supabase ? "Connecté à Supabase" : "Mode démo local");
  const [notificationStatus, setNotificationStatus] = useState("Notifications inactives");
  const [adminLocationFilter, setAdminLocationFilter] = useState("ALL");
  const [adminStatusFilter, setAdminStatusFilter] = useState("ACTIVE");
  const [hideDoneOrders, setHideDoneOrders] = useState(true);
  const [selectedMenuCard, setSelectedMenuCard] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(true);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ code: "", name: "", category: "Entrées", price: "", desc: "", available: true, fixed: true });
  const [newLocation, setNewLocation] = useState({ city: "", label: "", place: "", day: "Dimanche", hours: "16h30 – 21h30", active: true });
  const [loginEmail, setLoginEmail] = useState(BRAND.email);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

useEffect(() => {
  const normalizePath = () => window.location.pathname.replace(/\/$/, "");

  const openAdmin = async () => {
    const isAdminRoute = normalizePath() === "/admin";

    if (!isAdminRoute) {
      setView("site");
      return;
    }

    if (!supabase) {
      setLoginError("Supabase n'est pas configuré.");
      setView("login");
      return;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session Supabase", error);
      setLoginError("Impossible de vérifier la session admin.");
      setView("login");
      return;
    }

    if (data.session?.user?.email === BRAND.email) {
      setAdminUnlocked(true);
      setView("admin");
      loadSupabaseData();
    } else {
      setAdminUnlocked(false);
      setView("login");
    }
  };

  openAdmin();

  const { data: authListener } = supabase?.auth?.onAuthStateChange((_event, session) => {
    const isAdminRoute = normalizePath() === "/admin";
    if (!isAdminRoute) return;

    if (session?.user?.email === BRAND.email) {
      setAdminUnlocked(true);
      setView("admin");
      loadSupabaseData();
    } else {
      setAdminUnlocked(false);
      setView("login");
    }
  }) || { data: { subscription: null } };

  window.addEventListener("popstate", openAdmin);
  return () => {
    window.removeEventListener("popstate", openAdmin);
    authListener?.subscription?.unsubscribe?.();
  };
}, []);

  async function signInAdmin(event) {
    event?.preventDefault?.();
    setLoginError("");
    setAuthLoading(true);

    try {
      if (!supabase) throw new Error("Supabase non configuré.");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) throw error;
      if (data.user?.email !== BRAND.email) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'est pas autorisé pour le dashboard Tina.");
      }

      window.history.replaceState(null, "", "/admin");
      setAdminUnlocked(true);
      setView("admin");
      setLoginPassword("");
      await loadSupabaseData();
    } catch (error) {
      setLoginError(error.message || "Connexion impossible.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOutAdmin() {
    if (supabase) await supabase.auth.signOut();
    setAdminUnlocked(false);
    setView("site");
    window.history.replaceState(null, "", "/");
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error("Service worker", error));
    }
  }, []);
useEffect(() => {
  async function checkExistingSubscription() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        setNotificationStatus("Notifications activées sur cette tablette");
      }
    } catch (error) {
      console.error(error);
    }
  }

  checkExistingSubscription();
}, []);
  async function subscribeToPushNotifications() {
    setNotificationStatus("Activation des notifications en cours...");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setNotificationStatus("Notifications non supportées sur cet appareil");
        return;
      }
      if (!VAPID_PUBLIC_KEY) {
        setNotificationStatus("Clé VAPID publique manquante dans Vercel");
        return;
      }
      if (Notification.permission === "denied") {
        setNotificationStatus("Notifications bloquées dans Android/Chrome. Autorise-les dans les paramètres du site.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotificationStatus("Notifications refusées");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const subscriptionJson = subscription.toJSON();
      const response = await fetch("/api/save-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          keys: subscriptionJson.keys,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      setNotificationStatus("Notifications activées sur cette tablette");
    } catch (error) {
      console.error(error);
      setNotificationStatus(`Erreur activation notifications : ${error.message || error}`);
    }
  }

  async function sendOrderNotification(order, orderTotal) {
    try {
      const loc = locations.find((l) => l.id === order.locationId) || locations[0];
      await fetch("/api/send-order-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nouvelle commande KRUA",
          body: `${order.id} · ${loc.city} · ${euro(orderTotal)}`,
          url: "/admin",
          orderCode: order.id,
          location: loc.city,
          total: euro(orderTotal),
        }),
      });
    } catch (error) {
      console.error("Notification commande", error);
    }
  }

  useEffect(() => { if (supabase) loadSupabaseData(); }, []);

  async function loadSupabaseData() {
    try {
      const [productsRes, locationsRes, settingsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("locations").select("*"),
        supabase.from("settings").select("*"),
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
      ]);
      if (productsRes.data?.length) {
        const dbProducts = productsRes.data.map(p => ({ id:p.id, code:p.code, name:p.name, category:p.category, price:Number(p.price), available:p.available, fixed:p.fixed, desc:p.description || "" }));
        const missingPadThaiVariants = padThaiVariantProducts.filter(variant => !dbProducts.some(product => product.id === variant.id));
        if (missingPadThaiVariants.length) {
          await supabase.from("products").upsert(missingPadThaiVariants.map(p => ({ id:p.id, code:p.code, name:p.name, category:p.category, price:p.price, available:p.available, fixed:p.fixed, description:p.desc })));
        }
        const mergedProducts = [
          ...dbProducts.filter(product => product.id !== "pad-thai"),
          ...missingPadThaiVariants
        ];
        setProducts(mergedProducts);
      }
      else await supabase.from("products").upsert(productsSeed.map(p => ({ id:p.id, code:p.code, name:p.name, category:p.category, price:p.price, available:p.available, fixed:p.fixed, description:p.desc })));
      if (locationsRes.data?.length) setLocations(locationsRes.data.map(l => ({ id:l.id, city:l.city, label:l.label, place:l.place, day:l.day, hours:l.hours, active:l.active !== false })));
      else await supabase.from("locations").upsert(initialLocations.map(l => ({ ...l, active:true })));
      const setting = settingsRes.data?.[0];
      if (setting) { setOrdersOpen(setting.orders_open); setServiceOrdersOpen(Boolean(setting.service_orders_open)); setStockBlocks(setting.stock_blocks || {}); setSiteMessage(setting.site_message || "Précommandes ouvertes jusqu’à la veille 23h"); }
      else await supabase.from("settings").upsert({ id:"main", orders_open:true, service_orders_open:false, stock_blocks:{}, site_message:"Précommandes ouvertes jusqu’à la veille 23h" });
      if (ordersRes.data?.length) setOrders(ordersRes.data.map(o => ({ id:o.code, dbId:o.id, createdAt:o.created_at, status:o.status, total:Number(o.total || 0), customer:{ firstName:o.first_name, lastName:o.last_name || "", phone:o.phone, email:o.email || "", note:o.note || "" }, locationId:o.location_id, items:(o.order_items || []).map(item => ({ id:item.product_id, name:item.name, qty:item.qty, price:Number(item.price) })) })));
    } catch (e) { console.error(e); setAppMode("Erreur Supabase, mode local"); }
  }

  const availableProducts = products.filter(p => p.available);
  const categories = ["Tous", ...categoryOrder.filter(cat => availableProducts.some(p => p.category === cat))];
  const filteredProducts = availableProducts.filter(
    p => categoryFilter === "Tous" || p.category === categoryFilter
  );
  const productsByCategory = categoryOrder.map(category => ({ category, items: filteredProducts.filter(p => p.category === category) })).filter(g => g.items.length);
  const cartLines = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ ...products.find(p => p.id === id), qty })).filter(x => x.id), [cart, products]);
  const cartTotal = cartLines.reduce((s, i) => s + i.price * i.qty, 0);
  const sushiDiscountBase = cartLines.filter(isSushiDiscountProduct).reduce((s, i) => s + i.price * i.qty, 0);
  const sushiDiscount = sushiDiscountBase >= 25 ? Math.round(sushiDiscountBase * 0.10 * 100) / 100 : 0;
  const total = Math.max(0, cartTotal - sushiDiscount);
  const visibleLocations = locations.filter(l => l.active !== false && l.id !== "KERJ" && l.id !== "KERD");
  const selectedLocation = visibleLocations.find(l => l.id === locationId) || null;
  const selectedAvailability = selectedLocation
    ? getOrderAvailability(selectedLocation)
    : { open: false, mode: "no_location", message: "Choisissez d’abord votre lieu de retrait." };

  function addToCart(id) { setCart(old => ({ ...old, [id]:(old[id] || 0) + 1 })); }
  function removeFromCart(id) { setCart(old => { const n={...old}; n[id]=(n[id]||0)-1; if(n[id]<=0) delete n[id]; return n; }); }

  function isSushiDiscountProduct(product) {
    return ["Mix sushi découverte", "Sushis", "Makis", "California", "Sushis spécial", "Crunch", "Makis printemps"].includes(product?.category);
  }

  function orderItemsTotal(order) {
    return (order?.items || []).reduce((s, i) => s + i.qty * i.price, 0);
  }

  function orderGrandTotal(order) {
    if (typeof order?.total === "number" && !Number.isNaN(order.total)) return order.total;
    return orderItemsTotal(order);
  }

  function orderDiscountAmount(order) {
    return Math.max(0, orderItemsTotal(order) - orderGrandTotal(order));
  }

  async function submitOrder() {
    if (orderSubmitting) return;
    if (!selectedLocation) {
      setLocationModalOpen(true);
      return;
    }
    const orderAvailability = getOrderAvailability(selectedLocation);
    if (!orderAvailability.open) return alert(orderAvailability.message);
    const blockedCartLine = cartLines.find(item => isProductBlocked(item));
    if (blockedCartLine) return alert(`${blockedCartLine.name} est complet à la réservation pour cet emplacement.`);
    if (!customer.firstName || !customer.phone || cartLines.length === 0) return alert("Merci de remplir prénom, téléphone et panier.");

    setOrderSubmitting(true);
    try {
      const orderItems = cartLines.map(({id,code,name,qty,price}) => ({
  id,
  name: code ? `${code} - ${name}` : name,
  qty,
  price
}));
      // IMPORTANT : la remise n'est pas insérée dans order_items.
      // order_items.product_id est lié à products.id, donc une fausse ligne "discount" casse Supabase.
      // La remise est uniquement enregistrée dans orders.total.
      const order = { id: await makeOrderCode(locationId), createdAt:new Date().toISOString(), status:"À confirmer", customer, locationId, items: orderItems, total };
      if (supabase) {
        const response = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: order.id,
            status: order.status,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            email: customer.email || null,
            note: customer.note,
            locationId,
            total,
            items: order.items
          })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          alert("Erreur commande : " + (result.error || "création impossible"));
          return;
        }

        order.dbId = result.id;
        order.createdAt = result.created_at || order.createdAt;
      }
      await sendOrderNotification(order, total);
      setOrders(old => [order, ...old]);
      setCart({});
      setCustomer({ firstName:"", lastName:"", phone:"", email:"", note:"" });
      setCartDrawerOpen(false);
      setView("site");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 150);
      alert(`Demande enregistrée : ${order.id}\nTina confirmera par téléphone, WhatsApp ou email.`);
    } finally {
      setOrderSubmitting(false);
    }
  }

  async function updateOrderStatus(id, status) {
    const order = orders.find(o => o.id === id);
    setOrders(old => old.map(o => o.id === id ? { ...o, status } : o));
    if (supabase && order?.dbId) await supabase.from("orders").update({ status }).eq("id", order.dbId);
  }
  async function updateProduct(id, field, value) {
    setProducts(old => old.map(p => p.id === id ? { ...p, [field]: value } : p));
    if (supabase) await supabase.from("products").update({ [field === "desc" ? "description" : field]: value }).eq("id", id);
  }
  async function updateLocation(id, field, value) {
    setLocations(old => old.map(l => l.id === id ? { ...l, [field]: value } : l));
    if (supabase) await supabase.from("locations").update({ [field]: value }).eq("id", id);
  }

  function slugify(value = "") {
    return String(value).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `item-${Date.now()}`;
  }

  async function addProductFromDashboard() {
    if (!newProduct.name || !newProduct.price) return alert("Nom et prix obligatoires.");
    const product = {
      id: `${slugify(newProduct.code || newProduct.category)}-${slugify(newProduct.name)}`,
      code: newProduct.code || "NEW",
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      available: true,
      fixed: Boolean(newProduct.fixed),
      desc: newProduct.desc || "Ajouté depuis le dashboard."
    };
    setProducts(old => [...old, product]);
    if (supabase) await supabase.from("products").upsert({ id:product.id, code:product.code, name:product.name, category:product.category, price:product.price, available:product.available, fixed:product.fixed, description:product.desc });
    setNewProduct({ code:"", name:"", category:"Entrées", price:"", desc:"", available:true, fixed:true });
  }

  async function addLocationFromDashboard() {
    if (!newLocation.city || !newLocation.label || !newLocation.hours) return alert("Ville, libellé et horaires obligatoires.");
    const location = {
      id: `${slugify(newLocation.city).slice(0,4).toUpperCase()}${Date.now().toString().slice(-3)}`,
      city:newLocation.city,
      label:newLocation.label,
      place:newLocation.place,
      day:newLocation.day,
      hours:newLocation.hours,
      active:true
    };
    setLocations(old => [...old, location]);
    if (supabase) await supabase.from("locations").upsert(location);
    setNewLocation({ city:"", label:"", place:"", day:"Dimanche", hours:"16h30 – 21h30", active:true });
  }
  async function toggleOrdersOpen() {
    const next = !ordersOpen; setOrdersOpen(next);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:next, service_orders_open:serviceOrdersOpen, stock_blocks:stockBlocks, site_message:siteMessage });
  }
  async function toggleServiceOrdersOpen() {
    const next = !serviceOrdersOpen; setServiceOrdersOpen(next);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:ordersOpen, service_orders_open:next, stock_blocks:stockBlocks, site_message:siteMessage });
  }
  async function saveSiteMessage(value) {
    setSiteMessage(value);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:ordersOpen, service_orders_open:serviceOrdersOpen, stock_blocks:stockBlocks, site_message:value });
  }

  const blockGroupLabels = {
    thai: "Plats thaï",
    sushi: "Sushis & poké bowls"
  };

  function productBlockGroup(product) {
    if (!product) return null;
    if (["Plats permanents", "Plats de la semaine", "Plats avec nouilles", "Plats avec riz", "Currys"].includes(product.category)) return "thai";
    if (["Mix sushi découverte", "Sushis", "Makis", "California", "Sushis spécial", "Crunch", "Makis printemps", "Poké bowls"].includes(product.category)) return "sushi";
    return null;
  }

 function isProductEnabledForLocation(product, locId = locationId) {
  if (!product || !locId) return false;
  const code = locationCode(locId);
  return stockBlocks?.[code]?.products?.[product.id] === true;
}

  function isCategoryBlockedForLocation(product, locId) {
    const group = productBlockGroup(product);
    if (!group) return false;
    const code = locationCode(locId);
    return Boolean(stockBlocks?.[code]?.[group]);
  }

  function isProductBlocked(product) {
  if (isProductDisabledForLocation(product, locationId)) return true;
  if (isProductEnabledForLocation(product, locationId)) return false;
  return isCategoryBlockedForLocation(product, locationId);
}

  function blockedMessagesForLocation(location) {
    const code = locationCode(location?.id);
    const blocks = stockBlocks?.[code] || {};
    return Object.entries(blockGroupLabels)
      .filter(([group]) => blocks[group])
      .map(([group, label]) => ({
        group,
        label,
        text: `${label} complets à la réservation pour ${location?.city || "cet emplacement"}. Une sélection pourra être disponible directement au camion pendant le service, selon le stock du jour.`
      }));
  }

  const currentBlockMessages = blockedMessagesForLocation(selectedLocation);

  async function saveStockBlocks(nextBlocks) {
    setStockBlocks(nextBlocks);
    if (supabase) {
      await supabase.from("settings").upsert({
        id:"main",
        orders_open:ordersOpen,
        service_orders_open:serviceOrdersOpen,
        stock_blocks:nextBlocks,
        site_message:siteMessage
      });
    }
  }

  async function toggleStockBlockForLocation(code, group) {
    const current = stockBlocks?.[code]?.[group] || false;
    const nextBlocks = {
      ...(stockBlocks || {}),
      [code]: {
        ...(stockBlocks?.[code] || {}),
        [group]: !current
      }
    };
    await saveStockBlocks(nextBlocks);
  }

  async function toggleProductForLocation(code, productId) {
    const current = stockBlocks?.[code]?.products?.[productId] !== false;
    const nextBlocks = {
      ...(stockBlocks || {}),
      [code]: {
        ...(stockBlocks?.[code] || {}),
        products: {
          ...(stockBlocks?.[code]?.products || {}),
          [productId]: !current
        }
      }
    };
    await saveStockBlocks(nextBlocks);
  }

  function parseServiceHours(hours = "") {
    const matches = String(hours).match(/(\d{1,2})h(\d{2})/g) || [];
    const parse = (value, fallbackHour, fallbackMinute) => {
      const match = String(value || "").match(/(\d{1,2})h(\d{2})/);
      return { hour: match ? Number(match[1]) : fallbackHour, minute: match ? Number(match[2]) : fallbackMinute };
    };
    const start = parse(matches[0], 8, 0);
    const end = parse(matches[1], 13, 0);
    return { start, end };
  }

  function getServiceDate(location) {
    const dayMap = { Dimanche: 0, Lundi: 1, Mardi: 2, Mercredi: 3, Jeudi: 4, Vendredi: 5, Samedi: 6 };
    const target = dayMap[location?.day] ?? new Date().getDay();
    const today = new Date();
    const result = new Date(today);
    result.setHours(0, 0, 0, 0);
    let diff = (target - today.getDay() + 7) % 7;
    const { end } = parseServiceHours(location?.hours);
    const serviceEndToday = new Date(result);
    serviceEndToday.setHours(end.hour, end.minute, 0, 0);
    if (diff === 0 && today > serviceEndToday) diff = 7;
    result.setDate(today.getDate() + diff);
    return result;
  }

  function getServiceWindow(location) {
    const date = getServiceDate(location);
    const { start, end } = parseServiceHours(location?.hours);
    const startDate = new Date(date);
    startDate.setHours(start.hour, start.minute, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(end.hour, end.minute, 0, 0);
    const pickupEndDate = new Date(endDate);
    pickupEndDate.setMinutes(pickupEndDate.getMinutes() - 30);
    return { date, startDate, endDate, pickupEndDate };
  }

  function formatTime(date) {
    return date.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" }).replace(":", "h");
  }

  function servicePickupText(location) {
    if (!location) return "Choisissez votre lieu de retrait";
    const { pickupEndDate } = getServiceWindow(location);
    return `${location?.hours || ""} · retrait max ${formatTime(pickupEndDate)}`;
  }

  function formatServiceDate(location) {
    const date = getServiceDate(location);
    const label = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function getOrderAvailability(location) {
    if (!location) {
      return { open: false, mode: "no_location", message: "Choisissez d’abord votre lieu de retrait." };
    }
    const now = new Date();
    const { date, endDate, pickupEndDate } = getServiceWindow(location);

    const closingDate = new Date(date);
    closingDate.setDate(closingDate.getDate() - 1);
    closingDate.setHours(23, 0, 0, 0);

    const serviceOpenDate = new Date(date);
    serviceOpenDate.setHours(0, 0, 0, 0);

    if (!ordersOpen && !serviceOrdersOpen) {
      return {
        open: false,
        mode: "closed",
        message: "Les commandes sont actuellement fermées par Tina."
      };
    }

    if (ordersOpen && now < closingDate) {
      return {
        open: true,
        mode: "preorder",
        message: "Précommande ouverte jusqu’à la veille 23h."
      };
    }

    if (serviceOrdersOpen && now >= serviceOpenDate && now <= pickupEndDate) {
      return {
        open: true,
        mode: "service",
        message: `Commande en direct au food truck. Retrait possible jusqu’à ${formatTime(pickupEndDate)}. Paiement sur place.`
      };
    }

    if (now > endDate) {
      return {
        open: false,
        mode: "ended",
        message: `Le service est terminé pour ${location.city}.`
      };
    }

    return {
      open: false,
      mode: "preorder_closed",
      message: `Les précommandes pour ${location.city} sont fermées.`
    };
  }


  function getPreorderClosingDate(location) {
    const { date } = getServiceWindow(location);
    const closingDate = new Date(date);
    closingDate.setDate(closingDate.getDate() - 1);
    closingDate.setHours(23, 0, 0, 0);
    return closingDate;
  }

  function getWeeklyThaiOpeningDate(location) {
    const { date } = getServiceWindow(location);
    const openingDate = new Date(date);
    const day = openingDate.getDay();
    openingDate.setDate(openingDate.getDate() - day);
    openingDate.setHours(18, 0, 0, 0);
    return openingDate;
  }

  function isWeeklyThaiProduct(product) {
    return Boolean(product && product.fixed === false && ["Plats avec riz", "Currys"].includes(product.category));
  }

  function weeklyThaiLockReason(product) {
    if (!selectedLocation) return "";
    if (isProductEnabledForLocation(product, selectedLocation.id)) return "";
    if (!isWeeklyThaiProduct(product)) return "";
    if (selectedAvailability.mode === "service") return "";

    const now = new Date();
    const openingDate = getWeeklyThaiOpeningDate(selectedLocation);
    const closingDate = getPreorderClosingDate(selectedLocation);

    if (now < openingDate) {
      return "Disponible après annonce du menu de la semaine, dimanche soir ou lundi matin.";
    }
    if (now >= closingDate) {
      return "Précommandes clôturées pour ce plat de la semaine. Clôture la veille du service à 23h.";
    }
    return "";
  }

  function isWeeklyThaiProductLocked(product) {
    return Boolean(weeklyThaiLockReason(product));
  }

  function buildWhatsAppMessage(order, loc) {
    return `Bonjour,

Votre commande ${order.id} est bien confirmée pour ${loc.city} le ${formatServiceDate(loc)}.

Vous pourrez la récupérer pendant le service directement au food truck. Retrait max : ${formatTime(getServiceWindow(loc).pickupEndDate)}.

Merci et à très bientôt 🙏🌶️
KRUA PEÈN THAÏ`;
  }

  function buildSmsMessage(order, loc) {
    return `KRUA PEÈN THAÏ : Commande ${order.id} confirmée pour ${loc.city} ${formatServiceDate(loc)}. Retrait max ${formatTime(getServiceWindow(loc).pickupEndDate)} au food truck. Merci 🌶️`;
  }

  function smsLink(phone, text) {
    const normalized = String(phone || "").replace(/\s/g, "");
    return `sms:${normalized}?body=${encodeURIComponent(text)}`;
  }

  async function sendConfirmationEmail(order, loc) {
    if (!order.customer.email) {
      alert("Aucune adresse email renseignée pour cette commande.");
      return;
    }

    const orderTotal = orderGrandTotal(order);
    const subject = `Confirmation commande ${order.id} - KRUA PEÈN THAÏ`;
    const itemsText = order.items.map(item => `- ${item.qty} x ${item.name} : ${euro(item.qty * item.price)}`).join("%0D%0A");
    const discount = orderDiscountAmount(order);
    const discountText = discount > 0 ? `%0D%0ARemise sushis -10% : -${euro(discount)}` : "";
    const body = `Bonjour,%0D%0A%0D%0AVotre commande ${order.id} est bien confirmée.%0D%0A%0D%0ARetrait : ${loc.city} - ${formatServiceDate(loc)} - ${servicePickupText(loc)}%0D%0A%0D%0ADétail :%0D%0A${itemsText}${discountText}%0D%0A%0D%0ATotal : ${euro(orderTotal)}%0D%0A%0D%0AMerci et à bientôt,%0D%0AKRUA PEÈN THAÏ`;

    window.location.href = `mailto:${encodeURIComponent(order.customer.email)}?subject=${encodeURIComponent(subject)}&body=${body}`;
    await updateOrderStatus(order.id, "Confirmée");
  }

  async function copyMessageToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Message copié. Tina peut le coller dans WhatsApp ou SMS.");
    } catch (error) {
      alert("Impossible de copier automatiquement. Sélectionne le message depuis WhatsApp/SMS si besoin.");
    }
  }

  function formatDateTime(value) {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleString("fr-FR", {
      day:"2-digit",
      month:"2-digit",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    });
  }

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function eposText(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function normalizeTicketText(value = "") {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/œ/g, "oe")
      .replace(/Œ/g, "OE")
      .replace(/æ/g, "ae")
      .replace(/Æ/g, "AE")
      .replace(/[•]/g, "-")
      .replace(/[€]/g, "EUR");
  }

  function ticketLine(left = "", right = "", width = 42) {
    const l = normalizeTicketText(left).slice(0, width);
    const r = normalizeTicketText(right).slice(0, width);
    const spaces = Math.max(1, width - l.length - r.length);
    return `${l}${" ".repeat(spaces)}${r}`;
  }

  function ticketWrap(text = "", width = 42) {
    const clean = normalizeTicketText(text).trim();
    if (!clean) return [];
    const words = clean.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      if (!line) line = word;
      else if ((line + " " + word).length <= width) line += " " + word;
      else { lines.push(line); line = word; }
    });
    if (line) lines.push(line);
    return lines;
  }

  function printKitchenTicket(order, loc) {
    const orderTotal = orderGrandTotal(order);
    const discountAmount = orderDiscountAmount(order);
    const fullName = `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim();
    const itemsHtml = order.items.map(item => `
      <div class="line"><span>${escapeHtml(`${item.qty} x ${item.name}`)}</span><b>${escapeHtml(euro(item.qty * item.price))}</b></div>
    `).join("");
    const discountHtml = discountAmount > 0 ? `<div class="line discount"><span>Remise sushis -10%</span><b>-${escapeHtml(euro(discountAmount))}</b></div>` : "";
    const noteHtml = order.customer.note ? `<div class="section"><h3>NOTE CLIENT</h3><div class="note">${escapeHtml(order.customer.note).toUpperCase()}</div></div>` : "";

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Ticket ${escapeHtml(order.id)}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  body { width: 72mm; margin: 0; font-family: Arial, sans-serif; color: #000; font-size: 15px; }
  .ticket { width: 72mm; }
  .center { text-align: center; }
  h1 { font-size: 25px; margin: 0 0 2px; font-weight: 900; }
  h2 { font-size: 24px; margin: 8px 0; font-weight: 900; text-align: center; }
  h3 { font-size: 16px; margin: 0 0 4px; font-weight: 900; }
  .sub { font-size: 14px; margin-bottom: 8px; }
  .sep { border-top: 1px dashed #000; margin: 8px 0; }
  .section { margin: 8px 0; }
  .big { font-size: 20px; font-weight: 900; }
  .line { display: flex; justify-content: space-between; gap: 8px; margin: 7px 0; font-size: 16px; font-weight: 700; }
  .line span { flex: 1; }
  .discount { color: #000; }
  .total { display: flex; justify-content: space-between; font-size: 24px; font-weight: 900; margin-top: 8px; }
  .note { font-size: 20px; font-weight: 900; white-space: pre-wrap; }
  .small { font-size: 13px; }
  @media print { button { display: none; } }
</style>
</head>
<body>
  <div class="ticket">
    <div class="center">
      <h1>KRUA PEÈN THAÏ</h1>
      <div class="sub">Thaï • Sushi • Poké</div>
    </div>
    <div class="sep"></div>
    <h2>${escapeHtml(order.id)}</h2>
    <div class="sep"></div>
    <div class="section">
      <h3>COMMANDÉ LE</h3>
      <div>${escapeHtml(formatDateTime(order.createdAt))}</div>
    </div>
    <div class="sep"></div>
    <div class="section">
      <h3>RETRAIT</h3>
      <div class="big">${escapeHtml(String(loc.city || "").toUpperCase())}</div>
      <div>${escapeHtml(loc.place || "")}</div>
      <div>${escapeHtml(formatServiceDate(loc))}</div>
      <div>${escapeHtml(servicePickupText(loc))}</div>
    </div>
    <div class="sep"></div>
    <div class="section">
      <h3>CLIENT</h3>
      ${fullName ? `<div class="big">${escapeHtml(fullName.toUpperCase())}</div>` : ""}
      ${order.customer.phone ? `<div>${escapeHtml(order.customer.phone)}</div>` : ""}
      ${order.customer.email ? `<div class="small">${escapeHtml(order.customer.email)}</div>` : ""}
    </div>
    <div class="sep"></div>
    <div class="section">${itemsHtml}${discountHtml}</div>
    ${noteHtml}
    <div class="sep"></div>
    <div class="total"><span>TOTAL</span><span>${escapeHtml(euro(orderTotal))}</span></div>
  </div>
  <script>
    window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };
  </script>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=420,height=700");
    if (!printWindow) {
      alert("Popup bloquée. Autorise les popups pour imprimer le ticket.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  const activeOrdersCount = orders.filter(o => o.status === "À confirmer").length;

  const visibleOrders = useMemo(() => {
    const statusOrder = { "À confirmer":0, "Confirmée":1, "Récupérée":2, "Annulée":3 };
    const q = orderSearch.trim().toLowerCase();
    return orders
      .filter(o => adminLocationFilter === "ALL" || locationCode(o.locationId) === adminLocationFilter)
      .filter(o => {
        if (adminStatusFilter === "ACTIVE") return o.status === "À confirmer";
        if (adminStatusFilter === "ALL") return true;
        return o.status === adminStatusFilter;
      })
      .filter(o => !hideDoneOrders || (o.status !== "Récupérée" && o.status !== "Annulée"))
      .filter(o => !q || [o.id,o.customer.firstName,o.customer.lastName,o.customer.phone,o.customer.email,locations.find(l=>l.id===o.locationId)?.city].filter(Boolean).join(" ").toLowerCase().includes(q))
      .sort((a,b)=>(statusOrder[a.status]??9)-(statusOrder[b.status]??9));
  }, [orders, orderSearch, locations, adminLocationFilter, adminStatusFilter, hideDoneOrders]);

  const prepSummary = useMemo(() => {
    const groups = { PLAB: {}, BRI: {}, KER: {} };
    orders
      .filter(o => o.status !== "Annulée" && o.status !== "Récupérée")
      .filter(o => adminLocationFilter === "ALL" || locationCode(o.locationId) === adminLocationFilter)
      .forEach(o => {
        const code = locationCode(o.locationId);
        if (!groups[code]) groups[code] = {};
        o.items.forEach(i => { groups[code][i.name] = (groups[code][i.name] || 0) + i.qty; });
      });
    return Object.entries(groups)
      .map(([code, items]) => ({ code, items: Object.entries(items).sort((a,b)=>b[1]-a[1]) }))
      .filter(group => group.items.length);
  }, [orders, adminLocationFilter]);

  const prepHistoryByLocation = useMemo(() => {
    const groups = {};
    orders
      .filter(o => adminLocationFilter === "ALL" || locationCode(o.locationId) === adminLocationFilter)
      .filter(o => adminStatusFilter === "ALL" || adminStatusFilter === "ACTIVE" ? (adminStatusFilter === "ALL" ? true : (o.status === "À confirmer" || o.status === "Confirmée")) : o.status === adminStatusFilter)
      .forEach(order => {
        const code = locationCode(order.locationId);
        const loc = locations.find(l => l.id === order.locationId);
        if (!groups[code]) groups[code] = { code, label: loc ? `${loc.city} · ${loc.label}` : code, orders: [], totals: {} };
        groups[code].orders.push(order);
        if (order.status !== "Annulée" && order.status !== "Récupérée") {
          order.items.forEach(item => {
            groups[code].totals[item.name] = (groups[code].totals[item.name] || 0) + item.qty;
          });
        }
      });
    return Object.values(groups).map(group => ({
      ...group,
      orders: group.orders.sort((a,b)=>new Date(b.createdAt || 0)-new Date(a.createdAt || 0)),
      totals: Object.entries(group.totals).sort((a,b)=>b[1]-a[1])
    })).sort((a,b)=>a.code.localeCompare(b.code));
  }, [orders, locations, adminLocationFilter, adminStatusFilter]);

  function goToMenuCategory(category) {
    setCategoryFilter("Tous");
    setOpenCategory(category);
    setTimeout(() => document.getElementById("commander")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  const asset = (name) => `/krua-v3/${name}`;

  const thaiEntreeRows = [
    { label: "Rouleau de printemps crevette", ids: ["e1", "e1-4"] },
    { label: "Nems crevettes", ids: ["e2", "e2-4"] },
    { label: "Nems porc", ids: ["e3", "e3-4"] },
    { label: "Nems légumes", ids: ["e4", "e4-4"] },
    { label: "Nems poulet", ids: ["e5", "e5-4"] },
    { label: "Samoussas bœuf", ids: ["e6", "e6-4"] },
    { label: "Samoussas porc basilic Thaï", ids: ["e7", "e7-4"] },
    { label: "Brochette de poulet pané", ids: ["e8"] },
    { label: "Bouchée vapeur poulet & crevette", ids: ["e9", "e9-6"] },
  ];

  const thaiAccompanimentIds = ["riz-cantonais", "nouilles-sautees-accompagnement"];
  const thaiRiceOptionIds = ["option-riz-cantonais", "option-nouilles-sautees"];
  const sushiAccompanimentIds = ["s35", "s36", "s37"];
  const sushiCategories = ["Mix sushi découverte", "Sushis", "Makis", "California", "Sushis spécial", "Crunch", "Makis printemps", "Poké bowls"];

  function findProduct(id) {
    return products.find((p) => p.id === id);
  }

  function canOrderProduct(product) {
    if (!selectedLocation) return Boolean(product && product.available);
    return Boolean(product && product.available && selectedAvailability.open && !isProductBlocked(product) && !isWeeklyThaiProductLocked(product));
  }

  function addProduct(product) {
    if (!product) return;
    if (!selectedLocation) {
      setLocationModalOpen(true);
      return;
    }
    if (!selectedAvailability.open) return alert(selectedAvailability.message);
    if (!product.available) return alert(`${product.name} n'est pas disponible cette semaine.`);
    const weeklyReason = weeklyThaiLockReason(product);
    if (weeklyReason) return alert(weeklyReason);
    if (isProductDisabledForLocation(product)) return alert(`${product.name} n'est pas disponible pour cet emplacement.`);
    if (isCategoryBlockedForLocation(product, locationId)) return alert(`${product.name} est complet à la réservation pour cet emplacement.`);
    addToCart(product.id);
  }

  function productSort(a, b) {
    const parse = (p) => Number(String(p.code || "").replace(/\D/g, "")) || 999;
    return parse(a) - parse(b) || String(a.name).localeCompare(String(b.name));
  }

  function categoryProducts(category) {
    return products
      .filter((p) => p.category === category)
      .filter((p) => !thaiRiceOptionIds.includes(p.id))
      .filter((p) => !(category === "Accompagnements" && sushiAccompanimentIds.includes(p.id)))
      .sort(productSort);
  }

  function productsFromIds(ids) {
    return ids.map(findProduct).filter(Boolean);
  }

  function productImage(product) {
    if (!product) return asset("thai-padthai.png");
    const name = String(product.name || "").toLowerCase();
    const category = String(product.category || "");

    if (category === "Mix sushi découverte" || name.includes("mix découverte")) return asset("mix-sushi-decouverte.jpg");
    if (category === "Poké bowls" || name.includes("poké") || name.includes("poke")) return asset("sushi-poke.png");
    if (category === "Sushis spécial" || name.includes("sandwich") || name.includes("dragon")) return asset("sushi-sandwich.jpg");
    if (category === "California") return asset("sushi-california.jpg");
    if (category === "Crunch") return asset("sushi-crunch.jpg");
    if (category === "Makis printemps") return asset("sushi-maki-printemps.jpg");
    if (category === "Makis") return asset("sushi-maki.jpg");
    if (category === "Sushis") return asset("sushi-saumon.jpg");
    if (name.includes("riz vinaigr") || name.includes("tartare") || name.includes("salade de chou")) return asset("sushi-accompagnement.jpg");

    if (category === "Entrées" || name.includes("bouch") || name.includes("nem") || name.includes("samoussa") || name.includes("brochette")) return asset("thai-entrees.png");
    if (name.includes("riz cantonais")) return asset("thai-accompagnement.png");
    if (name.includes("nouilles") || name.includes("pad thaï") || name.includes("pad thai")) return asset("thai-padthai.png");
    if (name.includes("curry")) return asset("thai-curry.jpg");
    if (category === "Plats avec riz" || name.includes("porc") || name.includes("poulet") || name.includes("kra pao") || name.includes("nam man")) return asset("thai-rice.jpg");

    return asset("thai-padthai.png");
  }

  function PriceAddButton({ product, label }) {
    const disabled = !canOrderProduct(product);
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => addProduct(product)}
        className={`rounded-2xl px-3 py-2 text-sm font-black transition ${disabled ? "bg-white/5 text-stone-500 line-through" : "bg-amber-400 text-black shadow-lg shadow-amber-500/15 hover:bg-amber-300"}`}
      >
        <span className="block text-[10px] uppercase tracking-wide opacity-70">{label}</span>
        {product ? euro(product.price) : "—"}
      </button>
    );
  }

  function ProductCard({ product }) {
    if (!product) return null;
    const blocked = isProductBlocked(product);
    const weeklyReason = weeklyThaiLockReason(product);
    const disabled = !product.available || blocked || Boolean(weeklyReason) || !selectedAvailability.open;
    return (
      <article className={`rounded-2xl border p-4 transition ${disabled ? "border-white/5 bg-stone-950/45 opacity-50" : "border-white/10 bg-stone-950/80 hover:border-amber-300/35"}`}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-xs font-black text-amber-300">{product.code}</div>
            <h4 className="text-lg font-black leading-tight">{product.name}</h4>
          </div>
          <div className="shrink-0 text-lg font-black text-amber-300">{euro(product.price)}</div>
        </div>
        <p className="min-h-10 text-sm text-stone-300">{product.desc}</p>
        {weeklyReason && <p className="mt-2 rounded-xl bg-amber-950/70 p-3 text-sm font-black text-amber-100">⏰ {weeklyReason}</p>}
        {blocked && <p className="mt-2 rounded-xl bg-orange-950/70 p-2 text-xs font-bold text-orange-100">{isProductDisabledForLocation(product) ? "Non disponible pour ce lieu de retrait." : "Complet à la réservation pour cet emplacement."}</p>}
        {!product.available && <p className="mt-2 rounded-xl bg-white/5 p-2 text-xs font-bold text-stone-400">Non disponible cette semaine.</p>}
        <button disabled={disabled} onClick={() => addProduct(product)} className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 font-black text-black disabled:bg-white/10 disabled:text-stone-500">
          Ajouter
        </button>
      </article>
    );
  }

  function EntreesPaperMenu() {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[#090705] shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-amber-300/10 bg-gradient-to-r from-amber-500/15 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black text-amber-200">🥟 Entrées thaï</h3>
            <p className="mt-1 text-sm text-stone-300">Cliquer directement sur le prix.</p>
          </div>
          <img src={asset("thai-entrees.png")} alt="Entrées thaï" className="h-24 w-full rounded-2xl object-cover sm:w-44" />
        </div>
        <div className="divide-y divide-white/10">
          {thaiEntreeRows.map((row) => {
            const p1 = findProduct(row.ids[0]);
            const p2 = findProduct(row.ids[1]);
            const disabled = (p1 && (!p1.available || isProductBlocked(p1))) && (!p2 || !p2.available || isProductBlocked(p2));
            return (
              <div key={row.label} className={`grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center ${disabled ? "opacity-50" : ""}`}>
                <div>
                  <div className="font-black text-white">{row.label}</div>
                  <div className="text-xs text-stone-400">{p1?.code || ""} {disabled ? "• non disponible" : ""}</div>
                </div>
                <PriceAddButton product={p1} label="1 pièce" />
                {p2 ? <PriceAddButton product={p2} label={p2.name.includes("x6") ? "6 pièces" : "4 pièces"} /> : <div className="hidden sm:block" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  const sushiGroupedRows = [
    { label: "Sushis saumon", ids: ["s1", "s2"], labels: ["6 pièces", "10 pièces"] },
    { label: "Sushis crevettes", ids: ["s3", "s4"], labels: ["6 pièces", "10 pièces"] },
    { label: "Sushis saumon avocat", ids: ["s5"], labels: ["6 pièces"] },
    { label: "Sushis crevettes avocat", ids: ["s6"], labels: ["6 pièces"] },
  ];

  function SushisPaperMenu() {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[#090705] shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-amber-300/10 bg-gradient-to-r from-amber-500/15 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-black text-amber-200">🍣 Sushis</h3>
            <p className="mt-1 text-sm text-stone-300">Choisissez directement 6 ou 10 pièces.</p>
          </div>
          <img src={asset("sushi-saumon.jpg")} alt="Sushis saumon" className="h-24 w-full rounded-2xl object-cover sm:w-44" />
        </div>
        <div className="divide-y divide-white/10">
          {sushiGroupedRows.map((row) => {
            const productsRow = row.ids.map(findProduct).filter(Boolean);
            const disabled = productsRow.length > 0 && productsRow.every((product) => !canOrderProduct(product));
            return (
              <div key={row.label} className={`grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center ${disabled ? "opacity-50" : ""}`}>
                <div>
                  <div className="font-black text-white">{row.label}</div>
                  <div className="text-xs text-stone-400">{productsRow.map(p => p.code).join(" / ")} {disabled ? "• non disponible" : ""}</div>
                </div>
                {row.ids.map((id, index) => (
                  <PriceAddButton key={id} product={findProduct(id)} label={row.labels[index] || ""} />
                ))}
                {row.ids.length === 1 && <div className="hidden sm:block" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const thaiCategoryCards = [
    { label: "Entrées", image: asset("thai-entrees.png"), anchor: "thai-entrees" },
    { label: "Plats avec nouilles", image: asset("thai-padthai.png"), anchor: "thai-nouilles" },
    { label: "Plats avec riz", image: asset("thai-rice.jpg"), anchor: "thai-riz" },
    { label: "Currys", image: asset("thai-curry.jpg"), anchor: "thai-currys" },
    { label: "Accompagnements", image: asset("thai-accompagnement.png"), anchor: "thai-accompagnements" },
  ];

  const sushiCategoryCards = [
    { label: "Mix découverte", image: asset("mix-sushi-decouverte.jpg"), anchor: "sushi-mix" },
    { label: "Sushis", image: asset("sushi-saumon.jpg"), anchor: "sushi-sushis" },
    { label: "Makis", image: asset("sushi-maki.jpg"), anchor: "sushi-makis" },
    { label: "California", image: asset("sushi-california.jpg"), anchor: "sushi-california" },
    { label: "Crunch", image: asset("sushi-crunch.jpg"), anchor: "sushi-crunch" },
    { label: "Sandwich sushi", image: asset("sushi-sandwich.jpg"), anchor: "sushi-special" },
    { label: "Makis printemps", image: asset("sushi-maki-printemps.jpg"), anchor: "sushi-printemps" },
    { label: "Poké bowls", image: asset("sushi-poke.png"), anchor: "sushi-poke" },
    { label: "Accompagnements", image: asset("sushi-accompagnement.jpg"), anchor: "sushi-accompagnements" },
  ];

  function CategoryMiniNav({ title, cards }) {
    return (
      <div className="mb-5 rounded-[2rem] border border-amber-300/15 bg-black/35 p-4">
        <div className="mb-3 text-center text-sm font-black uppercase tracking-wide text-amber-300">{title}</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
          {cards.map((card) => (
            <button key={card.anchor} type="button" onClick={() => { setOpenCategory(card.anchor); setTimeout(() => document.getElementById(card.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }} className={`group rounded-2xl border p-2 text-center transition ${openCategory === card.anchor ? "border-amber-300/70 bg-amber-400/10" : "border-white/10 bg-stone-950/80 hover:border-amber-300/40"}`}>
              <img src={card.image} alt={card.label} className="mx-auto h-16 w-20 rounded-xl object-cover transition group-hover:scale-105" />
              <div className="mt-2 min-h-[2rem] text-[11px] font-black leading-tight text-white [overflow-wrap:anywhere] sm:text-sm">{card.label}</div>
              <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-amber-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  function CategorySection({ id, title, image, children }) {
    const isOpen = openCategory === id;
    return (
      <section id={id} className={`scroll-mt-24 overflow-hidden rounded-[2rem] border transition ${isOpen ? "border-amber-300/35 bg-black/45" : "border-white/10 bg-black/25"}`}>
        <button
          type="button"
          onClick={() => setOpenCategory(isOpen ? "" : id)}
          className="flex w-full items-center gap-4 bg-gradient-to-r from-amber-500/10 to-transparent p-4 text-left"
        >
          <img src={image} alt="" className="h-16 w-20 rounded-2xl object-cover shadow-lg shadow-black/30 sm:h-20 sm:w-28" />
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-amber-200 sm:text-2xl">{title}</h3>
            <p className="text-sm text-stone-300">{isOpen ? "Cliquer pour refermer cette catégorie." : "Cliquer pour voir les menus et compositions."}</p>
          </div>
          <ChevronDown className={`shrink-0 text-amber-300 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && <div className="border-t border-white/10 p-4">{children}</div>}
      </section>
    );
  }

  function CategoryBlock({ title, subtitle, image, children }) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-stone-950/80 shadow-2xl">
        <div className="relative min-h-44 overflow-hidden p-5 sm:p-6">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl font-black text-amber-200">{title}</h3>
            <p className="mt-2 text-sm text-stone-200">{subtitle}</p>
          </div>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </section>
    );
  }

  function ProductGrid({ items }) {
    return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>;
  }

  function renderCartPanel(mobile = false) {
    return (
      <aside className={`${mobile ? "max-h-[92dvh] overflow-y-auto overscroll-contain" : "sticky top-24 h-fit"} rounded-[2rem] border border-amber-300/20 bg-black p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black">Votre commande</h3>
            <p className="text-sm text-stone-400">Paiement sur place, confirmation par Tina.</p>
          </div>
          {mobile && <button onClick={() => setCartDrawerOpen(false)} className="rounded-full bg-white/10 px-4 py-2 font-black">✕</button>}
        </div>

        <label className="text-sm font-bold text-stone-300">Lieu de retrait</label>
        <select value={locationId} onChange={e=>setLocationId(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-stone-900 p-3">
          {visibleLocations.map(l=><option key={l.id} value={l.id}>{l.label} – {l.city}</option>)}
        </select>
        <div className="mt-3 rounded-2xl bg-white/[0.04] p-3 text-sm text-stone-300"><MapPin className="mr-2 inline text-amber-300" size={16}/>{selectedLocation ? `${selectedLocation.place} • ${servicePickupText(selectedLocation)}` : "Choisissez d’abord votre lieu de retrait"}</div>
        {currentBlockMessages.map(block=><div key={block.group} className="mt-4 rounded-2xl bg-orange-950/70 p-4 text-sm font-bold text-orange-100">⚠️ {block.text}</div>)}
        {!selectedAvailability.open && <div className="mt-4 rounded-2xl bg-red-950/70 p-4 text-sm font-bold text-red-100">{selectedAvailability.message}</div>}
        {selectedAvailability.open && selectedAvailability.mode === "service" && <div className="mt-4 rounded-2xl bg-green-950/70 p-4 text-sm font-bold text-green-100">{selectedAvailability.message}</div>}

        <div className="my-5 space-y-3">
          {cartLines.length===0 && <div className="rounded-2xl bg-white/[0.04] p-4 text-stone-400">Panier vide</div>}
          {cartLines.map(line=><div key={line.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] p-3"><div><div className="font-bold">{line.name}</div><div className="text-sm text-stone-400">{line.qty} × {euro(line.price)}</div></div><div className="flex items-center gap-2"><button onClick={()=>removeFromCart(line.id)} className="rounded-xl bg-white/10 px-3 py-2 font-black">-</button><button onClick={()=>addToCart(line.id)} className="rounded-xl bg-white/10 px-3 py-2 font-black">+</button></div></div>)}
        </div>
        {sushiDiscount > 0 && <div className="mb-3 flex items-center justify-between rounded-2xl bg-green-500/10 p-3 text-sm font-black text-green-200"><span>Remise sushis -10%</span><span>-{euro(sushiDiscount)}</span></div>}
        {sushiDiscountBase > 0 && sushiDiscount === 0 && <div className="mb-3 rounded-2xl bg-amber-400/10 p-3 text-xs font-bold text-amber-100">🍣 -10% sur les sushis dès 25€ de commande sushi.</div>}
        <div className="mb-5 flex items-center justify-between border-t border-white/10 pt-4 text-xl font-black"><span>Total</span><span className="text-amber-300">{euro(total)}</span></div>
        <div className="grid gap-3">
          <input placeholder="Prénom *" autoComplete="given-name" value={customer.firstName} onChange={e=>setCustomer({...customer, firstName:e.target.value})} className="rounded-2xl border border-white/10 bg-stone-900 p-4 text-base"/>
          <input placeholder="Nom" autoComplete="family-name" value={customer.lastName} onChange={e=>setCustomer({...customer, lastName:e.target.value})} className="rounded-2xl border border-white/10 bg-stone-900 p-4 text-base"/>
          <input placeholder="Téléphone *" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} className="rounded-2xl border border-white/10 bg-stone-900 p-4 text-base"/>
          <input placeholder="Email (optionnel)" type="email" inputMode="email" autoComplete="email" value={customer.email} onChange={e=>setCustomer({...customer, email:e.target.value})} className="rounded-2xl border border-white/10 bg-stone-900 p-4 text-base"/>
          <textarea placeholder="Commentaire" value={customer.note} onChange={e=>setCustomer({...customer, note:e.target.value})} className="min-h-24 rounded-2xl border border-white/10 bg-stone-900 p-4 text-base"/>
          <button disabled={!selectedAvailability.open || orderSubmitting} onClick={submitOrder} className="rounded-2xl bg-amber-400 px-5 py-4 font-black text-black disabled:opacity-40">{orderSubmitting ? "Envoi en cours..." : selectedAvailability.open ? "Envoyer la demande" : "Commandes fermées"}</button>
          <p className="text-xs text-stone-400">{selectedAvailability.message}</p>
        </div>
      </aside>
    );
  }

  function LocationRequiredModal() {
    if (view !== "site" || !locationModalOpen) return null;
    const choices = visibleLocations.filter((l) => l.id === "PLAB" || l.id === "BRI");
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
        <div className="w-full max-w-lg rounded-[2rem] border border-amber-300/30 bg-[#090705] p-5 shadow-2xl shadow-black/60">
          <div className="mb-4 inline-flex rounded-full bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-black">Étape obligatoire</div>
          <h2 className="text-3xl font-black text-white">📍 Choisissez votre lieu de retrait</h2>
          <p className="mt-3 text-sm font-semibold text-stone-300">Les menus disponibles changent selon l’emplacement. Sélectionnez votre lieu avant de consulter la carte.</p>
          <div className="mt-6 grid gap-3">
            {choices.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setLocationId(l.id);
                  setLocationModalOpen(false);
                }}
                className="rounded-3xl border border-amber-300/25 bg-white/[0.04] p-5 text-left transition hover:border-amber-300/60 hover:bg-amber-400/10"
              >
                <div className="text-sm font-black text-amber-300">{l.label}</div>
                <div className="mt-1 text-2xl font-black text-white">{l.city}</div>
                <div className="mt-2 text-sm font-semibold text-stone-300">{l.place}</div>
                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-stone-100"><Clock size={16}/>{servicePickupText(l)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070504] text-stone-50">
      <LocationRequiredModal />
      <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => setView("site")} className="text-left"><div className="text-xl font-black tracking-wide text-amber-300">{BRAND.name}</div><div className="text-xs text-stone-300">Thaï • Sushi • Poké • Traiteur</div></button>
     <nav className="flex items-center gap-2 text-sm">


  {view === "site" && locationId && (
    <button
      onClick={() => setLocationModalOpen(true)}
      className="hidden rounded-full bg-white/10 px-4 py-2 font-bold text-stone-100 sm:inline-flex"
    >
      📍 {selectedLocation?.city || "Retrait"}
    </button>
  )}

  {view === "admin" && (
    <button
      onClick={async () => {
        if (supabase) {
          await supabase.auth.signOut();
        }
        setAdminUnlocked(false);
        setView("login");
        window.history.replaceState(null, "", "/admin");
      }}
      className="rounded-full bg-red-600 px-4 py-2 text-white font-bold"
    >
      Déconnexion Tina
    </button>
  )}
</nav>
        </div>
      </header>

      {selectedMenuCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3">
          <div className="relative max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-amber-300/30 bg-black shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <div className="text-xl font-black text-amber-300">{selectedMenuCard.title}</div>
                <div className="text-sm text-stone-300">Carte complète KRUA PEÈN THAÏ</div>
              </div>
              <button onClick={() => setSelectedMenuCard(null)} className="rounded-full bg-white/10 px-4 py-2 font-black">Fermer ✕</button>
            </div>
            <div className="max-h-[82vh] overflow-auto bg-black p-3">
              <img src={selectedMenuCard.image} alt={selectedMenuCard.title} className="mx-auto h-auto w-full max-w-4xl rounded-2xl"/>
            </div>
          </div>
        </div>
      )}

      {view === "site" ? (
        <main className="overflow-x-hidden">
          <section className="relative min-h-[70vh] overflow-hidden">
            <img src={asset("hero-sushi.jpg")} alt="Plateaux sushi KRUA PEÈN THAÏ" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,.22),transparent_35%)]" />
            <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-black/50 px-4 py-2 text-sm font-bold text-amber-100 backdrop-blur"><Sparkles size={16}/> {siteMessage}</div>
                <h1 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">KRUA PEÈN THAÏ</h1>
                <p className="mt-5 max-w-2xl text-xl font-bold text-amber-100">Cuisine thaï maison • Sushi • Poké • Traiteur événementiel</p>
                <p className="mt-4 max-w-2xl text-base text-stone-200 sm:text-lg">Food truck basé à Plabennec, présent dans le Finistère Nord. Précommande, retrait au camion et confirmation par Tina.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#commander" className="rounded-2xl bg-amber-400 px-6 py-4 font-black text-black shadow-lg shadow-amber-500/20">Commander cette semaine</a>
                  <a href="#carte" className="rounded-2xl border border-white/25 bg-black/35 px-6 py-4 font-black text-white backdrop-blur">Voir nos cartes</a>
                  <a href="#traiteur" className="rounded-2xl border border-white/25 bg-black/35 px-6 py-4 font-black text-white backdrop-blur">Demande traiteur</a>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
            <div className="rounded-[2rem] border border-amber-400/20 bg-stone-950/90 p-5 shadow-2xl sm:p-6">
              <h2 className="mb-5 text-center text-3xl font-black text-amber-300">🚚 Comment ça fonctionne ?</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-4">
                  <h3 className="mb-2 text-xl font-black text-amber-200">🍣 Sushis, poké bowls & entrées</h3>
                  <p className="text-base font-semibold leading-relaxed text-stone-200">Disponibles toute l’année à la précommande.</p>
                </div>
                <div className="rounded-2xl bg-black/35 p-4">
                  <h3 className="mb-2 text-xl font-black text-amber-200">🍜 Pad Thaï signature</h3>
                  <p className="text-base font-semibold leading-relaxed text-stone-200">Disponible chaque semaine à la précommande, avec porc, poulet ou crevettes au choix.</p>
                </div>
                <div className="rounded-2xl bg-black/35 p-4">
                  <h3 className="mb-2 text-xl font-black text-amber-200">🌶️ Plats thaï de la semaine</h3>
                  <p className="text-base font-semibold leading-relaxed text-stone-200">Les plats changent chaque semaine et sont annoncés chaque dimanche soir ou lundi matin.</p>
                </div>
                <div className="rounded-2xl bg-black/35 p-4">
                  <h3 className="mb-2 text-xl font-black text-amber-200">⏰ Précommandes</h3>
                  <p className="text-base font-semibold leading-relaxed text-stone-200">Clôture la veille du service à 23h00. Les plats de la semaine peuvent être grisés avant annonce ou après clôture.</p>
                </div>
                <div className="rounded-2xl bg-black/35 p-4 md:col-span-2">
                  <h3 className="mb-2 text-xl font-black text-amber-200">🚚 Vente directe au camion</h3>
                  <p className="text-base font-semibold leading-relaxed text-stone-200">Une sélection de plats thaï du jour, entrées, sushis et poké bowls est proposée directement au camion selon la préparation du jour.</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-amber-500/10 p-4 text-center">
                <p className="text-lg font-black text-amber-100">📍 Plabennec tous les mardis</p>
                <p className="mt-1 text-base font-black text-amber-100">15h30 à 20h30</p>
               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
  <div>
    <p className="font-black text-amber-100">📍 Brignogan</p>
    <p className="text-stone-300">Devant le camping Slow Village</p>
    <p className="font-bold">Tous les dimanches de 16h à 21h</p>
  </div>

  <div>
    <p className="font-black text-amber-100">📍 Lanarvily</p>
    <p className="text-stone-300">Prochainement</p>
  </div>
</div>
              </div>
            </div>
          </section>

          <section id="carte" className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3"><UtensilsCrossed className="text-amber-300"/><h2 className="text-4xl font-black">Nos deux univers</h2></div>
                <p className="max-w-3xl text-stone-300">Consultez la carte complète, puis commandez les produits disponibles cette semaine.</p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[2rem] border border-amber-300/20 bg-stone-950 shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img src={asset("univers-thai.jpg")} alt="Cuisine thaï" className="absolute bottom-0 right-0 h-full w-full object-contain object-right opacity-95" />
                  <img src={asset("thai-entrees.png")} alt="Entrées" className="absolute -bottom-10 -left-10 hidden h-56 w-72 object-contain opacity-90 sm:block" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-2 inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">Cuisine maison</div>
                    <h3 className="text-4xl font-black text-amber-200">Spécialités thaïlandaises</h3>
                    <p className="mt-2 max-w-md text-stone-200">Pad Thaï, currys, plats avec riz ou nouilles, entrées à partager.</p>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2"><button onClick={() => setSelectedMenuCard(menuVisualCards[0])} className="rounded-2xl border border-amber-300/30 px-4 py-3 font-black text-amber-200">Voir la carte thaï</button><button onClick={() => { setOpenCategory("thai-nouilles"); setTimeout(() => document.getElementById("thai-menu-start")?.scrollIntoView({behavior:"smooth", block:"start"}), 80); }} className="rounded-2xl bg-amber-400 px-4 py-3 font-black text-black">Commander</button></div>
              </article>
              <article className="overflow-hidden rounded-[2rem] border border-amber-300/20 bg-stone-950 shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img src={asset("univers-sushi.jpg")} alt="Sushis KRUA" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-2 inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">Sur commande</div>
                    <h3 className="text-4xl font-black text-amber-200">Sushis & Poké bowls</h3>
                    <p className="mt-2 max-w-md text-stone-200">Sushis, makis, california, crunch, makis printemps et poké bowls.</p>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2"><button onClick={() => setSelectedMenuCard(menuVisualCards[1])} className="rounded-2xl border border-amber-300/30 px-4 py-3 font-black text-amber-200">Voir la carte sushi</button><button onClick={() => { setOpenCategory("sushi-mix"); setTimeout(() => document.getElementById("sushi-menu-start")?.scrollIntoView({behavior:"smooth", block:"start"}), 80); }} className="rounded-2xl bg-amber-400 px-4 py-3 font-black text-black">Commander</button></div>
              </article>
            </div>
          </section>

          <section id="commander" className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3"><ShoppingCart className="text-amber-300"/><h2 className="text-4xl font-black">Commander cette semaine</h2></div>
                <p className="max-w-3xl text-lg font-semibold leading-relaxed text-stone-200">Précommande en ligne et vente directe au camion. Les produits indisponibles ou complets sont grisés automatiquement.</p>

              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
              <div className="min-w-0 space-y-6">
                <div id="thai-menu-start" className="scroll-mt-24" />
                <CategoryBlock title="🇹🇭 Cuisine thaïlandaise" subtitle="Entrées, plats avec nouilles, plats avec riz et currys maison." image={asset("hero-thai.jpg")}>
                  <CategoryMiniNav title="Cuisine thaïlandaise" cards={thaiCategoryCards} />
                  <div className="space-y-5">
                    <CategorySection id="thai-entrees" title="🥟 Entrées" image={asset("thai-entrees.png")}><EntreesPaperMenu /></CategorySection>
                    <CategorySection id="thai-accompagnements" title="🥣 Accompagnements" image={asset("thai-accompagnement.png")}><ProductGrid items={productsFromIds(thaiAccompanimentIds)} /></CategorySection>
                    <CategorySection id="thai-nouilles" title="🍜 Plats avec nouilles" image={asset("thai-padthai.png")}><ProductGrid items={categoryProducts("Plats avec nouilles")} /></CategorySection>
                    <CategorySection id="thai-riz" title="🍚 Plats avec riz" image={asset("thai-rice.jpg")}><ProductGrid items={[...categoryProducts("Plats avec riz"), ...productsFromIds(thaiRiceOptionIds)]} /></CategorySection>
                    <CategorySection id="thai-currys" title="🌶️ Currys" image={asset("thai-curry.jpg")}><ProductGrid items={categoryProducts("Currys")} /></CategorySection>
                  </div>
                </CategoryBlock>

                <div id="sushi-menu-start" className="scroll-mt-24" />
                <CategoryBlock title="🍣 Sushis & Poké bowls" subtitle="Sushis, makis, california, crunch & poké bowls. Remise de 10% dès 25€ de sushis." image={asset("hero-sushi.jpg")}>
                  <CategoryMiniNav title="Sushis & Poké bowls" cards={sushiCategoryCards} />
                  <div className="grid gap-5">
                    <CategorySection id="sushi-mix" title="🍱 Mix sushi découverte" image={asset("mix-sushi-decouverte.jpg")}><ProductGrid items={categoryProducts("Mix sushi découverte")} /></CategorySection>
                    <CategorySection id="sushi-sushis" title="🍣 Sushis" image={asset("sushi-saumon.jpg")}><SushisPaperMenu /></CategorySection>
                    <CategorySection id="sushi-makis" title="🍙 Makis" image={asset("sushi-maki.jpg")}><ProductGrid items={categoryProducts("Makis")} /></CategorySection>
                    <CategorySection id="sushi-california" title="🥑 California" image={asset("sushi-california.jpg")}><ProductGrid items={categoryProducts("California")} /></CategorySection>
                    <CategorySection id="sushi-crunch" title="🔥 Crunch" image={asset("sushi-crunch.jpg")}><ProductGrid items={categoryProducts("Crunch")} /></CategorySection>
                    <CategorySection id="sushi-special" title="⭐ Sandwichs sushi" image={asset("sushi-sandwich.jpg")}><ProductGrid items={categoryProducts("Sushis spécial")} /></CategorySection>
                    <CategorySection id="sushi-printemps" title="🌿 Makis printemps" image={asset("sushi-maki-printemps.jpg")}><ProductGrid items={categoryProducts("Makis printemps")} /></CategorySection>
                    <CategorySection id="sushi-poke" title="🥗 Poké bowls" image={asset("sushi-poke.png")}><ProductGrid items={categoryProducts("Poké bowls")} /></CategorySection>
                    <CategorySection id="sushi-accompagnements" title="🥣 Accompagnements sushi" image={asset("sushi-accompagnement.jpg")}><ProductGrid items={productsFromIds(sushiAccompanimentIds)} /></CategorySection>
                  </div>
                </CategoryBlock>
              </div>

              <div className="hidden lg:block">{renderCartPanel(false)}</div>
            </div>
          </section>

          <section id="lieux" className="mx-auto max-w-7xl px-4 py-12">
            <div className="mb-6 flex items-center gap-3"><CalendarDays className="text-amber-300"/><h2 className="text-3xl font-black">Où nous trouver</h2></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {visibleLocations.map(l => {
               const soon = l.id === "KERJ" || l.id === "KERD";
                return (
                  <div key={l.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="font-bold text-amber-300">{l.label}</div>
                    <div className="mt-2 text-2xl font-black">{l.city}</div>
                    {soon ? (
                      <div className="mt-4 inline-flex rounded-full bg-amber-400 px-4 py-2 text-base font-black text-black">Bientôt disponible</div>
                    ) : (
                      <>
                        <div className="mt-2 text-lg font-semibold text-stone-200">{l.place}</div>
                        <div className="mt-4 flex items-center gap-2 text-lg font-bold text-stone-100"><Clock size={18}/>{servicePickupText(l)}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section id="traiteur" className="mx-auto max-w-7xl px-4 py-12 pb-28">
            <div className="grid overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-stone-900 to-black shadow-2xl lg:grid-cols-[.95fr_1.05fr]">
              <div className="relative min-h-80"><img src={asset("camion-krua.jpg")} alt="Food truck KRUA PEÈN THAÏ" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/></div>
              <div className="p-6 sm:p-8"><div className="mb-3 inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">Traiteur événementiel</div><h2 className="text-4xl font-black">Mariage, anniversaire, entreprise, séminaire</h2><p className="mt-4 text-stone-300">Cuisine thaï maison, sushis et poké bowls pour vos événements. Tina adapte la proposition selon le nombre de personnes, le lieu et le type de repas.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/[0.04] p-4 font-bold">Mariage / retour de mariage</div><div className="rounded-2xl bg-white/[0.04] p-4 font-bold">Repas entreprise</div><div className="rounded-2xl bg-white/[0.04] p-4 font-bold">Anniversaire</div><div className="rounded-2xl bg-white/[0.04] p-4 font-bold">Séminaire</div></div><a href={whatsappLink(BRAND.phone, "Bonjour, je souhaite une demande traiteur KRUA PEÈN THAÏ.")} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-2xl bg-amber-400 px-6 py-4 font-black text-black">Demander un devis WhatsApp</a></div>
            </div>
          </section>

          {cartLines.length > 0 && <button onClick={() => setCartDrawerOpen(true)} className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-amber-400 px-5 py-4 text-center font-black text-black shadow-2xl shadow-black/40 lg:hidden">🛒 Voir mon panier ({cartLines.reduce((s,i)=>s+i.qty,0)}) • {euro(total)}</button>}
          {cartDrawerOpen && <div className="fixed inset-0 z-[90] flex items-end bg-black/75 p-3 lg:hidden"><div className="w-full rounded-[2rem] bg-black">{renderCartPanel(true)}</div></div>}
        </main>
      ) : view === "login" ? (
        <main className="mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
          <form onSubmit={signInAdmin} className="w-full max-w-md rounded-[2rem] border border-amber-300/20 bg-stone-950 p-6 shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
              <Lock className="text-amber-300"/>
              <div>
                <h1 className="text-3xl font-black text-amber-200">Dashboard Tina</h1>
                <p className="text-sm text-stone-400">Connexion admin sécurisée</p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-bold text-stone-300">Email admin</label>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              className="mb-4 w-full rounded-2xl border border-white/10 bg-black p-4"
              autoComplete="username"
            />

            <label className="mb-2 block text-sm font-bold text-stone-300">Mot de passe</label>
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              className="mb-4 w-full rounded-2xl border border-white/10 bg-black p-4"
              autoComplete="current-password"
              placeholder="Mot de passe Supabase"
            />

            {loginError && <div className="mb-4 rounded-2xl bg-red-950/70 p-4 text-sm font-bold text-red-100">{loginError}</div>}

            <button disabled={authLoading} className="w-full rounded-2xl bg-amber-400 px-6 py-4 font-black text-black disabled:opacity-50">
              {authLoading ? "Connexion..." : "Se connecter"}
            </button>

            <button type="button" onClick={() => { setView("site"); window.history.replaceState(null, "", "/"); }} className="mt-3 w-full rounded-2xl border border-white/10 px-6 py-3 font-bold text-stone-200">
              Retour site client
            </button>
          </form>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black">Dashboard Tina</h1>
              <p className="mt-2 text-stone-300">Commandes, confirmations WhatsApp/SMS, préparation cuisine.</p>
              <p className="mt-2 text-sm text-amber-300">Mode actuel : {appMode}</p>
              <p className="mt-1 text-sm text-stone-400">{notificationStatus}</p>
              <p className="mt-3 inline-flex rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-black">{activeOrdersCount} commande{activeOrdersCount > 1 ? "s" : ""} à traiter</p>
            </div>
            <button onClick={subscribeToPushNotifications} className="rounded-2xl bg-amber-400 px-5 py-3 font-black text-black">
              <Lock className="mr-2 inline" size={18}/>Activer notifications
            </button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-5">
            {[["orders","Commandes"],["prep","Prépa"],["products","Produits"],["locations","Emplacements"],["settings","Réglages"]].map(([id,label])=><button key={id} onClick={()=>setAdminTab(id)} className={`rounded-2xl p-4 text-left font-black ${adminTab===id ? "bg-amber-400 text-black" : "bg-white/10"}`}>{label}</button>)}
          </div>

          {adminTab === "orders" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
              <section className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-stone-900 p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-black">Commandes</h2>
                    <label className="flex items-center gap-2 text-sm text-stone-300"><input type="checkbox" checked={hideDoneOrders} onChange={e=>setHideDoneOrders(e.target.checked)} className="h-5 w-5 accent-amber-400"/> Masquer terminées</label>
                  </div>

                  <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <div className="flex gap-2 overflow-x-auto">
                      {[["ALL","Toutes"],["PLAB","PLAB"],["BRI","BRI"],["KER","KER"]].map(([id,label])=><button key={id} onClick={()=>setAdminLocationFilter(id)} className={`rounded-full px-4 py-3 text-sm font-black ${adminLocationFilter===id ? "bg-amber-400 text-black" : "bg-black"}`}>{label}</button>)}
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                      {[["ACTIVE","À traiter"],["ALL","Toutes"],["À confirmer","À confirmer"],["Confirmée","Confirmées"],["Récupérée","Récupérées"],["Annulée","Annulées"]].map(([id,label])=><button key={id} onClick={()=>setAdminStatusFilter(id)} className={`rounded-full px-4 py-3 text-sm font-black ${adminStatusFilter===id ? "bg-amber-400 text-black" : "bg-black"}`}>{label}</button>)}
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18}/>
                    <input value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} placeholder="Rechercher commande, nom, téléphone..." className="w-full rounded-2xl border border-white/10 bg-black py-4 pl-12 pr-4"/>
                  </div>

                  {visibleOrders.length === 0 && <div className="rounded-2xl bg-black/40 p-5 text-stone-400">Aucune commande dans ce filtre.</div>}

                  {visibleOrders.map(order=>{
                    const loc=locations.find(l=>l.id===order.locationId)||locations[0];
                    const orderTotal=orderGrandTotal(order);
                    const whatsMsg=buildWhatsAppMessage(order, loc);
                    const smsMsg=buildSmsMessage(order, loc);
                    const alreadyConfirmed = order.status === "Confirmée";
                    return <div key={order.id} id={`order-${order.id}`} className="mb-4 rounded-3xl border border-white/10 bg-black p-5">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-2xl font-black text-amber-300">{order.id}</div>
                          <div className="text-lg font-bold">{order.customer.firstName} {order.customer.lastName}</div>
                          <div className="text-stone-300">{order.customer.phone}</div>{order.customer.email && <div className="text-sm text-stone-400">{order.customer.email}</div>}
                        </div>
                        <span className={`rounded-full px-4 py-2 text-sm font-bold ${order.status==="Confirmée" ? "bg-green-500/20 text-green-300" : order.status==="Annulée" ? "bg-red-500/20 text-red-300" : order.status==="Récupérée" ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"}`}>{order.status}</span>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-4"><MapPin className="mr-2 inline text-amber-300" size={16}/>{loc.city} • {loc.label} • {formatServiceDate(loc)} • {servicePickupText(loc)}</div>
                      <div className="my-4 space-y-2">{order.items.map(item=><div key={item.id} className="flex justify-between rounded-xl bg-white/[0.04] px-4 py-3"><span>{item.qty} × {item.name}</span><b>{euro(item.qty*item.price)}</b></div>)}{orderDiscountAmount(order) > 0 && <div className="flex justify-between rounded-xl bg-green-500/10 px-4 py-3 font-black text-green-200"><span>Remise sushis -10%</span><b>-{euro(orderDiscountAmount(order))}</b></div>}</div>
                      {order.customer.note && <div className="mb-4 rounded-xl bg-amber-400/10 p-3 text-sm text-amber-100">Note : {order.customer.note}</div>}
                      <div className="mb-4 flex justify-between border-t border-white/10 pt-4 text-xl font-black"><span>Total</span><span>{euro(orderTotal)}</span></div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
                        <a href={alreadyConfirmed ? undefined : whatsappLink(order.customer.phone, whatsMsg)} target="_blank" rel="noreferrer" onClick={(e)=>{ if (alreadyConfirmed) { e.preventDefault(); return; } updateOrderStatus(order.id,"Confirmée"); }} className={`rounded-2xl px-4 py-4 text-center font-black ${alreadyConfirmed ? "pointer-events-none bg-white/10 text-stone-500 opacity-40" : "bg-green-500 text-black"}`}><MessageCircle className="mr-2 inline" size={18}/>{alreadyConfirmed ? "WhatsApp envoyé" : "Confirmer WhatsApp"}</a>
                        <a href={alreadyConfirmed ? undefined : smsLink(order.customer.phone, smsMsg)} onClick={(e)=>{ if (alreadyConfirmed) { e.preventDefault(); return; } updateOrderStatus(order.id,"Confirmée"); }} className={`rounded-2xl px-4 py-4 text-center font-black ${alreadyConfirmed ? "pointer-events-none bg-white/10 text-stone-500 opacity-40" : "bg-white/10"}`}><Phone className="mr-2 inline" size={18}/>{alreadyConfirmed ? "SMS envoyé" : "Confirmer SMS"}</a><button onClick={()=>sendConfirmationEmail(order, loc)} disabled={!order.customer.email || alreadyConfirmed} className={`rounded-2xl px-4 py-4 text-center font-black disabled:opacity-40 ${alreadyConfirmed ? "bg-white/10 text-stone-500" : "bg-amber-400 text-black"}`}><MessageCircle className="mr-2 inline" size={18}/>{alreadyConfirmed ? "Email confirmé" : "Confirmer Email"}</button>
                        <button onClick={()=>printKitchenTicket(order, loc)} className="rounded-2xl bg-amber-400 px-4 py-4 text-center font-black text-black">🖨️ Imprimer ticket</button>
                        <button onClick={()=>copyMessageToClipboard(whatsMsg)} className="rounded-2xl bg-white/10 px-4 py-4 text-center font-black"><Clipboard className="mr-2 inline" size={18}/>Copier message</button>
                        <a href={`tel:${order.customer.phone}`} className="rounded-2xl bg-white/10 px-4 py-4 text-center font-black"><Phone className="mr-2 inline" size={18}/>Appeler</a>
                        <button onClick={()=>updateOrderStatus(order.id,"Récupérée")} className="rounded-2xl bg-blue-500 px-4 py-4 font-black"><PackageCheck className="mr-2 inline" size={18}/>Récupérée</button>
                        <button onClick={()=>updateOrderStatus(order.id,"Annulée")} className="rounded-2xl bg-red-500/90 px-4 py-4 font-black"><XCircle className="mr-2 inline" size={18}/>Annuler</button>
                      </div>
                    </div>
                  })}
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-amber-300/20 bg-stone-900 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><PackageCheck className="text-amber-300"/>Résumé préparation</h2>
                  {prepSummary.length === 0 && <div className="rounded-xl bg-black/40 px-4 py-3 text-stone-400">Rien à préparer dans ce filtre.</div>}
                  <div className="space-y-4">
                    {prepSummary.map(group=><div key={group.code} className="rounded-2xl bg-black/40 p-4"><div className="mb-3 text-xl font-black text-amber-300">{group.code}</div><div className="space-y-2">{group.items.map(([name,qty])=><div key={name} className="flex justify-between rounded-xl bg-white/[0.04] px-4 py-3"><span>{name}</span><b className="text-amber-300">x{qty}</b></div>)}</div></div>)}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-stone-900 p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><Eye className="text-amber-300"/>Règles service</h2>
                  <ul className="space-y-3 text-stone-300"><li>• Précommande jusqu’à la veille 23h</li><li>• Retrait pendant le service</li><li>• Paiement sur place</li><li>• Confirmation par WhatsApp, SMS ou téléphone</li></ul>
                </div>
              </aside>
            </div>
          )}
          {adminTab === "prep" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-amber-300/20 bg-stone-900 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-black text-amber-300">🧾 Préparation cuisine</h2>
                    <p className="mt-2 text-stone-300">Liste automatique des quantités à préparer, groupée par lieu. Les commandes récupérées ou annulées ne comptent pas dans le total à préparer.</p>
                  </div>
                  <div className="rounded-2xl bg-black/40 px-4 py-3 text-sm font-bold text-stone-300">
                    Filtre actuel : {adminLocationFilter === "ALL" ? "Tous les lieux" : adminLocationFilter} · {adminStatusFilter === "ACTIVE" ? "À traiter" : adminStatusFilter}
                  </div>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  <div className="flex gap-2 overflow-x-auto">
                    {[["ALL","Tous"],["PLAB","Plabennec"],["BRI","Brignogan"],["KER","Kerlouan"]].map(([id,label])=><button key={id} onClick={()=>setAdminLocationFilter(id)} className={`rounded-full px-4 py-3 text-sm font-black ${adminLocationFilter===id ? "bg-amber-400 text-black" : "bg-black"}`}>{label}</button>)}
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {[["ACTIVE","À préparer"],["ALL","Historique"],["À confirmer","À confirmer"],["Confirmée","Confirmées"],["Récupérée","Récupérées"],["Annulée","Annulées"]].map(([id,label])=><button key={id} onClick={()=>setAdminStatusFilter(id)} className={`rounded-full px-4 py-3 text-sm font-black ${adminStatusFilter===id ? "bg-amber-400 text-black" : "bg-black"}`}>{label}</button>)}
                  </div>
                </div>

                {prepSummary.length === 0 && <div className="rounded-2xl bg-black/40 p-5 text-stone-400">Aucune quantité à préparer dans ce filtre.</div>}

                <div className="grid gap-4 lg:grid-cols-3">
                  {prepSummary.map(group=><div key={group.code} className="rounded-3xl border border-white/10 bg-black/40 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-black text-amber-300">{group.code}</h3>
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-200">À préparer</span>
                    </div>
                    <div className="space-y-2">
                      {group.items.map(([name,qty])=><div key={name} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.05] px-4 py-3">
                        <span className="font-bold">{name}</span>
                        <b className="text-2xl text-amber-300">x{qty}</b>
                      </div>)}
                    </div>
                  </div>)}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-stone-900 p-5">
                <h2 className="mb-4 text-2xl font-black">Historique des commandes par lieu</h2>
                {prepHistoryByLocation.length === 0 && <div className="rounded-2xl bg-black/40 p-5 text-stone-400">Aucune commande dans ce filtre.</div>}
                <div className="grid gap-5 lg:grid-cols-2">
                  {prepHistoryByLocation.map(group=><div key={group.code} className="rounded-3xl bg-black/40 p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-black text-amber-300">{group.code}</h3>
                        <p className="text-sm text-stone-400">{group.label}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{group.orders.length} commande{group.orders.length > 1 ? "s" : ""}</span>
                    </div>

                    {group.totals.length > 0 && <div className="mb-4 rounded-2xl border border-amber-300/10 bg-amber-400/5 p-4">
                      <h4 className="mb-2 font-black text-amber-200">Total à préparer</h4>
                      <div className="space-y-2">{group.totals.map(([name,qty])=><div key={name} className="flex justify-between gap-3 text-sm"><span>{name}</span><b className="text-amber-300">x{qty}</b></div>)}</div>
                    </div>}

                    <div className="space-y-3">
                      {group.orders.map(order=>{
                        const loc = locations.find(l=>l.id===order.locationId)||locations[0];
                        return <div key={order.id} className="rounded-2xl bg-white/[0.04] p-4">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                              <div className="font-black text-amber-300">{order.id}</div>
                              <div className="text-sm text-stone-300">{order.customer.firstName} {order.customer.lastName}</div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status==="Confirmée" ? "bg-green-500/20 text-green-300" : order.status==="Annulée" ? "bg-red-500/20 text-red-300" : order.status==="Récupérée" ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"}`}>{order.status}</span>
                          </div>
                          <div className="mb-2 text-xs text-stone-400">{formatDateTime(order.createdAt)} · {loc.city} · {loc.label}</div>
                          <div className="space-y-1">{order.items.map(item=><div key={`${order.id}-${item.id}`} className="flex justify-between gap-3 text-sm"><span>{item.qty} × {item.name}</span><b>{euro(item.qty*item.price)}</b></div>)}</div>
                          <div className="mt-3 flex justify-between border-t border-white/10 pt-2 font-black"><span>Total</span><span>{euro(orderGrandTotal(order))}</span></div>
                        </div>
                      })}
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
          )}

          {adminTab==="products" && <div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Produits commandables</h2><p className="mb-5 text-stone-300">Tina coche les produits disponibles, ajuste les prix et peut ajouter un nouveau produit sans refaire le code.</p><div className="mb-5 rounded-2xl bg-black/40 p-4"><h3 className="mb-3 font-black text-amber-300">Ajouter un produit</h3><div className="grid gap-2 md:grid-cols-[90px_1fr_180px_120px]"><input placeholder="Code" value={newProduct.code} onChange={e=>setNewProduct({...newProduct, code:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Nom du produit" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><select value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3">{categoryOrder.map(cat=><option key={cat} value={cat}>{cat}</option>)}</select><input placeholder="Prix" type="number" step="0.1" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/></div><textarea placeholder="Description" value={newProduct.desc} onChange={e=>setNewProduct({...newProduct, desc:e.target.value})} className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-stone-900 p-3"/><button onClick={addProductFromDashboard} className="mt-3 rounded-xl bg-amber-400 px-4 py-3 font-black text-black">+ Ajouter le produit</button></div><div className="grid gap-3 md:grid-cols-2">{products.map(p=><div key={p.id} className="rounded-2xl bg-black/40 p-4"><div className="mb-3 flex items-start justify-between gap-3"><div><div className="text-sm font-black text-amber-300">{p.code}</div><div className="font-black">{p.name}</div><div className="text-sm text-stone-400">{p.category}</div></div><label className="flex items-center gap-2 text-sm font-bold"><span>{p.available ? "ON" : "OFF"}</span><input type="checkbox" checked={p.available} onChange={()=>updateProduct(p.id,"available",!p.available)} className="h-7 w-7 accent-amber-400"/></label></div><div className="grid gap-2 sm:grid-cols-[1fr_120px]"><input value={p.name} onChange={e=>updateProduct(p.id,"name",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input type="number" step="0.1" value={p.price} onChange={e=>updateProduct(p.id,"price",Number(e.target.value))} className="rounded-xl border border-white/10 bg-stone-900 p-3"/></div><textarea value={p.desc} onChange={e=>updateProduct(p.id,"desc",e.target.value)} className="mt-2 min-h-16 w-full rounded-xl border border-white/10 bg-stone-900 p-3 text-sm"/></div>)}</div></div>}
          {adminTab==="locations" && <div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Emplacements & horaires</h2><p className="mb-5 text-stone-300">Le dernier retrait est calculé automatiquement 30 min avant la fermeture.</p><div className="mb-5 rounded-2xl bg-black/40 p-4"><h3 className="mb-3 font-black text-amber-300">Ajouter un emplacement</h3><div className="grid gap-2 md:grid-cols-5"><input placeholder="Label ex : Dimanche soir" value={newLocation.label} onChange={e=>setNewLocation({...newLocation, label:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Ville" value={newLocation.city} onChange={e=>setNewLocation({...newLocation, city:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Lieu" value={newLocation.place} onChange={e=>setNewLocation({...newLocation, place:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><select value={newLocation.day} onChange={e=>setNewLocation({...newLocation, day:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3">{["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"].map(day=><option key={day}>{day}</option>)}</select><input placeholder="16h30 – 21h30" value={newLocation.hours} onChange={e=>setNewLocation({...newLocation, hours:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/></div><button onClick={addLocationFromDashboard} className="mt-3 rounded-xl bg-amber-400 px-4 py-3 font-black text-black">+ Ajouter l’emplacement</button></div><div className="grid gap-4 md:grid-cols-2">{locations.map(l=><div key={l.id} className="rounded-2xl bg-black/40 p-4"><div className="mb-4 flex items-center justify-between gap-3"><div className="font-black text-amber-300">{l.label}</div><label className="flex items-center gap-2 text-sm font-bold"><span>{l.active === false ? "Masqué" : "Visible"}</span><input type="checkbox" checked={l.active !== false} onChange={()=>updateLocation(l.id,"active",!(l.active !== false))} className="h-6 w-6 accent-amber-400"/></label></div><div className="grid gap-3"><input value={l.label} onChange={e=>updateLocation(l.id,"label",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input value={l.city} onChange={e=>updateLocation(l.id,"city",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input value={l.place} onChange={e=>updateLocation(l.id,"place",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><select value={l.day} onChange={e=>updateLocation(l.id,"day",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3">{["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"].map(day=><option key={day}>{day}</option>)}</select><input value={l.hours} onChange={e=>updateLocation(l.id,"hours",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><div className="rounded-xl bg-amber-400/10 p-3 text-sm font-bold text-amber-100">Dernier retrait client : {formatTime(getServiceWindow(l).pickupEndDate)}</div></div></div>)}</div></div>}
          {adminTab==="settings" && <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-stone-900 p-5">
              <h2 className="mb-4 text-2xl font-black">Ouverture commandes</h2>
              <button onClick={toggleOrdersOpen} className={`w-full rounded-2xl p-5 text-xl font-black ${ordersOpen ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>{ordersOpen ? "PRÉCOMMANDES OUVERTES" : "PRÉCOMMANDES FERMÉES"}</button>
              <button onClick={toggleServiceOrdersOpen} className={`mt-4 w-full rounded-2xl p-5 text-lg font-black ${serviceOrdersOpen ? "bg-amber-400 text-black" : "bg-white/10 text-white"}`}>{serviceOrdersOpen ? "COMMANDES PENDANT SERVICE ACTIVÉES" : "COMMANDES PENDANT SERVICE DÉSACTIVÉES"}</button>
              <p className="mt-3 text-sm text-stone-400">Si activé, les clients peuvent commander pendant le service uniquement. À utiliser seulement si Tina veut surveiller le dashboard en direct.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-stone-900 p-5">
              <h2 className="mb-4 text-2xl font-black">Complet à la réservation</h2>
              <p className="mb-4 text-sm text-stone-400">Désactive une famille de produits pour un emplacement. Le client voit un message clair : sélection possible au camion selon stock.</p>
              <div className="space-y-4">
                {[
                  ["PLAB", "Plabennec"],
                  ["BRI", "Brignogan"],
                  ["KER", "Kerlouan"]
                ].map(([code, label]) => (
                  <div key={code} className="rounded-2xl bg-black/40 p-4">
                    <div className="mb-3 text-lg font-black text-amber-300">{label}</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(blockGroupLabels).map(([group, groupLabel]) => {
                        const active = Boolean(stockBlocks?.[code]?.[group]);
                        return <button key={group} onClick={() => toggleStockBlockForLocation(code, group)} className={`rounded-2xl px-4 py-4 text-sm font-black ${active ? "bg-red-500 text-white" : "bg-white/10 text-white"}`}>{active ? `${groupLabel} COMPLETS` : `${groupLabel} ouverts`}</button>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-stone-900 p-5 lg:col-span-2">
              <h2 className="mb-2 text-2xl font-black">Menus disponibles par emplacement</h2>
              <p className="mb-5 text-sm text-stone-400">Coche les produits que Tina veut proposer selon le lieu de retrait. OFF = le produit reste visible mais le client ne peut pas le commander pour cet emplacement.</p>
              <div className="grid gap-5 lg:grid-cols-2">
                {[
                  ["PLAB", "Plabennec"],
                  ["BRI", "Brignogan"]
                ].map(([code, label]) => (
                  <div key={code} className="rounded-2xl bg-black/40 p-4">
                    <div className="mb-4 text-xl font-black text-amber-300">{label}</div>
                    <div className="space-y-4">
                      {categoryOrder.map(category => {
                        const items = products.filter(p => p.category === category).sort(productSort);
                        if (!items.length) return null;
                        return (
                          <div key={`${code}-${category}`} className="rounded-xl border border-white/10 p-3">
                            <div className="mb-2 text-sm font-black text-amber-100">{categoryLabels[category] || category}</div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {items.map(p => {
                                const active = stockBlocks?.[code]?.products?.[p.id] !== false;
                                return (
                                  <button
                                    key={`${code}-${p.id}`}
                                    type="button"
                                    onClick={() => toggleProductForLocation(code, p.id)}
                                    className={`rounded-xl px-3 py-2 text-left text-xs font-bold ${active ? "bg-green-500/20 text-green-100" : "bg-red-500/25 text-red-100 line-through"}`}
                                  >
                                    <span className="mr-2 font-black">{active ? "ON" : "OFF"}</span>
                                    <span>{p.code} - {p.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-stone-900 p-5 lg:col-span-2">
              <h2 className="mb-4 text-2xl font-black">Message accueil</h2>
              <textarea value={siteMessage} onChange={e=>saveSiteMessage(e.target.value)} className="min-h-32 w-full rounded-xl border border-white/10 bg-black p-4"/>
            </div>
          </div>}
        </main>
      )}

      {view === "site" && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut"
          className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/50 bg-amber-400 text-2xl font-black text-black shadow-2xl shadow-black/50"
        >
          ↑
        </button>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<KruaSite />);
