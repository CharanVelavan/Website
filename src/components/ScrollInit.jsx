"use client";

import { useEffect } from "react";
import scrollManager from "@/lib/scroll-utils";
import { SECTION_IDS } from "@/lib/nav-config";

export default function ScrollInit() {
  useEffect(() => {
    scrollManager.init(SECTION_IDS);

    return () => {
      scrollManager.destroy();
    };
  }, []);

  return null;
}
