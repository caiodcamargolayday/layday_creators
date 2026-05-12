"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

const PAGES = [
  // Hostels
  { group: "Our Hostels", value: "/layday-gilit",    label: "Lay Day Gili T" },
  { group: "Our Hostels", value: "/layday-canggu",   label: "Lay Day Canggu" },
  { group: "Our Hostels", value: "/layday-uluwatu",  label: "Lay Day Uluwatu" },
  { group: "Our Hostels", value: "/coday-uluwatu",   label: "CoDay Uluwatu" },
  // Explore
  { group: "Explore",     value: "/experiences",     label: "Experiences" },
  { group: "Explore",     value: "/destinations",    label: "Destinations" },
  { group: "Explore",     value: "/deals",           label: "Deals & Promos" },
  // Events
  { group: "Events",      value: "/creatorsweek-gilit", label: "🌴 Gili Creator Week" },
  // Info
  { group: "Info",        value: "/careers",         label: "Careers" },
  { group: "Info",        value: "/contact-us",      label: "Contact Us" },
];

export function SearchTool() {
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState("1");
  const [promo, setPromo] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (destination) {
      const url = new URL(destination, window.location.origin);
      url.searchParams.append("guests", guests);
      if (promo) url.searchParams.append("promo", promo);
      router.push(url.pathname + url.search);
    }
  };

  // Group pages for rendering
  const groups = Array.from(new Set(PAGES.map((p) => p.group)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto px-4 -mt-16 relative z-20"
    >
      <Card className="p-4 shadow-2xl bg-white/95 backdrop-blur-lg border-0 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Destination
            </label>
            <Select value={destination} onValueChange={(val) => setDestination(val || "")}>
              <SelectTrigger className="w-full border-gray-300 h-12">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <SelectValue placeholder="Where to?" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectGroup key={group}>
                    <SelectLabel className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">
                      {group}
                    </SelectLabel>
                    {PAGES.filter((p) => p.group === group).map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates (Decorative for now) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Dates</label>
            <Button variant="outline" className="w-full border-gray-300 h-12 justify-start text-left font-normal text-gray-600">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-xs truncate">Select Dates</span>
            </Button>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Guests</label>
            <Select value={guests} onValueChange={(val) => setGuests(val || "1")}>
              <SelectTrigger className="w-full border-gray-300 h-12">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Guests" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Guest{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Promo */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Promo Code</label>
            <Input 
              placeholder="Code" 
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="h-12 border-gray-300"
            />
          </div>

          {/* Search */}
          <Button
            onClick={handleSearch}
            className="w-full h-12 bg-black hover:bg-black/80 text-white font-bold uppercase tracking-wider"
          >
            Search
          </Button>

        </div>
      </Card>
    </motion.div>
  );
}
