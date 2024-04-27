import { NextResponse } from "next/server";
import User from "@/models/users";
import { connectDB } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { fullname, email, password } = await request.json();
  console.log(fullname, email, password);

  // Verifica que la contraseña cumpla con los requisitos
  if (!password || password.length < 6)
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters long!",
      },
      {
        status: 400,
      }
    );

  try {
    // Conectar a la base de datos
    await connectDB();

    // Verifica si el usuario ya existe
    const userFound = await User.findOne({ email });
    if (userFound)
      return NextResponse.json(
        {
          message: "User already exists!",
        },
        {
          status: 400,
        }
      );

    // Encripta la contraseña y crea un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      fullname,
      password: hashedPassword,
    });

    // Guarda el nuevo usuario en la base de datos
    const savedUser = await user.save();
    console.log(savedUser);

    // Devuelve la respuesta JSON con el nuevo usuario guardado
    return NextResponse.json(savedUser);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
