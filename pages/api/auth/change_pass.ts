import { hashPassword, verifyPassword } from "@root/lib/crpyt";
import prisma from "@root/lib/prisma";

async function handler(req, res) {
    if (req.method !== 'POST') return;

    const { email, old_password, new_password } = typeof req.body == "string" ? JSON.parse(req.body) : req.body;

    console.log(req.body);

    if (
        !email ||
        !email.includes('@') ||
        !new_password ||
        new_password.trim().length < 7
    ) {
        res.status(422).json({
        message:
            'Password should also be at least 7 characters long.',
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if(!existingUser) {
        console.log(existingUser);

        res.status(404).json({
            message: "User does not exist."
        })
        return;
    }

    // Hash password, and do same on signup end for identical comparison.
    const truePass = await verifyPassword(old_password, existingUser.password);

    console.log(truePass);

    if(!truePass) {
        res.status(422).json({
            message:
                'Invalid username or password.',
            }
        );
    }else {
        console.log("Ready to update value: ", new_password);

        const hashed_pass = await hashPassword(new_password);

        const result = await prisma.user.update({
            data: {
                password: hashed_pass
            },
            where: {
                id: existingUser.id
            }
        });

        console.log(result);

        res.status(201).json({ message: 'Password Updated Successfully' });
    }
}

export default handler;