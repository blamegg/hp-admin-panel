import { Metadata } from "next";
import { Signin } from "@/components";

export const metadata: Metadata = {
  title: "Hanging Panda",
  description:
    "HangingPanda is a global leader in modern business innovation. We encourage you to dream big and provide them with comprehensive solutions designed specifically to meet your visual and performance needs.",
};

export default function Home() {
  return <Signin />;
}
