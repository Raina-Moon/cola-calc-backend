import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient()

export const notifyActiveUser = () => {
    cron.schedule("*/10 * * * *", async () => {
        const threeHrsAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const users = await prisma.user.findMany({
            where : {
                lastActiveAt: {lt : threeHrsAgo},
                notificationEnabled: true,
            }
        })

        for (const user of users) {
            const alreadyNotified = await prisma.notification.findFirst({
                where: {
                    userId : user.id,
                    createdAt : {
                        gte : threeHrsAgo,
                    },
                    message : {
                        contains : "콜라" // "콜라" is the keyword to check if the user has been notified
                    }
                }
            })

            if (!alreadyNotified) {
                await prisma.notification.create({
                    data : {
                        userId : user.id,
                        message : "Whoops, sipped some cola and forgot to log it? Pop back and track it now!",
                    }
                })

                console.log(`Notification sent to user ${user.id}`);
            }
        }
    })
}