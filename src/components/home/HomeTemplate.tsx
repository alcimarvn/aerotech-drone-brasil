"use client"

import React from "react"
import { FloatingCTA } from "@/components/ui/floating-cta"
import { LiveNotifications } from "@/components/ui/live-notifications"

// Sections
import { HeroSection } from "./sections/HeroSection"
import { ServicesSection } from "./sections/ServicesSection"
import { AboutSection } from "./sections/AboutSection"
import { MissionGallerySection } from "./sections/MissionGallerySection"
import { WhyAerotechSection } from "./sections/WhyAerotechSection"
import { ProofSection } from "./sections/ProofSection"
import { ComplianceSection } from "./sections/ComplianceSection"
import { CoverageSection } from "./sections/CoverageSection"
import { MethodologySection } from "./sections/MethodologySection"
import { FAQSection } from "./sections/FAQSection"
import { TestimonialsSection } from "./sections/TestimonialsSection"
import { ContactSection } from "./sections/ContactSection"

interface HomeTemplateProps {
    whatsappLink: string;
    instagramLink: string;
    phoneLink: string;
}

export default function HomeTemplate({ whatsappLink, instagramLink, phoneLink }: HomeTemplateProps) {

    return (
        <>
            <LiveNotifications />

            <HeroSection whatsappLink={whatsappLink} />
            <ServicesSection whatsappLink={whatsappLink} />
            <AboutSection />
            <MissionGallerySection />
            <WhyAerotechSection whatsappLink={whatsappLink} />
            <ProofSection whatsappLink={whatsappLink} />
            <ComplianceSection />
            <CoverageSection />
            <MethodologySection />
            <FAQSection />
            <TestimonialsSection whatsappLink={whatsappLink} />
            <ContactSection whatsappLink={whatsappLink} />

            <FloatingCTA whatsappLink={whatsappLink} />
        </>
    )
}
