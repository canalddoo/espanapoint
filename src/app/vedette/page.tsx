"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Selección de los mejores productos reales de tu lista PRODUCTS_DATA
const FEATURED_PRODUCTS = [
  // --- DISPOSITIVOS ELECTRÓNICOS Y GAMING ---
  { id: 1, name: "Apple iPhone 16 (128 GB) (Reacondicionado) - Cian + Funda Transparente con MagSafe", price: 671.99, category: "Dispositivos electrónicos", image: "/img/iPhone16.jpg", tag: "Favorito" },
  { id: 2, name: "iPhone 15 Pro Max (Reacondicionado)", price: 521.99, category: "Dispositivos electrónicos", image: "https://c0.lestechnophiles.com/images.frandroid.com/wp-content/uploads/2023/09/iphone-15-pro-max-768x768.png?webp=1&key=6d7ed62f", tag: "Novedad" },
  { id: 3, name: "Google Pixel 11 Pro - Smartphone Android libre - Negro volcánico, 256 GB", price: 1150.00, category: "Dispositivos electrónicos", image: "/img/GooglePixel11Pro.jpg", tag: "Top Gama" },
  { id: 4, name: "Sony, Consola PlayStation 5 Edición Estándar 1 TB con lector Blu-ray 4K, SSD Ultrarrápido, Audio 3D", price: 481.99, category: "Dispositivos electrónicos", image: "/img/SonyConsolePlayStation5.jpg", tag: "Más Vendido" },
  { id: 5, name: "Nintendo Switch (OLED) Consola de Juegos Portátil de 17,8 cm, 64 GB, Pantalla Táctil, WiFi, Blanco", price: 201.00, category: "Dispositivos electrónicos", image: "/img/NintendoSwitch.jpg", tag: "Popular" },
  { id: 6, name: "Apple AirPods Pro 3 Auriculares Inalámbricos, Cancelación Activa de Ruido", price: 151.00, category: "Dispositivos electrónicos", image: "/img/AppleAirPodsPro3.jpg", tag: "Recomendado" },
  { id: 7, name: "Sony WH-1000XM5SA Edición Especial con estuche blando, Cancelación Activa de Ruido, Bluetooth", price: 211.00, category: "Dispositivos electrónicos", image: "/img/SonyWH-1000XM5SA.jpg", tag: "Audio Premium" },

  // --- DEPORTE & FITNESS ---
  { id: 8, name: "URLIFE Bicicleta Eléctrica para Adultos, Neumáticos Anchos de 16\"", price: 1201.00, category: "Deporte / Fitness", image: "/img/URLIFEVeloelectrique.jpg", tag: "Oferta Especial" },
  { id: 9, name: "Skechers Uno Stand on Air Zapatillas", price: 51.00, category: "Deporte / Fitness", image: "/img/SkechersUnoStandonAir.jpg", tag: "Tendencia Moda" },
  { id: 10, name: "Kit de Mancuernas Ajustables (20kg)", price: 47.00, category: "Deporte / Fitness", image: "/img/Halteres-reglables.jpg", tag: "Esencial Fitness" },

  // --- COCINA & HOGAR ---
  { id: 11, name: "Ninja Foodi FlexDrawer Freidora de Aire, Dual Zone Con Separador Extraíble", price: 151.00, category: "Cocina", image: "/img/NinjaFoodiFlexDrawerAir.jpg", tag: "Mejor Valoración" },
  { id: 12, name: "ECOVACS T50 Omni GEN2 Robot Aspirador con Estación, Potencia de 21000 Pa", price: 271.00, category: "Hogar", image: "/img/ECOVACST50OmniGEN2Aspirateur.jpg", tag: "Alta Tecnología" },
  { id: 13, name: "DREAME H15 Pro CarpetFlex aspiradora inalámbrica con mopa, aspiradora húmeda y seca", price: 361.00, category: "Hogar", image: "/img/DREAMEH15Pro.jpg", tag: "Top Limpieza" },

  // --- BELLEZA Y CUIDADO PERSONAL ---
  { id: 14, name: "CeraVe Crema Hidratante para Rostro y Cuerpo, Hidratación 48H", price: 18.99, category: "Belleza y cuidado personal", image: "/img/CeraVeBaume.jpg", tag: "Top Calidad" },
  { id: 15, name: "Cepillo secador y moldeador TYMO - Secador y cepillo iónico «One-Step»", price: 48.00, category: "Belleza y cuidado personal", image: "/img/TYMOBrosse.jpg", tag: "Tendencia" }
];

export default function FeaturedPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuyNow = (product: typeof FEATURED_PRODUCTS[0]) => {
    addToCart(product);
    router.push("/panier");
  };

  return (
    <div className="home-page-container">
      {/* Encabezado estilizado para la sección Destacados */}
      <div className="featured-hero">
        <span className="featured-subtitle">Exclusividades Espanapoint</span>
        <h1>Los Mejores Productos del Momento</h1>
        <p>Descubra nuestra selección exclusiva de productos más votados por nuestros clientes por su calidad y fiabilidad.</p>
      </div>

      {/* Grilla de productos */}
      <div className="products-grid">
        {FEATURED_PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            
            <div className="product-image-wrapper">
              {/* Badge Dinámico en la imagen */}
              <span className="featured-badge">{product.tag}</span>
              
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
                  Comprar ahora
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}