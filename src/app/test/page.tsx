"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";

export default function Test() {
  return (
    <Container>
      <div className="bg-red-300 w-56 h-56 mt-5 rounded-xl relative overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="bg-blue-600 w-56 flex-1"></div>
          <div className="bg-blue-300 w-56 flex-1"></div>
        </div>
      </div>
    </Container>
  );
}
