import { verifyPassword } from "@root/lib/crpyt";
import prisma from "@root/lib/prisma";
import NextCors from 'nextjs-cors';

async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
     
    if (req.method !== 'POST') res.status(404).json({ message: "Invalid Method, expected POST" });

    const { email, password } = req.body;

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

    if(!existingUser) {
        console.log(existingUser);

        res.status(404).json({
            message: "Invalid User - User does not exist."
        })
        return;
    }

    // Hash password, and do same on signup end for identical comparison.
    const truePass = await verifyPassword(password, existingUser.password);

    console.log(truePass);

    if(!truePass) {
        res.status(422).json({
            message:
                'Invalid username or password.',
            }
        );
    }else {
        res.status(201).json({ ...existingUser, password: null });
    }
}

export default handler;