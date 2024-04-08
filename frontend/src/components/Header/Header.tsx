"use client";

import Link from "next/link";
import Image from "next/image";
import HuskyLogo from "./HuskyLogo.png";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header() {
    const pathname = usePathname();
    return (
        <header>
            <nav className="fixed w-full z-50 bg-[#1e0c6e] border-b shadow-xl border-[#ffffff]">
                <div className="flex justify-center items-center p-4 px-10 text-xl font-semibold">
                    <Link
                        href="/"
                        className={`flex px-4 py-2 transition hover:text-primary ${
                            pathname === "/" ? "text-white" : "text-gray-500"
                        }`}
                    >
                        <Image src = {HuskyLogo} alt="Husky-Pride" width = {35} height = {35}/>
                        Husky NFT Marketplace
                    </Link>
                    <Link
                        href="/sellNft"
                        className={`px-4 py-2 transition hover:text-primary ${
                            pathname === "/sellNft"
                                ? "text-white"
                                : "text-gray-500"
                        }`}
                    >
                        List My NFT
                    </Link>
                    <Link
                        href="/profile"
                        className={`pl-4 py-2 pr-8 transition hover:text-primary ${
                            pathname === "/profile"
                                ? "text-white"
                                : "text-gray-500"
                        }`}
                    >
                        Profile
                    </Link>
                    <ConnectWallet
                        className="my-custom-button"
                        btnTitle="Connect"
                    />
                </div>
            </nav>
        </header>
    );
}
