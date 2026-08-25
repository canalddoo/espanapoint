"use client";

import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import { Suspense, useState, useEffect } from "react";
import ContactPage from "./contact/page";


const PRODUCTS_DATA = [
  
  { id: 1, name: "iPhone 13 Pro Max (Reacondicionado)", price: 331.99, category: "Dispositivos electrónicos", image: "https://c0.lestechnophiles.com/images.frandroid.com/wp-content/uploads/2021/09/apple-iphone-13-pro-max-frandroid-2021-768x768.png?webp=1&key=33af98cc" },
  { id: 2, name: "iPhone 15 Pro Max (Reacondicionado)", price: 521.99, category: "Dispositivos electrónicos", image: "https://c0.lestechnophiles.com/images.frandroid.com/wp-content/uploads/2023/09/iphone-15-pro-max-768x768.png?webp=1&key=6d7ed62f" },
  { id: 3, name: "Apple iPhone 16 (128 GB) (Reacondicionado) - Cian + Funda Transparente con MagSafe", price: 671.99, category: "Dispositivos electrónicos", image: "/img/iPhone16.jpg" },
  { id: 4, name: "Google Pixel 11 Pro - Smartphone Android libre - Negro volcánico, 256 GB", price: 1150.00, category: "Dispositivos electrónicos", image: "/img/GooglePixel11Pro.jpg" },
  { id: 5, name: "Apple AirPods Pro 3 Auriculares Inalámbricos, Cancelación Activa de Ruido", price: 151.00, category: "Dispositivos electrónicos", image: "/img/AppleAirPodsPro3.jpg" },
  { id: 6, name: "Sony WH-1000XM5SA Edición Especial con estuche blando, Cancelación Activa de Ruido", price: 211.00, category: "Dispositivos electrónicos", image: "/img/SonyWH-1000XM5SA.jpg" },
  { id: 7, name: "Apple Watch Series 9 (GPS + Cellular, 45 MM) Caja de Aluminio Blanco Estrella", price: 371.00, category: "Dispositivos electrónicos", image: "/img/AppleWatchSeries9.jpg" },
  { id: 8, name: "DJI Osmo Pocket 3 + Transmisor Mic Mini (Negro Obsidiana)", price: 401.00, category: "Dispositivos electrónicos", image: "/img/DJIOsmoPocket3.jpg" },
  { id: 9, name: "Sony, Consola PlayStation 5 Edición Estándar 1 TB", price: 481.99, category: "Dispositivos electrónicos", image: "/img/SonyConsolePlayStation5.jpg" },
  { id: 10, name: "Nintendo Switch (OLED) Consola de Juegos Portátil de 17,8 cm, 64 GB", price: 201.00, category: "Dispositivos electrónicos", image: "/img/NintendoSwitch.jpg" },
  { id: 11, name: "Apple MacBook Pro - Ordenador portátil con chip M5, 1 TB de almacenamiento", price: 2199.00, category: "Dispositivos electrónicos", image: "/img/AppleMacBookPro-Ordinateur.jpg" },
  { id: 12, name: "PC gaming Shark RGBeast Mini R502", price: 1299.00, category: "Dispositivos electrónicos", image: "/img/SharkRGBeastMiniR502.jpg" },
  { id: 13, name: "SSD externo SanDisk Extreme de 1 TB (hasta 1050 MB/s)", price: 159.00, category: "Dispositivos electrónicos", image: "/img/SANDISKextremeDisqueSSD.jpg" },
  { id: 14, name: "The G-Lab Keyz Titanium Noir - Teclado gaming mecánico 65% RGB", price: 29.00, category: "Dispositivos electrónicos", image: "/img/TheG-LabKeyz.jpg" },

  // ==========================================
  // DEPORTE / FITNESS (8 Productos)
  // ==========================================
  { id: 15, name: "PUMA Tazon 6 Fracture FM, Zapatillas para Hombre", price: 41.99, category: "Deporte / Fitness", image: "/img/PUMATazon6FractureFM.jpg" },
  { id: 16, name: "Adidas Unisex Zapatillas VS Pace 2.0", price: 36.99, category: "Deporte / Fitness", image: "/img/adidasUnisexChaussure.jpg" },
  { id: 17, name: "Skechers Uno Stand on Air Zapatillas", price: 51.00, category: "Deporte / Fitness", image: "/img/SkechersUnoStandonAir.jpg" },
  { id: 18, name: "Kit de Mancuernas Ajustables (20kg)", price: 47.00, category: "Deporte / Fitness", image: "/img/Halteres-reglables.jpg" },
  { id: 19, name: "URLIFE Bicicleta Eléctrica para Adultos, Neumáticos Anchos de 16\"", price: 1201.00, category: "Deporte / Fitness", image: "/img/URLIFEVeloelectrique.jpg" },
  { id: 20, name: "ZIPRO Bicicleta Estática para Adulto con Resistencia Magnética", price: 111.00, category: "Deporte / Fitness", image: "/img/ZIPROVelo.jpg" },
  { id: 21, name: "PROIRON Tapis de Yoga Epais 10MM/15MM, Antidérapant", price: 24.99, category: "Deporte / Fitness", image: "/img/PROIRONTapis.jpg" },
  { id: 22, name: "Amazon Basics Slam Medicine Balls for Exercise", price: 20.99, category: "Deporte / Fitness", image: "/img/AmazonBasics.jpg" },

  // ==========================================
  // BELLEZA Y CUIDADO PERSONAL (3 Productos)
  // ==========================================
  { id: 23, name: "MIXA - Sérum Booster de Hidratación Intensa 24H", price: 9.99, category: "Belleza y cuidado personal", image: "/img/MIXASérumBooste.jpg" },
  { id: 24, name: "CeraVe Crema Hidratante para Rostro y Cuerpo, Hidratación 48H", price: 18.99, category: "Belleza y cuidado personal", image: "/img/CeraVeBaume.jpg" },
  { id: 25, name: "Cepillo secador y moldeador TYMO - Secador y cepillo iónico «One-Step»", price: 48.00, category: "Belleza y cuidado personal", image: "/img/TYMOBrosse.jpg" },

  // ==========================================
  // HOGAR & COCINA (5 Productos)
  // ==========================================
  { id: 26, name: "Ninja Foodi FlexDrawer Freidora de Aire, Dual Zone Con Separador Extraíble", price: 151.00, category: "Cocina", image: "/img/NinjaFoodiFlexDrawerAir.jpg" },
  { id: 27, name: "ECOVACS T50 Omni GEN2 Robot Aspirador con Estación, Potencia de 21000 Pa", price: 271.00, category: "Hogar", image: "/img/ECOVACST50OmniGEN2Aspirateur.jpg" },
  { id: 28, name: "DREAME H15 Pro CarpetFlex aspiradora inalámbrica con mopa", price: 361.00, category: "Hogar", image: "/img/DREAMEH15Pro.jpg" },
  { id: 29, name: "Cámara de vigilancia EZVIZ C8c 4K WiFi para exteriores de 360°", price: 72.00, category: "Hogar", image: "/img/EZVIZC8c4K.jpg" },
  { id: 30, name: "GASLAND GIH604BF Placa Mixta de Gas e Inducción 60 cm", price: 341.00, category: "Cocina", image: "/img/GASLANDGIH604BF.jpg" }

];

export function HomePageContent() {
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Recuperación de los filtros desde la URL
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryQuery = searchParams.get("cat") || "";

 
  // =========================================================================

  const [shuffledProducts, setShuffledProducts] = useState<typeof PRODUCTS_DATA>([]);

  useEffect(() => {
    // Cet appel s'exécute automatiquement dès qu'un utilisateur charge le site
    fetch("/api/visits", { method: "POST" })
      .then((res) => {
        if (!res.ok) console.error("Erreur d'enregistrement de la visite");
      })
      .catch((err) => console.error("Erreur réseau pour l'API visite :", err));
  }, []); // Le tableau vide [] fait en sorte que ça ne se déclenche qu'UNE fois par visite
  // =======

  useEffect(() => {
    // Algorithme de mélange de Fisher-Yates
    const mixProducts = [...PRODUCTS_DATA];
    for (let i = mixProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mixProducts[i], mixProducts[j]] = [mixProducts[j], mixProducts[i]];
    }
    setShuffledProducts(mixProducts);
  }, []); // S'exécute une seule fois à l'arrivée sur le site
  

  // 2. Traducción de los slugs de URL
  const categoryMapping: { [key: string]: string } = {
    electronique: "Dispositivos electrónicos",
    beaute: "Belleza y cuidado personal",
    maison: "Hogar",
    cuisine: "Cocina",
    sport: "Deporte / Fitness"
  };
  const targetCategory = categoryMapping[categoryQuery] || "";

  // 3. Filtrado dinámico (Modifié pour utiliser "shuffledProducts" au lieu de "PRODUCTS_DATA")
  const filteredProducts = shuffledProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    
    const cleanProductCat = product.category.replace(/\s+/g, '').toLowerCase();
    const cleanTargetCat = targetCategory.replace(/\s+/g, '').toLowerCase();
    
    const matchesCategory = targetCategory ? cleanProductCat === cleanTargetCat : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = (product: typeof PRODUCTS_DATA[0]) => {
    addToCart(product);
    router.push("/panier");
  };

  return (
    <main>
      {/* El Hero y las ventajas solo se muestran si el usuario no está filtrando */}
      {!searchQuery && !categoryQuery && (
        <div>
          <Hero />
            
          <div className="features-section">
            <div className="features-container">
              
              {/* Tarjeta 1: Calidad */}
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-shipping">
                  <i className="fas fa-award"></i>
                </div>
                <h3>Calidad Garantizada</h3>
                <p>Productos 100% auténticos y seleccionados con total cuidado</p>
              </div>

              {/* Tarjeta 2: Pago */}
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-security">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Pago Seguro</h3>
                <p>Transacciones 100% protegidas y cifradas de forma segura</p>
              </div>

              {/* Tarjeta 3: Soporte */}
              <div className="feature-card"> 
                <div className="feature-icon-wrapper icon-support">
                  <i className="fas fa-headset"></i>
                </div>
                <h3>Soporte 24/7</h3>
                <p>Asistencia disponible y atenta en cualquier momento</p>
              </div>

              {/* Tarjeta 4: Retirada */}
              <div className="feature-card">
                <div className="feature-icon-wrapper icon-guarantee">
                  <i className="fas fa-store"></i>
                </div>
                <h3>Recogida Rápida</h3>
                <p>Recoja sus artículos directamente en tienda y ahorre tiempo</p>
              </div>

            </div>
          </div>
        </div>
      )}

      <div className="home-page-container">
        <div className="featured-hero">
          <span className="featured-subtitle">Ofertas Exclusivas Espanadeal</span>
          <h1>
            {searchQuery || categoryQuery 
              ? `Resultados de su búsqueda (${filteredProducts.length})` 
              : "Descubra nuestros artículos destacados del momento"}
          </h1>
          
          {/* Botón para restablecer los filtros */}
          {(searchQuery || categoryQuery) && (
            <button 
              onClick={() => router.push("/")}
              style={{ marginTop: "15px", padding: "8px 16px", backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
            >
              Ver todos los productos
            </button>
          )}
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <span className="product-cat">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price.toLocaleString()} €</p>
                  
                  <div className="product-card-actions">
                    <button 
                      onClick={() => addToCart(product)} 
                      className="btn-add-cart"
                      title="Añadir al carrito"
                      type="button"
                    >
                      <i className="fas fa-shopping-basket"></i> +
                    </button>
                    <button 
                      onClick={() => handleBuyNow(product)} 
                      className="btn-buy-now"
                      type="button"
                    >
                      Tramitar pedido
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#636366" }}>
            <i className="fas fa-search" style={{ fontSize: "30px", marginBottom: "15px", display: "block" }}></i>
            Ningún producto coincide con sus criterios de búsqueda.
          </div>
        )}
      </div>

         {filteredProducts.length > 0 && (
  <div style={{ textAlign: "center", marginTop: "40px" }}>
    <button 
      onClick={() => router.push("/produits")}
      className="btn-see-more"
      type="button"
    >
      Ver más <i className="fas fa-arrow-right" style={{ marginLeft: "8px" }}></i>
    </button>
  </div>
)}


<ContactPage />

    </main>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={<div style={{textAlign:"center", }}>Cargando...</div>}>
      <HomePageContent />
    </Suspense>
  );
}