"use client";
import dynamic from "next/dynamic";

// Next does not defer Client bundles imported dynamically by a Server Component.
// Keep the actual presentation imports behind a Client dynamic boundary too.
export const BookHomePresentation = dynamic(() => import("./BookShelf").then(m => m.BookShelf));
export const BookInputPresentation = dynamic(() => import("./BookInput").then(m => m.BookInput));
export const BookFooterPresentation = dynamic(() => import("./BookLegalRoutes").then(m => m.BookFooter));
export const BookLegalPresentation = dynamic(() => import("./BookLegalRoutes").then(m => m.BookLegalPage));
export const BookReadingPresentation = dynamic(() => import("./BookReading").then(m => m.BookReading));
