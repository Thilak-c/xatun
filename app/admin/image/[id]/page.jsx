"use client"

// app/image/[id]/page.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMainImageUrl } from "@/lib/imageUtils";

export default async function ImagePage({ params }) {
    const response = await fetch(`/api/images/${params.id}`);
    const image = await response.json();
  
    if (!image) {
      return <div>Image not found</div>;
    }
  
    return (
      <div>
        <h1>{image.name}</h1>
        <img
          src={getMainImageUrl(image)}
          alt={image.name}
        />
      </div>
    );
  }