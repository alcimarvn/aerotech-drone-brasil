
import { createServiceOrder, getServiceOrders } from './src/app/actions/service-orders';
import { db } from './src/lib/db';

(async () => {
    try {
        // Need a client ID first
        const client = await db.client.findFirst();
        if (!client) {
            console.log("No client found");
            return;
        }

        const scheduledDate = new Date("2026-03-10");
        console.log("Testing creation with scheduledDate:", scheduledDate);

        const result = await createServiceOrder({
            clientId: client.id,
            serviceType: "PULVERIZATION",
            areaSize: 100,
            pricePerHa: 50,
            scheduledDate: scheduledDate,
            status: "SCHEDULED" // This might be ignored by createServiceOrder but let's try
        });

        if (result.success) {
            console.log("Creation successful, ID:", result.data.id);
            const created = await db.serviceorder.findUnique({
                where: { id: result.data.id }
            });
            console.log("Fetched created order:", JSON.stringify(created, null, 2));
        } else {
            console.error("Creation failed:", result.error);
        }

    } catch (e) {
        console.error(e);
    }
})();
