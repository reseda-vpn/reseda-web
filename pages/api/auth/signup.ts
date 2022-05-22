import { hashPassword } from "@root/lib/crpyt";
import prisma from "@root/lib/prisma";
import { randomUUID } from "crypto";

async function handler(req, res) {
    if (req.method !== 'POST') return;

    const { email, password, name } = req.body;

    if (
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
        message:
            'Invalid input - password should also be at least 7 characters long.',
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if(existingUser) {
        res.status(422).json({ message: 'User already exists!' });
        return;
    }

    const existingLead = await prisma.lead.findUnique({ where: { email } });
    if(!existingLead) {
        await prisma.lead.create({
            data: {
                email: email
            }
        })
    }

    // Hash password, and do same on signup end for identical comparison.
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
        data: {
            email, 
            password: hashedPassword,
            name, 
            accounts: {
                create: {
                    type: "credentials",
                    provider: "reseda",
                    providerAccountId: randomUUID()
                }
            }
        }
    });

    res.status(201).json({ message: 'User Created Successfully' });
}

export default handler;