'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    function goSearch() {
        router.push(`/stops?search=${encodeURIComponent(query)}`);
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Transways</h1>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a stop..."
                style={{ padding: 10, width: 300 }}
            />

            <button onClick={goSearch} style={{ marginLeft: 8 }}>
                Search
            </button>
            <div style={{ marginTop: 20 }}>
                <button onClick={() => router.push("/map")}>Open Map</button>
            </div>
        </div>
    );
}