import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { ShoppingCart, MapPin, Phone, MessageCircle, Clock, ChefHat, Lock, CheckCircle2, XCircle, PackageCheck, Settings, Eye, CalendarDays, Sparkles, UtensilsCrossed, Search, ChevronDown } from "lucide-react";
import "./style.css";

const BRAND = { name: "KRUA PEÈN THAÏ", phone: "0670395523", email: "kan-siam@laposte.net", instagram: "@krua_peen_thai", facebook: "KRUA Peèn-Thaï" };

const initialLocations = [
  { id: "PLAB", city: "Plabennec", label: "Mardi soir", place: "Devant l’église", day: "Mardi", hours: "16h00 – 20h30" },
  { id: "KERJ", city: "Kerlouan", label: "Jeudi matin", place: "Place de la mairie", day: "Jeudi", hours: "08h00 – 13h00" },
  { id: "BRI", city: "Brignogan", label: "Vendredi matin", place: "Place du marché", day: "Vendredi", hours: "08h00 – 13h00" },
  { id: "KERD", city: "Kerlouan", label: "Dimanche matin", place: "Place de la mairie", day: "Dimanche", hours: "08h00 – 13h00" },
];

const categoryOrder = ["Plats permanents","Plats de la semaine","Entrées","Sushis","Makis","California","Sushis spécial","Crunch","Makis printemps","Poké bowls","Accompagnements"];
const categoryLabels = {
  "Plats permanents": "🍜 Plats thaï", "Plats de la semaine": "🔥 Cette semaine", "Entrées": "🥟 Entrées",
  "Sushis": "🍣 Sushis", "Makis": "🥒 Makis", "California": "🥑 California", "Sushis spécial": "⭐ Sushis spéciaux",
  "Crunch": "🔥 Crunch", "Makis printemps": "🌿 Makis printemps", "Poké bowls": "🥗 Poké bowls", "Accompagnements": "🍚 Accompagnements",
};

const productsSeed = [
  { id: "pad-thai", code: "P1", name: "Pad Thaï", category: "Plats permanents", price: 10.5, available: true, fixed: true, desc: "Nouilles de riz, œuf, soja, cacahuètes, ciboulettes." },
  { id: "nouilles-sautees", code: "P2", name: "Nouilles sautées", category: "Plats permanents", price: 9.5, available: true, fixed: true, desc: "Nouilles de blé sautées avec légumes." },
  { id: "poulet-cajou", code: "P6", name: "Poulet aux noix de cajou", category: "Plats de la semaine", price: 9.5, available: true, fixed: false, desc: "Poulet sauté, légumes, noix de cajou. Activable selon la semaine." },
  { id: "curry-rouge", code: "P9", name: "Curry rouge", category: "Plats de la semaine", price: 9.9, available: true, fixed: false, desc: "Viande, légumes, pâte de curry, lait de coco. Activable selon la semaine." },
  { id: "porc-caramel", code: "P5", name: "Porc au caramel", category: "Plats de la semaine", price: 9.9, available: false, fixed: false, desc: "Porc mijoté sauce caramélisée maison. Activable selon la semaine." },
  { id: "pad-kra-pao", code: "P4", name: "Pad Kra Pao", category: "Plats de la semaine", price: 9.5, available: false, fixed: false, desc: "Viande hachée, basilic thaï, oignons. Activable selon la semaine." },
  { id: "e1", code: "E1", name: "Rouleau de printemps crevettes", category: "Entrées", price: 3.5, available: true, fixed: true, desc: "1 pièce." },
  { id: "e1-4", code: "E1", name: "Rouleaux de printemps crevettes x4", category: "Entrées", price: 12, available: true, fixed: true, desc: "4 pièces." },
  { id: "e2", code: "E2", name: "Nem crevettes", category: "Entrées", price: 1.5, available: true, fixed: true, desc: "1 pièce." },
  { id: "e2-4", code: "E2", name: "Nems crevettes x4", category: "Entrées", price: 5.5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e3", code: "E3", name: "Nem porc", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e3-4", code: "E3", name: "Nems porc x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e4", code: "E4", name: "Nem légumes", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e4-4", code: "E4", name: "Nems légumes x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e5", code: "E5", name: "Nem poulet", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e5-4", code: "E5", name: "Nems poulet x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e6", code: "E6", name: "Samoussa bœuf ou porc basilic thaï", category: "Entrées", price: 1.3, available: true, fixed: true, desc: "1 pièce." },
  { id: "e6-4", code: "E6", name: "Samoussas bœuf ou porc basilic thaï x4", category: "Entrées", price: 5, available: true, fixed: true, desc: "4 pièces." },
  { id: "e7", code: "E7", name: "Brochette de poulet pané", category: "Entrées", price: 2, available: true, fixed: true, desc: "1 pièce." },
  { id: "e8", code: "E8", name: "Bouchée vapeur", category: "Entrées", price: 1, available: true, fixed: true, desc: "Porc ou poulet & crevette. 1 pièce." },
  { id: "e8-6", code: "E8", name: "Bouchées vapeur x6", category: "Entrées", price: 5.5, available: true, fixed: true, desc: "6 pièces." },
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
  { id: "s32", code: "S32", name: "Roll saumon fromage x6", category: "Makis printemps", price: 9.5, available: true, fixed: true, desc: "6 pièces." },
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
function whatsappLink(phone, text) { const normalized = phone.replace(/^0/, "33").replace(/\s/g, ""); return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`; }

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
  const [siteMessage, setSiteMessage] = useState("Précommandes ouvertes jusqu’à la veille 20h");
  const [products, setProducts] = useState(productsSeed);
  const [locations, setLocations] = useState(initialLocations);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [locationId, setLocationId] = useState("PLAB");
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", phone: "", note: "" });
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategory, setOpenCategory] = useState("Plats de la semaine");
  const [orderSearch, setOrderSearch] = useState("");
  const [appMode, setAppMode] = useState(supabase ? "Connecté à Supabase" : "Mode démo local");
  const [notificationStatus, setNotificationStatus] = useState("Notifications inactives");
  const [adminLocationFilter, setAdminLocationFilter] = useState("ALL");
  const [adminStatusFilter, setAdminStatusFilter] = useState("ACTIVE");
  const [hideDoneOrders, setHideDoneOrders] = useState(true);

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
      if (locationsRes.data?.length) setLocations(locationsRes.data.map(l => ({ id:l.id, city:l.city, label:l.label, place:l.place, day:l.day, hours:l.hours })));
      else await supabase.from("locations").upsert(initialLocations.map(l => ({ ...l, active:true })));
      const setting = settingsRes.data?.[0];
      if (setting) { setOrdersOpen(setting.orders_open); setServiceOrdersOpen(Boolean(setting.service_orders_open)); setSiteMessage(setting.site_message || "Précommandes ouvertes jusqu’à la veille 20h"); }
      else await supabase.from("settings").upsert({ id:"main", orders_open:true, service_orders_open:false, site_message:"Précommandes ouvertes jusqu’à la veille 20h" });
      if (ordersRes.data?.length) setOrders(ordersRes.data.map(o => ({ id:o.code, dbId:o.id, status:o.status, customer:{ firstName:o.first_name, lastName:o.last_name || "", phone:o.phone, note:o.note || "" }, locationId:o.location_id, items:(o.order_items || []).map(item => ({ id:item.product_id, name:item.name, qty:item.qty, price:Number(item.price) })) })));
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
  const total = cartLines.reduce((s, i) => s + i.price * i.qty, 0);
  const selectedLocation = locations.find(l => l.id === locationId) || locations[0];
  const selectedAvailability = getOrderAvailability(selectedLocation);

  function addToCart(id) { setCart(old => ({ ...old, [id]:(old[id] || 0) + 1 })); }
  function removeFromCart(id) { setCart(old => { const n={...old}; n[id]=(n[id]||0)-1; if(n[id]<=0) delete n[id]; return n; }); }

  async function submitOrder() {
    const orderAvailability = getOrderAvailability(selectedLocation);
    if (!orderAvailability.open) return alert(orderAvailability.message);
    if (!customer.firstName || !customer.phone || cartLines.length === 0) return alert("Merci de remplir prénom, téléphone et panier.");
const order = { id: await makeOrderCode(locationId, orders), status:"À confirmer", customer, locationId, items: cartLines.map(({id,name,qty,price}) => ({id,name,qty,price})) };
    if (supabase) {
      const { data, error } = await supabase.from("orders").insert({ code:order.id, status:order.status, first_name:customer.firstName, last_name:customer.lastName, phone:customer.phone, note:customer.note, location_id:locationId, total }).select().single();
      if (error) return alert("Erreur commande : " + error.message);
      const lines = order.items.map(item => ({ order_id:data.id, product_id:item.id, name:item.name, qty:item.qty, price:item.price }));
      const linesRes = await supabase.from("order_items").insert(lines);
      if (linesRes.error) return alert("Erreur lignes : " + linesRes.error.message);
      order.dbId = data.id;
    }
    await sendOrderNotification(order, total);
    setOrders(old => [order, ...old]); setCart({}); setCustomer({ firstName:"", lastName:"", phone:"", note:"" });
    alert(`Demande enregistrée : ${order.id}\nTina confirmera par téléphone ou WhatsApp.`);
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
  async function toggleOrdersOpen() {
    const next = !ordersOpen; setOrdersOpen(next);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:next, service_orders_open:serviceOrdersOpen, site_message:siteMessage });
  }
  async function toggleServiceOrdersOpen() {
    const next = !serviceOrdersOpen; setServiceOrdersOpen(next);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:ordersOpen, service_orders_open:next, site_message:siteMessage });
  }
  async function saveSiteMessage(value) {
    setSiteMessage(value);
    if (supabase) await supabase.from("settings").upsert({ id:"main", orders_open:ordersOpen, service_orders_open:serviceOrdersOpen, site_message:value });
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
    const dayMap = {
      Dimanche: 0,
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6
    };

    const target = dayMap[location?.day] ?? new Date().getDay();
    const now = new Date();
    const result = new Date(now);

    result.setHours(0, 0, 0, 0);

    let diff = target - now.getDay();
    if (diff < 0) diff += 7;

    result.setDate(now.getDate() + diff);
    return result;
  }

  function getServiceWindow(location) {
    const date = getServiceDate(location);
    const { start, end } = parseServiceHours(location?.hours);
    const startDate = new Date(date);
    startDate.setHours(start.hour, start.minute, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(end.hour, end.minute, 0, 0);
    return { date, startDate, endDate };
  }

  function formatServiceDate(location) {
    const date = getServiceDate(location);
    const label = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function getOrderAvailability(location) {
    const now = new Date();
    const { date, endDate } = getServiceWindow(location);

    const preorderClosingDate = new Date(date);
    preorderClosingDate.setDate(preorderClosingDate.getDate() - 1);
    preorderClosingDate.setHours(20, 0, 0, 0);

    const dayServiceOpeningDate = new Date(date);
    dayServiceOpeningDate.setHours(6, 0, 0, 0);

    if (!ordersOpen) {
      return {
        open: false,
        mode: "closed",
        message: "Les précommandes sont actuellement fermées par Tina."
      };
    }

    if (now < preorderClosingDate) {
      return {
        open: true,
        mode: "preorder",
        message: "Précommande ouverte jusqu’à la veille 20h."
      };
    }

    if (serviceOrdersOpen && now >= dayServiceOpeningDate && now <= endDate) {
      return {
        open: true,
        mode: "service",
        message: "Commande du jour au food truck. Disponibilités selon stock restant. Paiement sur place."
      };
    }

    if (now >= dayServiceOpeningDate && now <= endDate) {
      return {
        open: false,
        mode: "service_closed",
        message: `Les précommandes pour ${location.city} le ${formatServiceDate(location)} sont fermées. Tina aura une sélection disponible au camion pendant le service.`
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
      message: `Les précommandes pour ${location.city} le ${formatServiceDate(location)} sont fermées. Tina pourra ouvrir les commandes du jour à partir de 6h00 si elle le souhaite.`
    };
  }

  function buildWhatsAppMessage(order, loc) {
    return `Bonjour,

Votre commande ${order.id} est bien confirmée pour ${loc.city} le ${formatServiceDate(loc)}.

Vous pourrez la récupérer pendant le service directement au food truck.

Merci et à très bientôt 🙏🌶️
KRUA PEÈN THAÏ`;
  }

  function buildSmsMessage(order, loc) {
    return `KRUA PEÈN THAÏ : Commande ${order.id} confirmée pour ${loc.city} ${formatServiceDate(loc)}. Retrait pendant le service au food truck. Merci 🌶️`;
  }

  function smsLink(phone, text) {
    const normalized = phone.replace(/\s/g, "");
    return `sms:${normalized}?body=${encodeURIComponent(text)}`;
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
      .filter(o => !q || [o.id,o.customer.firstName,o.customer.lastName,o.customer.phone,locations.find(l=>l.id===o.locationId)?.city].filter(Boolean).join(" ").toLowerCase().includes(q))
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

          <section id="commander" className="mx-auto max-w-7xl px-4 py-12"><div className="mb-6 flex items-center gap-3"><ShoppingCart className="text-amber-300"/><h2 className="text-3xl font-black">Commander cette semaine</h2></div><div className="mb-6 space-y-4"><div className="flex gap-2 overflow-x-auto pb-2">{categories.map(cat=><button key={cat} onClick={()=>{setCategoryFilter(cat); if(cat!=="Tous") setOpenCategory(cat);}} className={`whitespace-nowrap rounded-full px-4 py-3 text-sm font-bold ${categoryFilter===cat ? "bg-amber-400 text-black" : "bg-white/10"}`}>{cat==="Tous" ? "Tout" : categoryLabels[cat] || cat}</button>)}</div><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18}/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Rechercher : saumon, poké, S16..." className="w-full rounded-2xl border border-white/10 bg-stone-900 py-4 pl-12 pr-4"/></div></div><div className="grid gap-6 lg:grid-cols-[1fr_380px]"><div className="space-y-4">{productsByCategory.map(group=>{const isOpen=openCategory===group.category || categoryFilter!=="Tous"; return <div key={group.category} className="overflow-hidden rounded-3xl border border-white/10 bg-stone-950/70"><button onClick={()=>setOpenCategory(isOpen?"":group.category)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><div><h3 className="text-2xl font-black text-amber-200">{categoryLabels[group.category] || group.category}</h3><p className="mt-1 text-sm text-stone-400">{group.items.length} produit{group.items.length>1?"s":""}</p></div><ChevronDown className={`text-amber-300 transition-transform ${isOpen ? "rotate-180" : ""}`}/></button>{isOpen && <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2">{group.items.map(p=><article key={p.id} className="rounded-3xl border border-white/10 bg-stone-900 p-5"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-black text-amber-300">{p.code}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-stone-300">{p.fixed ? "Permanent" : "Cette semaine"}</span></div><h3 className="text-xl font-black">{p.name}</h3><p className="mt-2 min-h-12 text-sm text-stone-300">{p.desc}</p><div className="mt-5 flex items-center justify-between"><span className="text-lg font-black text-amber-300">{euro(p.price)}</span><button disabled={!selectedAvailability.open} onClick={()=>addToCart(p.id)} className="rounded-xl bg-amber-400 px-4 py-3 font-bold text-black disabled:opacity-40">Ajouter</button></div></article>)}</div>}</div>})}</div><aside className="h-fit rounded-3xl border border-amber-300/20 bg-black p-5 shadow-xl"><h3 className="mb-4 text-2xl font-black">Votre commande</h3><label className="text-sm text-stone-300">Lieu de retrait</label><select value={locationId} onChange={e=>setLocationId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-stone-900 p-3">{locations.map(l=><option key={l.id} value={l.id}>{l.label} – {l.city}</option>)}</select><div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-sm text-stone-300"><MapPin className="mr-2 inline text-amber-300" size={16}/>{selectedLocation.place} • {selectedLocation.hours}</div>{!selectedAvailability.open && <div className="mt-4 rounded-xl bg-red-950/70 p-4 text-sm font-bold text-red-100">{selectedAvailability.message}</div>}{selectedAvailability.open && selectedAvailability.mode === "service" && <div className="mt-4 rounded-xl bg-green-950/70 p-4 text-sm font-bold text-green-100">{selectedAvailability.message}</div>}<div className="my-5 space-y-3">{cartLines.length===0 && <div className="rounded-xl bg-white/[0.04] p-4 text-stone-400">Panier vide</div>}{cartLines.map(line=><div key={line.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] p-3"><div><div className="font-bold">{line.name}</div><div className="text-sm text-stone-400">{line.qty} × {euro(line.price)}</div></div><div className="flex items-center gap-2"><button onClick={()=>removeFromCart(line.id)} className="rounded-lg bg-white/10 px-3 py-2">-</button><button onClick={()=>addToCart(line.id)} className="rounded-lg bg-white/10 px-3 py-2">+</button></div></div>)}</div><div className="mb-5 flex items-center justify-between border-t border-white/10 pt-4 text-xl font-black"><span>Total</span><span className="text-amber-300">{euro(total)}</span></div><div className="grid gap-3"><input placeholder="Prénom *" value={customer.firstName} onChange={e=>setCustomer({...customer, firstName:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Nom" value={customer.lastName} onChange={e=>setCustomer({...customer, lastName:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input placeholder="Téléphone *" value={customer.phone} onChange={e=>setCustomer({...customer, phone:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><textarea placeholder="Commentaire" value={customer.note} onChange={e=>setCustomer({...customer, note:e.target.value})} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><button disabled={!selectedAvailability.open} onClick={submitOrder} className="rounded-2xl bg-amber-400 px-5 py-4 font-black text-black disabled:opacity-40">{selectedAvailability.open ? "Envoyer la demande" : "Commandes fermées"}</button><p className="text-xs text-stone-400">{selectedAvailability.open ? selectedAvailability.message : selectedAvailability.message}</p></div></aside></div></section>

          <section id="lieux" className="mx-auto max-w-7xl px-4 py-12"><div className="mb-6 flex items-center gap-3"><CalendarDays className="text-amber-300"/><h2 className="text-3xl font-black">Où nous trouver</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{locations.map(l=><div key={l.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><div className="font-bold text-amber-300">{l.label}</div><div className="mt-2 text-2xl font-black">{l.city}</div><div className="mt-2 text-stone-300">{l.place}</div><div className="mt-4 flex items-center gap-2 text-stone-200"><Clock size={16}/>{l.hours}</div></div>)}</div></section>

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
                    const orderTotal=order.items.reduce((s,i)=>s+i.qty*i.price,0);
                    const whatsMsg=buildWhatsAppMessage(order, loc);
                    const smsMsg=buildSmsMessage(order, loc);
                    return <div key={order.id} id={`order-${order.id}`} className="mb-4 rounded-3xl border border-white/10 bg-black p-5">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-2xl font-black text-amber-300">{order.id}</div>
                          <div className="text-lg font-bold">{order.customer.firstName} {order.customer.lastName}</div>
                          <div className="text-stone-300">{order.customer.phone}</div>
                        </div>
                        <span className={`rounded-full px-4 py-2 text-sm font-bold ${order.status==="Confirmée" ? "bg-green-500/20 text-green-300" : order.status==="Annulée" ? "bg-red-500/20 text-red-300" : order.status==="Récupérée" ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"}`}>{order.status}</span>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] p-4"><MapPin className="mr-2 inline text-amber-300" size={16}/>{loc.city} • {loc.label} • {formatServiceDate(loc)} • {loc.hours}</div>
                      <div className="my-4 space-y-2">{order.items.map(item=><div key={item.id} className="flex justify-between rounded-xl bg-white/[0.04] px-4 py-3"><span>{item.qty} × {item.name}</span><b>{euro(item.qty*item.price)}</b></div>)}</div>
                      {order.customer.note && <div className="mb-4 rounded-xl bg-amber-400/10 p-3 text-sm text-amber-100">Note : {order.customer.note}</div>}
                      <div className="mb-4 flex justify-between border-t border-white/10 pt-4 text-xl font-black"><span>Total</span><span>{euro(orderTotal)}</span></div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                        <a href={whatsappLink(order.customer.phone, whatsMsg)} target="_blank" rel="noreferrer" onClick={()=>updateOrderStatus(order.id,"Confirmée")} className="rounded-2xl bg-green-500 px-4 py-4 text-center font-black text-black"><MessageCircle className="mr-2 inline" size={18}/>Confirmer WhatsApp</a>
                        <a href={smsLink(order.customer.phone, smsMsg)} onClick={()=>updateOrderStatus(order.id,"Confirmée")} className="rounded-2xl bg-white/10 px-4 py-4 text-center font-black"><Phone className="mr-2 inline" size={18}/>Confirmer SMS</a>
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
          {adminTab==="products" && <div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Produits commandables</h2><p className="mb-5 text-stone-300">Tina coche les produits disponibles cette semaine et peut ajuster les prix.</p><div className="grid gap-3 md:grid-cols-2">{products.map(p=><div key={p.id} className="rounded-2xl bg-black/40 p-4"><div className="mb-3 flex items-start justify-between gap-3"><div><div className="text-sm font-black text-amber-300">{p.code}</div><div className="font-black">{p.name}</div><div className="text-sm text-stone-400">{p.category}</div></div><label className="flex items-center gap-2 text-sm font-bold"><span>{p.available ? "ON" : "OFF"}</span><input type="checkbox" checked={p.available} onChange={()=>updateProduct(p.id,"available",!p.available)} className="h-7 w-7 accent-amber-400"/></label></div><div className="grid gap-2 sm:grid-cols-[1fr_120px]"><input value={p.name} onChange={e=>updateProduct(p.id,"name",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input type="number" step="0.1" value={p.price} onChange={e=>updateProduct(p.id,"price",Number(e.target.value))} className="rounded-xl border border-white/10 bg-stone-900 p-3"/></div></div>)}</div></div>}
          {adminTab==="locations" && <div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Emplacements & horaires</h2><div className="grid gap-4 md:grid-cols-2">{locations.map(l=><div key={l.id} className="rounded-2xl bg-black/40 p-4"><div className="mb-4 font-black text-amber-300">{l.label}</div><div className="grid gap-3"><input value={l.city} onChange={e=>updateLocation(l.id,"city",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input value={l.place} onChange={e=>updateLocation(l.id,"place",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/><input value={l.hours} onChange={e=>updateLocation(l.id,"hours",e.target.value)} className="rounded-xl border border-white/10 bg-stone-900 p-3"/></div></div>)}</div></div>}
          {adminTab==="settings" && <div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Ouverture commandes</h2><button onClick={toggleOrdersOpen} className={`w-full rounded-2xl p-5 text-xl font-black ${ordersOpen ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>{ordersOpen ? "PRÉCOMMANDES OUVERTES" : "PRÉCOMMANDES FERMÉES"}</button><button onClick={toggleServiceOrdersOpen} className={`mt-4 w-full rounded-2xl p-5 text-lg font-black ${serviceOrdersOpen ? "bg-amber-400 text-black" : "bg-white/10 text-white"}`}>{serviceOrdersOpen ? "COMMANDES PENDANT SERVICE ACTIVÉES" : "COMMANDES PENDANT SERVICE DÉSACTIVÉES"}</button><p className="mt-3 text-sm text-stone-400">Si activé, les clients peuvent commander pendant le service uniquement. À utiliser seulement si Tina veut surveiller le dashboard en direct.</p></div><div className="rounded-3xl border border-white/10 bg-stone-900 p-5"><h2 className="mb-4 text-2xl font-black">Message accueil</h2><textarea value={siteMessage} onChange={e=>saveSiteMessage(e.target.value)} className="min-h-32 w-full rounded-xl border border-white/10 bg-black p-4"/></div></div>}
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<KruaSite />);
