import { verifyPassword } from "@root/lib/crpyt";
import prisma from "@root/lib/prisma";

async function handler(req, res) {
    if (req.method !== 'POST') res.status(404).json({ message: "Invalid Method, expected POST" });

    const { email, password } = JSON.parse(req.body);

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

    const existingUser = await prisma.user.findUnique({ 
        where: { 
            email
        } 
    });

    // Hash password, and do same on signup end for identical comparison.
    const truePass = verifyPassword(password, existingUser.password);

    if(!truePass) {
        res.status(422).json({
            message:
                'Invalid username or password.',
            }
        );
    }

    res.status(201).json({ ...existingUser, password: null });
}

export default handler;