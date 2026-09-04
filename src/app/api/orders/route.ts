import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET : Récupérer toutes les commandes avec les infos client
export async function GET() {
  try {
    const dbOrders = await db.select().from(orders).orderBy(desc(orders.date));

    const result = await Promise.all(
      dbOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
          
        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en GET /api/orders:", error);
    return NextResponse.json(
      { error: "Error al recuperar los pedidos" },
      { status: 500 }
    );
  }
}

// POST : Créer une commande avec les données de livraison
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, date, total, items, customerName, country, city, address, whatsapp, email } = body;

    if (!id || total === undefined || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos para procesar el pedido" },
        { status: 400 }
      );
    }

    // Insérer la commande avec les coordonnées client
    await db.insert(orders).values({
      id,
      date,
      total,
      status: "Pendiente de pago",
      customerName: customerName || "",
      country: country || "",
      city: city || "",
      address: address || "",
      whatsapp: whatsapp || "",
      email: email || "",
    });

    // Insérer les articles
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image || "",
      });
    }

    return NextResponse.json({ success: true, orderId: id }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/orders:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}