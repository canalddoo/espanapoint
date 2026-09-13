import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

// POST : Créer une commande avec les données de livraison et envoyer la notification e-mail
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

    // 1. Insérer la commande avec les coordonnées client
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

    // 2. Insérer les articles dans la table des détails
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

    // 3. Préparer le tableau HTML des articles pour le mail
    const itemsTableRows = items
      .map(
        (item: { name: string; quantity: number; price: number }) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price} €</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toLocaleString()} €</td>
          </tr>`
      )
      .join("");

    // 4. Envoyer l'e-mail de notification à l'administrateur
    try {
      await resend.emails.send({
        from: "Espanapoint <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "espanapoint9@gmail.com",
        subject: `🚨 Nueva Orden Recibida #${id} - ${customerName || "Cliente"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
            <h2 style="color: #0070f3; text-align: center; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">
              ¡Nuevo Pedido Recibido! 🎉
            </h2>

            <div style="margin-bottom: 20px;">
              <p><strong>ID de Pedido:</strong> #${id}</p>
              <p><strong>Fecha:</strong> ${date}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #111;">👤 Datos del Cliente</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${customerName || "No especificado"}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email || "N/A"}</p>
              <p style="margin: 5px 0;"><strong>WhatsApp:</strong> ${whatsapp || "N/A"}</p>
              <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${city ? `${city}, ${country}` : country || "N/A"}</p>
              <p style="margin: 5px 0;"><strong>Dirección:</strong> ${address || "N/A"}</p>
            </div>

            <h3 style="color: #111;">🛒 Artículos Comprados</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <thead>
                <tr style="background-color: #0070f3; color: #ffffff; text-align: left;">
                  <th style="padding: 8px;">Producto</th>
                  <th style="padding: 8px; text-align: center;">Cantidad</th>
                  <th style="padding: 8px; text-align: right;">Precio Unit.</th>
                  <th style="padding: 8px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <div style="text-align: right; background-color: #eaf5ea; padding: 10px; borderRadius: 6px;">
              <span style="font-size: 16px;">Monto Total a Recibir: </span>
              <strong style="font-size: 20px; color: #2ecc71;">${total.toLocaleString()} €</strong>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error enviando el correo:", emailError);
      // On log le problème de mail sans bloquer la confirmation de commande au client
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