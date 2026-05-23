import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { ShoppingCart, MapPin, Phone, MessageCircle, Clock, ChefHat, Lock, CheckCircle2, XCircle, PackageCheck, Settings, Eye, CalendarDays, Sparkles, UtensilsCrossed, Search, ChevronDown, Clipboard } from "lucide-react";
import "./style.css";

const BRAND = { name: "KRUA PEÈN THAÏ", phone: "0670395523", email: "kruapeenthai@gmail.com", instagram: "@krua_peen_thai", facebook: "KRUA Peèn-Thaï" };

const initialLocations = [
  { id: "PLAB", city: "Plabennec", label: "Mardi soir", place: "Devant l’église", day: "Mardi", hours: "16h00 – 20h30", active: true },
  { id: "KERJ", city: "Kerlouan", label: "Jeudi matin", place: "Place de la mairie", day: "Jeudi", hours: "08h00 – 13h00", active: true },
  { id: "KERD", city: "Kerlouan", label: "Dimanche matin", place: "Place de la mairie", day: "Dimanche", hours: "08h00 – 13h00", active: true },
  { id: "BRI", city: "Brignogan", label: "Dimanche soir", place: "Devant le camping Slow Village", day: "Dimanche", hours: "16h30 – 21h30", active: true },
];

const categoryOrder = ["Entrées","Accompagnements","Plats avec nouilles","Plats avec riz","Currys","Sushis","Makis","California","Sushis spécial","Crunch","Makis printemps","Poké bowls"];
const categoryLabels = {
  "Entrées": "🥟 Entrées", "Accompagnements": "🍚 Accompagnements",
  "Plats avec nouilles": "🍜 Plats avec nouilles", "Plats avec riz": "🍚 Plats avec riz", "Currys": "🌶️ Currys",
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
  { id: "nouilles-sautees-accompagnement", code: "A2", name: "Nouilles sautées", category: "Accompagnements", price: 5.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "option-riz-cantonais", code: "OPT", name: "Option riz cantonais", category: "Accompagnements", price: 2.5, available: true, fixed: true, desc: "Remplacer le riz nature par du riz cantonais." },
  { id: "option-nouilles-sautees", code: "OPT", name: "Option nouilles sautées", category: "Accompagnements", price: 2.5, available: true, fixed: true, desc: "Remplacer le riz nature par des nouilles sautées." },
  { id: "pad-thai", code: "P1", name: "Pad Thaï", category: "Plats avec nouilles", price: 10.5, available: true, fixed: true, desc: "Nouilles de riz, œuf, soja, cacahuètes, ciboulettes. Au choix : porc, poulet ou crevettes." },
  { id: "nouilles-sautees", code: "P2", name: "Nouilles sautées", category: "Plats avec nouilles", price: 9.5, available: true, fixed: true, desc: "Nouilles de blé sautées avec légumes. Au choix : porc, poulet ou crevettes." },
  { id: "pad-nam-man-hoi", code: "P3", name: "Pad Nam Man Hoi", category: "Plats avec riz", price: 9.9, available: true, fixed: false, desc: "Bœuf sauté, sauce huître, oignons, ciboulettes. Au choix : porc, poulet ou crevettes." },
  { id: "pad-kra-pao", code: "P4", name: "Pad Kra Pao", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Viande hachée, basilic thaï, oignons. Au choix : porc, poulet ou crevettes." },
  { id: "porc-caramel", code: "P5", name: "Porc au caramel", category: "Plats avec riz", price: 9.9, available: true, fixed: false, desc: "Porc mijoté sauce caramélisée maison." },
  { id: "poulet-cajou", code: "P6", name: "Poulet aux noix de cajou", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Poulet sauté, légumes, noix de cajou." },
  { id: "pad-phong-curry", code: "P7", name: "Pad Phong Curry", category: "Plats avec riz", price: 9.5, available: true, fixed: false, desc: "Poulet ou crevettes sautés au curry jaune, oignons, ciboulettes." },
  { id: "curry-panang", code: "P8", name: "Curry Panang", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "curry-rouge", code: "P9", name: "Curry rouge", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "curry-vert", code: "P10", name: "Curry vert", category: "Currys", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Au choix : poulet, porc ou crevette." },
  { id: "s1", code: "S1", name: "6 sushis saumon", category: "Sushis", price: 8.5, available: true, fixed: true, desc: "Commande conseillée la veille." },
  { id: "s2", code: "S2", name: "10 sushis saumon", category: "Sushis", price: 15, available: true, fixed: true, desc: "Commande conseillée la veille." },
  { id: "s3", code: "S3", name: "6 sushis crevettes", category: "Sushis", price: 9, available: true, fixed: true, desc: "Commande conseillée la veille." },
  { id: "s4", code: "S4", name: "10 sushis crevettes", category: "Sushis", price: 15, available: true, fixed: true, desc: "Commande conseillée la veille." },
  { id: "s5", code: "S5", name: "6 sushis saumon avocat", category: "Sushis", price: 12, available: true, fixed: true, desc: "Commande conseillée la veille." },
  { id: "s6", code: "S6", name: "6 sushis crevettes avocat", category: "Sushis", price: 11, available: true, fixed: true, desc: "Commande conseillée la veille." },
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
  { id: "s33", code: "S33", name: "Poké bowl saumon", category: "Poké bowls", price: 9.5, available: true, fixed: true, desc: "Avocat, concombre, radis, oignons frits." },
  { id: "s34", code: "S34", name: "Poké bowl thon mayonnaise", category: "Poké bowls", price: 9.5, available: true, fixed: true, desc: "Avocat, concombre, radis, oignons frits." },
  { id: "s35", code: "S35", name: "Riz vinaigré", category: "Accompagnements", price: 3.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "s36", code: "S36", name: "Tartare de riz saumon avocat", category: "Accompagnements", price: 8.5, available: true, fixed: true, desc: "Accompagnement." },
  { id: "s37", code: "S37", name: "Salade de chou", category: "Accompagnements", price: 3.5, available: true, fixed: true, desc: "Accompagnement." },
];

const showcase = ["Pad Thaï signature","Currys thaï","Poulet noix de cajou","Porc caramel","Pad Kra Pao","Sushis sur commande","Poké bowls","Nems, samoussas, bouchées vapeur","Traiteur mariage, retour de mariage, entreprise"];

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

async function makeOrderCode(locationId, existingOrders = []) {
  const clean = locationCode(locationId);
  const prefix = `KR-${clean}-`;
  let max = 0;

  const readCodes = (rows = []) => {
    rows.forEach((row) => {
      const code = typeof row === "string" ? row : row?.code || row?.id;
      const match = String(code || "").match(new RegExp(`^${prefix}(\\d{3})$`));
      if (match) max = Math.max(max, Number(match[1]));
    });
  };

  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("code")
      .like("code", `${prefix}%`);
    if (!error) readCodes(data);
  }

  readCodes(existingOrders);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
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
  const ADMIN_PIN = "1468";
  const [view, setView] = useState("site");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState("orders");
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [serviceOrdersOpen, setServiceOrdersOpen] = useState(false);
  const [stockBlocks, setStockBlocks] = useState({});
  const [siteMessage, setSiteMessage] = useState("Précommandes ouvertes jusqu’à la veille 20h");
  const [products, setProducts] = useState(productsSeed);
  const [locations, setLocations] = useState(initialLocations);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [locationId, setLocationId] = useState("PLAB");
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", phone: "", email: "", note: "" });
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategory, setOpenCategory] = useState("Plats de la semaine");
  const [orderSearch, setOrderSearch] = useState("");
  const [appMode, setAppMode] = useState(supabase ? "Connecté à Supabase" : "Mode démo local");
  const [notificationStatus, setNotificationStatus] = useState("Notifications inactives");
  const [adminLocationFilter, setAdminLocationFilter] = useState("ALL");
  const [adminStatusFilter, setAdminStatusFilter] = useState("ACTIVE");
  const [hideDoneOrders, setHideDoneOrders] = useState(true);
  const [newProduct, setNewProduct] = useState({ code: "", name: "", category: "Entrées", price: "", desc: "", available: true, fixed: true });
  const [newLocation, setNewLocation] = useState({ city: "", label: "", place: "", day: "Dimanche", hours: "16h30 – 21h30", active: true });

  useEffect(() => {
    const normalizePath = () => window.location.pathname.replace(/\/$/, "");

    const openAdmin = () => {
      const isAdminRoute = normalizePath() === "/admin";

      if (!isAdminRoute) {
        setView("site");
        return;
      }

      if (window.sessionStorage.getItem("kruaAdminUnlocked") === "true") {
        setAdminUnlocked(true);
        setView("admin");
        return;
      }

      const pin = window.prompt("Code PIN Dashboard Tina");
      if (pin === ADMIN_PIN) {
        window.sessionStorage.setItem("kruaAdminUnlocked", "true");
        setAdminUnlocked(true);
        setView("admin");
      } else {
        window.history.replaceState(null, "", "/");
        setView("site");
      }
    };

    openAdmin();
    window.addEventListener("popstate", openAdmin);
    return () => window.removeEventListener("popstate", openAdmin);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error("Service worker", error));
    }
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
      if (productsRes.data?.length) setProducts(productsRes.data.map(p => ({ id:p.id, code:p.code, name:p.name, category:p.category, price:Number(p.price), available:p.available, fixed:p.fixed, desc:p.description || "" })));
      else await supabase.from("products").upsert(productsSeed.map(p => ({ id:p.id, code:p.code, name:p.name, category:p.category, price:p.price, available:p.available, fixed:p.fixed, description:p.desc })));
      if (locationsRes.data?.length) setLocations(locationsRes.data.map(l => ({ id:l.id, city:l.city, label:l.label, place:l.place, day:l.day, hours:l.hours, active:l.active !== false })));
      else await supabase.from("locations").upsert(initialLocations.map(l => ({ ...l, active:true })));
      const setting = settingsRes.data?.[0];
      if (setting) { setOrdersOpen(setting.orders_open); setServiceOrdersOpen(Boolean(setting.service_orders_open)); setStockBlocks(setting.stock_blocks || {}); setSiteMessage(setting.site_message || "Précommandes ouvertes jusqu’à la veille 20h"); }
      else await supabase.from("settings").upsert({ id:"main", orders_open:true, service_orders_open:false, stock_blocks:{}, site_message:"Précommandes ouvertes jusqu’à la veille 20h" });
      if (ordersRes.data?.length) setOrders(ordersRes.data.map(o => ({ id:o.code, dbId:o.id, createdAt:o.created_at, status:o.status, total:Number(o.total || 0), customer:{ firstName:o.first_name, lastName:o.last_name || "", phone:o.phone, email:o.email || "", note:o.note || "" }, locationId:o.location_id, items:(o.order_items || []).map(item => ({ id:item.product_id, name:item.name, qty:item.qty, price:Number(item.price) })) })));
    } catch (e) { console.error(e); setAppMode("Erreur Supabase, mode local"); }
  }

  const availableProducts = products.filter(p => p.available);
  const categories = ["Tous", ...categoryOrder.filter(cat => availableProducts.some(p => p.category === cat))];
  const filteredProducts = availableProducts.filter(p => {
    const q = searchTerm.trim().toLowerCase();
    return (categoryFilter === "Tous" || p.category === categoryFilter) && (!q || p.name.toLowerCase().includes(q) || (p.code || "").toLowerCase().includes(q));
  });
  const productsByCategory = categoryOrder.map(category => ({ category, items: filteredProducts.filter(p => p.category === category) })).filter(g => g.items.length);
  const cartLines = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ ...products.find(p => p.id === id), qty })).filter(x => x.id), [cart, products]);
  const cartTotal = cartLines.reduce((s, i) => s + i.price * i.qty, 0);
  const sushiDiscountBase = cartLines.filter(isSushiDiscountProduct).reduce((s, i) => s + i.price * i.qty, 0);
  const sushiDiscount = sushiDiscountBase >= 25 ? Math.round(sushiDiscountBase * 0.10 * 100) / 100 : 0;
  const total = Math.max(0, cartTotal - sushiDiscount);
  const visibleLocations = locations.filter(l => l.active !== false);
  const selectedLocation = visibleLocations.find(l => l.id === locationId) || visibleLocations[0] || locations[0];
  const selectedAvailability = getOrderAvailability(selectedLocation);

  function addToCart(id) { setCart(old => ({ ...old, [id]:(old[id] || 0) + 1 })); }
  function removeFromCart(id) { setCart(old => { const n={...old}; n[id]=(n[id]||0)-1; if(n[id]<=0) delete n[id]; return n; }); }

  function isSushiDiscountProduct(product) {
    return ["Sushis", "Makis", "California", "Sushis spécial", "Crunch", "Makis printemps"].includes(product?.category);
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
    const orderAvailability = getOrderAvailability(selectedLocation);
    if (!orderAvailability.open) return alert(orderAvailability.message);
    const blockedCartLine = cartLines.find(item => isProductBlocked(item));
    if (blockedCartLine) return alert(`${blockedCartLine.name} est complet à la réservation pour cet emplacement.`);
    if (!customer.firstName || !customer.phone || cartLines.length === 0) return alert("Merci de remplir prénom, téléphone et panier.");
const orderItems = cartLines.map(({id,name,qty,price}) => ({id,name,qty,price}));
    // IMPORTANT : la remise n'est pas insérée dans order_items.
    // order_items.product_id est lié à products.id, donc une fausse ligne "discount" casse Supabase.
    // La remise est uniquement enregistrée dans orders.total.
    const order = { id: await makeOrderCode(locationId, orders), createdAt:new Date().toISOString(), status:"À confirmer", customer, locationId, items: orderItems, total };
    if (supabase) {
      const { data, error } = await supabase.from("orders").insert({ code:order.id, status:order.status, first_name:customer.firstName, last_name:customer.lastName, phone:customer.phone, email:customer.email || null, note:customer.note, location_id:locationId, total }).select().single();
      if (error) return alert("Erreur commande : " + error.message);
      const lines = order.items.map(item => ({ order_id:data.id, product_id:item.id, name:item.name, qty:item.qty, price:item.price }));
      const linesRes = await supabase.from("order_items").insert(lines);
      if (linesRes.error) return alert("Erreur lignes : " + linesRes.error.message);
      order.dbId = data.id;
      order.createdAt = data.created_at || order.createdAt;
    }
    await sendOrderNotification(order, total);
    setOrders(old => [order, ...old]); setCart({}); setCustomer({ firstName:"", lastName:"", phone:"", email:"", note:"" });
    alert(`Demande enregistrée : ${order.id}\nTina confirmera par téléphone, WhatsApp ou email.`);
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
    if (["Sushis", "Makis", "California", "Sushis spécial", "Crunch", "Makis printemps", "Poké bowls"].includes(product.category)) return "sushi";
    return null;
  }

  function isCategoryBlockedForLocation(product, locId) {
    const group = productBlockGroup(product);
    if (!group) return false;
    const code = locationCode(locId);
    return Boolean(stockBlocks?.[code]?.[group]);
  }

  function isProductBlocked(product) {
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
    const { pickupEndDate } = getServiceWindow(location);
    return `${location?.hours || ""} · retrait max ${formatTime(pickupEndDate)}`;
  }

  function formatServiceDate(location) {
    const date = getServiceDate(location);
    const label = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function getOrderAvailability(location) {
    const now = new Date();
    const { date, endDate, pickupEndDate } = getServiceWindow(location);

    const closingDate = new Date(date);
    closingDate.setDate(closingDate.getDate() - 1);
    closingDate.setHours(20, 0, 0, 0);

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
        message: "Précommande ouverte jusqu’à la veille 20h."
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

  const activeOrdersCount = orders.filter(o => o.status === "À confirmer" || o.status === "Confirmée").length;

  const visibleOrders = useMemo(() => {
    const statusOrder = { "À confirmer":0, "Confirmée":1, "Récupérée":2, "Annulée":3 };
    const q = orderSearch.trim().toLowerCase();
    return orders
      .filter(o => adminLocationFilter === "ALL" || locationCode(o.locationId) === adminLocationFilter)
      .filter(o => {
        if (adminStatusFilter === "ACTIVE") return o.status === "À confirmer" || o.status === "Confirmée";
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

  return (
    <div className="min-h-screen bg-[#070504] text-stone-50">
      <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => setView("site")} className="text-left"><div className="text-xl font-black tracking-wide text-amber-300">{BRAND.name}</div><div className="text-xs text-stone-300">Thaï • Sushi • Poké • Traiteur</div></button>
        <nav className="flex items-center gap-2 text-sm">
  <button
    onClick={() => setView("site")}
    className="rounded-full bg-amber-400 px-4 py-2 text-black"
  >
    Site client
  </button>
</nav>
        </div>
      </header>

      {view === "site" ? (
        <main>
          <section className="relative overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(185,28,28,.24),transparent_30%)]" /><div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24"><div className="flex flex-col justify-center"><div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm text-amber-200"><Sparkles size={16}/> {siteMessage}</div><h1 className="text-4xl font-black leading-tight md:text-6xl">Cuisine thaï maison, sushi & poké bowls sur commande</h1><p className="mt-5 max-w-2xl text-lg text-stone-300">Food truck basé à Plabennec, présent dans le Finistère Nord. Retrait pendant le service, paiement sur place, confirmation par Tina.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#commander" className="rounded-2xl bg-amber-400 px-6 py-4 font-bold text-black shadow-lg shadow-amber-500/20">Commander cette semaine</a><a href="#carte" className="rounded-2xl border border-white/20 px-6 py-4 font-bold">Voir notre carte</a><a href="#traiteur" className="rounded-2xl border border-white/20 px-6 py-4 font-bold">Demande traiteur</a></div></div><div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-stone-900 to-black p-5 shadow-2xl"><div className="rounded-[1.5rem] bg-stone-800 p-6"><div className="mb-3 flex items-center gap-2 text-amber-300"><ChefHat/> Cette semaine chez Tina</div><div className="grid gap-2">{availableProducts.slice(0,6).map(p=><div key={p.id} className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-3"><span>{p.name}</span><span className="font-bold text-amber-300">{euro(p.price)}</span></div>)}</div></div><div className="mt-4 rounded-[1.5rem] border border-white/10 p-6"><div className="text-sm uppercase tracking-widest text-stone-400">Contact commande</div><div className="mt-2 text-2xl font-black">{BRAND.phone.replace(/(\d{2})(?=\d)/g,"$1 ")}</div><div className="mt-3 text-stone-300">WhatsApp Business disponible</div></div></div></div></section>

          <section id="carte" className="mx-auto max-w-7xl px-4 py-12"><div className="mb-6 flex items-center gap-3"><UtensilsCrossed className="text-amber-300"/><h2 className="text-3xl font-black">Notre carte & savoir-faire</h2></div><p className="max-w-3xl text-stone-300">Cette partie présente ce que Tina propose. Certains plats thaï changent selon la semaine.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{showcase.map(item=><div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 font-semibold">{item}</div>)}</div></section>

          <section id="commander" className="mx-auto max-w-7xl px-4 py-12"><div className="mb-6 flex items-center gap-3"><ShoppingCart className="text-amber-300"/><h2 className="text-3xl font-black">Commander cette semaine</h2></div><div className="mb-6 space-y-4"><div className="flex gap-2 overflow-x-auto pb-2">{categories.map(cat=><button key={cat} onClick={()=>{setCategoryFilter(cat); if(cat!=="Tous") setOpenCategory(cat);}} className={`whitespace-nowrap rounded-full px-4 py-3 text-sm font-bold ${categoryFilter===cat ? "bg-amber-400 text-black" : "bg-white/10"}`}>{cat==="Tous" ? "Tout" : categoryLabels[cat] || cat}</button>)}</div><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18}/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Rechercher : saumon, poké, S16..." className="w-full rounded-2xl border border-white/10 bg-stone-900 py-4 pl-12 pr-4"/></div></div><div className="grid gap-6 lg:grid-cols-[1fr_380px]"><div className="space-y-4">{productsByCategory.map(group=>{const isOpen=openCategory===group.category || categoryFilter!=="Tous"; return <div key={group.category} className="overflow-hidden rounded-3xl border border-white/10 bg-stone-950/70"><button onClick={()=>setOpenCategory(isOpen?"":group.category)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><div><h3 className="text-2xl font-black text-amber-200">{categoryLabels[group.category] || group.category}</h3><p className="mt-1 text-sm text-stone-400">{group.items.length} produit{group.items.length>1?"s":""}</p></div><ChevronDown className={`text-amber-300 transition-transform ${isOpen ? "rotate-180" : ""}`}/></button>{isOpen && <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2">{group.items.map(p=><article key={p.id} className="rounded-3xl border border-white/10 bg-stone-900 p-5"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-black text-amber-300">{p.code}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-stone-300">{p.fixed ? "Permanent" : "Cette semaine"}</span></div><h3 className="text-xl font-black">{p.name}</h3><p className="mt-2 min-h-12 text-sm text-stone-300">{p.desc}</p><div className="mt-5 flex items-center justify-between"><span className="text-lg font-black text-amber-300">{euro(p.price)}</span><button disabled={!selectedAvailability.open || isProductBlocked(p)} onClick={()=>addToCart(p.id)} className="rounded-xl bg-amber-400 px-4 py-3 font-bold text-black disabled:opacity-40">{isProductBlocked(p) ? "Complet réservation" : "Ajouter"}</button></div></article>)}</div>}</div>})}</div><aside className="h-fit rounded-3xl border border-amber-300/20 bg-black p-5 shadow-xl"><h3 className="mb-4 text-2xl font-black">Votre commande</h3><label className="text-sm text-stone-300">Lieu de retrait</label><select value={locationId} onChange={e=>setLocationId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 p-3">{visibleLocations.map(l=><option key={l.id} value={l.id}>{l.label} – {l.city}</option>)}</select><div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-sm text-stone-300"><MapPin className="mr-2 inline text-amber-300" size={16}/>{selectedLocation.place} • {servicePickupText(selectedLocation)}</div>{currentBlockMessages.map(block=><div key={block.group} className="mt-4 rounded-xl bg-orange-950/70 p-4 text-sm font-bold text-orange-100">⚠️ {block.text}</div>)}{!selectedAvailability.open && <div className="mt-4 rounded-xl bg-red-950/70 p-4 text-sm font-bold text-red-100">{selectedAvailability.message}</div>}{selectedAvailability.open && selectedAvailability.mode === "service" && <div className="mt-4 rounded-xl bg-green-950/70 p-4 text-sm font-bold text-green-100">{selectedAvailability.message}</div>}<div className="my-5 space-y-3">{cartLines.length===0 && <div className="rounded-xl bg-white/[0.04] p-4 text-stone-400">Panier vide</div>}{cartLines.map(line=><div key={line.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] p-3"><div><div className="font-bold">{line.name}</div><div className="text-sm text-stone-400">{line.qty} × {euro(line.price)}</div></div><div className="flex items-center gap-2"><button onClick={()=>removeFromCart(line.id)} className="rounded-lg bg-white/10 px-3 py-2">-</button><button onClick={()=>addToCart(line.id)} className="rounded-lg bg-white/10 px-3 py-2">+</button></div></div>)}</div>{sushiDiscount > 0 && <div className="mb-3 flex items-center justify-between rounded-xl bg-green-500/10 p-3 text-sm font-black text-green-200"><span>Remise sushis -10%</span><span>-{euro(sushiDiscount)}</span></div>}
              {sushiDiscountBase > 0 && sushiDiscount === 0 && <div className="mb-3 rounded-xl bg-amber-400/10 p-3 text-xs font-bold text-amber-100">🍣 -10% sur les sushis dès 25€ de commande sushi.</div>}
              <div className="mb-5 flex items-center justify-between border-t border-white/10 pt-4 text-xl font-black"><span>Total</span><span className="text-amber-300">{euro(total)}</span></div><div className="grid gap-3"><input placeholder="Prénom *" value={customer.firstName} onChange={e=>setCustomer({...customer, firstName:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Nom" value={customer.lastName} onChange={e=>setCustomer({...customer, lastName:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Téléphone *" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Email (pour confirmation)" type="email" value={customer.email} onChange={e=>setCustomer({...customer, email:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><textarea placeholder="Commentaire" value={customer.note} onChange={e=>setCustomer({...customer, note:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><button disabled={!selectedAvailability.open} onClick={submitOrder} className="rounded-2xl bg-amber-400 px-5 py-4 font-black text-black disabled:opacity-40">{selectedAvailability.open ? "Envoyer la demande" : "Commandes fermées"}</button><p className="text-xs text-stone-400">{selectedAvailability.open ? selectedAvailability.message : selectedAvailability.message}</p></div></aside></div></section>

          <section id="lieux" className="mx-auto max-w-7xl px-4 py-12"><div className="mb-6 flex items-center gap-3"><CalendarDays className="text-amber-300"/><h2 className="text-3xl font-black">Où nous trouver</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{visibleLocations.map(l=><div key={l.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><div className="font-bold text-amber-300">{l.label}</div><div className="mt-2 text-2xl font-black">{l.city}</div><div className="mt-2 text-stone-300">{l.place}</div><div className="mt-4 flex items-center gap-2 text-stone-200"><Clock size={16}/>{servicePickupText(l)}</div></div>)}</div></section>

          <section id="traiteur" className="mx-auto max-w-7xl px-4 py-12 pb-20"><div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-stone-900 to-black p-8"><h2 className="text-3xl font-black">Traiteur thaï, sushi & poké bowls</h2><p className="mt-3 max-w-3xl text-stone-300">Mariage, retour de mariage, anniversaire, séminaire, repas d’entreprise. Demandez un devis, Tina vous recontacte.</p><div className="mt-6 grid gap-3 md:grid-cols-2"><input placeholder="Nom" className="rounded-xl border border-white/10 bg-black p-4"/><input placeholder="Téléphone" className="rounded-xl border border-white/10 bg-black p-4"/><input placeholder="Type d’événement" className="rounded-xl border border-white/10 bg-black p-4"/><input placeholder="Nombre de personnes" className="rounded-xl border border-white/10 bg-black p-4"/><textarea placeholder="Votre demande" className="rounded-xl border border-white/10 bg-black p-4 md:col-span-2"/></div><button className="mt-5 rounded-2xl bg-amber-400 px-6 py-4 font-black text-black">Demander un devis</button></div></section>
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

          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            {[["orders","Commandes"],["products","Produits"],["locations","Emplacements"],["settings","Réglages"]].map(([id,label])=><button key={id} onClick={()=>setAdminTab(id)} className={`rounded-2xl p-4 text-left font-black ${adminTab===id ? "bg-amber-400 text-black" : "bg-white/10"}`}>{label}</button>)}
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
                        <a href={whatsappLink(order.customer.phone, whatsMsg)} target="_blank" rel="noreferrer" onClick={()=>updateOrderStatus(order.id,"Confirmée")} className="rounded-2xl bg-green-500 px-4 py-4 text-center font-black text-black"><MessageCircle className="mr-2 inline" size={18}/>Confirmer WhatsApp</a>
                        <a href={smsLink(order.customer.phone, smsMsg)} onClick={()=>updateOrderStatus(order.id,"Confirmée")} className="rounded-2xl bg-white/10 px-4 py-4 text-center font-black"><Phone className="mr-2 inline" size={18}/>Confirmer SMS</a><button onClick={()=>sendConfirmationEmail(order, loc)} disabled={!order.customer.email} className="rounded-2xl bg-amber-400 px-4 py-4 text-center font-black text-black disabled:opacity-40"><MessageCircle className="mr-2 inline" size={18}/>Confirmer Email</button>
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
                  <ul className="space-y-3 text-stone-300"><li>• Précommande jusqu’à la veille 20h</li><li>• Retrait pendant le service</li><li>• Paiement sur place</li><li>• Confirmation par WhatsApp, SMS ou téléphone</li></ul>
                </div>
              </aside>
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
              <h2 className="mb-4 text-2xl font-black">Message accueil</h2>
              <textarea value={siteMessage} onChange={e=>saveSiteMessage(e.target.value)} className="min-h-32 w-full rounded-xl border border-white/10 bg-black p-4"/>
            </div>
          </div>}
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<KruaSite />);
