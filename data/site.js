const serviceSafety = ["Helmets", "Gloves", "PPE kits", "Safety belts", "Safety jackets"];

const site = {
  brand: {
    name: "TR-Enterpriies",
    shortName: "TR",
    phone: "+91 9310508703",
    whatsapp: "919310508703",
    address: "B-15 Sharda Enclave, Shahbad Daulatpur, Delhi - 110042",
    email: "trenterpriies@gmail.com",
    location: "Delhi NCR",
    workingHours: "Mon-Sat available",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=B-15%20Sharda%20Enclave%2C%20Shahbad%20Daulatpur%2C%20Delhi%20110042"
  },
  hero: {
    eyebrow: "Solar. Industrial.",
    title: "TR-Enterpriies",
    text:
      "Reliable field teams for solar cleaning, industrial cleaning, inverter support, dismantling, and New Site Insulation Serve.",
    image: "/assets/images/hero-solar-maintenance.png",
    slides: [
      {
        title: "Solar panel service team",
        image: "/assets/images/hero-solar-maintenance.png"
      },
      {
        title: "Solar panel cleaning",
        image: "/assets/images/solar-panel-cleaning.png"
      },
      {
        title: "Industrial maintenance support",
        image: "/assets/images/insulation-plant-work.png"
      }
    ]
  },
  sections: {
    marquee: [
      "Solar panel cleaning",
      "Industrial cleaning",
      "Dismantling work",
      "Inverter installation and maintenance",
      "New Site Insulation Serve",
      "Safety training support",
      "Emergency medical support"
    ],
    about: {
      eyebrow: "About TR",
      title: "Developing safer service teams for solar, plant, and industrial sites.",
      statement: "Developing safer service teams for active sites.",
      text:
        "TR-Enterpriies supports solar, industrial, and plant teams with dependable workers, clear supervision, and disciplined handovers.",
      directorNote:
        "The team keeps the work personal and accountable, with emphasis on communication, safety, attendance, and clean completion before leaving the site.",
      highlights: [
        {
          title: "Asset support",
          text: "Solar, plant, power-room, and industrial site support handled by trained field workers."
        },
        {
          title: "In-house coordination",
          text: "Briefing, crew planning, supervision, attendance tracking, and close-out are handled through one enquiry flow."
        },
        {
          title: "Project execution",
          text: "Work is planned around safety checks, correct equipment, controlled movement, and practical handover."
        }
      ]
    },
    services: {
      eyebrow: "Product & Services",
      title: "Complete site support for active operations.",
      text: "TR provides six focused services for solar companies, industrial units, plant operators, and facility teams."
    },
    why: {
      eyebrow: "Why choose TR?",
      title: "We provide dependable solutions to suit your site needs.",
      text:
        "Clients get trained workers, emergency support, Mon-Sat availability, and modern execution methods for active sites."
    },
    projects: {
      eyebrow: "Reference Project",
      title: "Field proof from solar and industrial support.",
      text:
        "Project photos, worked-with companies, and short case-study snapshots help clients understand the kind of work TR handles."
    },
    leadership: {
      eyebrow: "Leadership",
      title: "Leaders behind TR-Enterpriies.",
      text:
        "The leadership team keeps work accountable, communication clear, and site delivery disciplined."
    },
    safety: {
      eyebrow: "Social Impact",
      title: "Safety training, medical readiness, and PPE-led site work.",
      text:
        "TR keeps safety visible through training, emergency response readiness, equipment discipline, and compliance-focused supervision.",
      training: ["PPE awareness", "Electrical safety", "Working at height", "Emergency response", "Machine handling"],
      equipment: serviceSafety,
      medical: "Emergency medical and doctor facility support can be coordinated on site as required.",
      commitment: "The overall commitment is simple: trained people, proper equipment, clear supervision, and safer site outcomes."
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Work, in frame.",
      text: "Solar, plant, and crew visuals from the service areas TR supports."
    },
    trusted: {
      eyebrow: "Our Valued Clients",
      title: "Companies TR has worked with.",
      text: "HFM Solar Power Private Limited, Enerture Technologies Pvt Ltd, hero solar energy private limited, Oriana Power Ltd, and Tata Power Solar Systems Limited are highlighted as companies TR has worked with."
    },
    cta: {
      eyebrow: "Need a site team?",
      title: "Share the requirement and get a free quote from TR.",
      text: "Tell us the service, location, and timeline. TR will review the requirement and respond quickly.",
      button: "Get a Free Quote",
      whatsappButton: "WhatsApp Us"
    },
    contact: {
      eyebrow: "Get in Touch",
      title: "Send the brief. We will respond fast.",
      formEyebrow: "Inquiry desk",
      formTitle: "Send your requirement",
      button: "Submit Enquiry"
    },
    footer: {
      tagline: "Solar, industrial, power, plant, and site support services.",
      copyright: "2026 TR-Enterpriies. All rights reserved."
    }
  },
  metrics: [
    { value: "25+", label: "skilled workers" },
    { value: "4", label: "engineers" },
    { value: "7", label: "service lines" },
    { value: "Mon-Sat", label: "available" }
  ],
  whyChoose: [
    {
      title: "Safety training",
      text: "Workers are briefed on PPE, electrical safety, height work, emergency response, and machine handling."
    },
    {
      title: "Emergency medical support",
      text: "Doctor-facility and emergency medical readiness can be arranged for sensitive site work."
    },
    {
      title: "25+ skilled workers",
      text: "A structured team of engineers, supervisors, monitoring support, and trained workers is available."
    },
    {
      title: "Mon-Sat availability",
      text: "TR supports urgent schedules and planned site cycles with practical, Mon-Sat response."
    }
  ],
  trustedBy: [
    "HFM Solar Power Private Limited",
    "Enerture Technologies Pvt Ltd",
    "hero solar energy private limited",
    "Oriana Power Ltd",
    "Tata Power Solar Systems Limited"
  ],
  leadership: [
    {
      name: "Tushar",
      role: "Director",
      experience: "Leadership and operations",
      image: "/assets/images/tushar.jpeg"
    },
    {
      name: "Arun Kumar",
      role: "Associate Director",
      experience: "8 years experience",
      image: ""
    }
  ],
  services: [
    {
      id: "solar-panel-cleaning-services",
      title: "Solar Panel Cleaning Services",
      category: "Solar",
      image: "/assets/images/solar-panel-cleaning.png",
      gallery: [
        { title: "Solar panel cleaning team", image: "/assets/images/cleaning1.jpeg" },
        { title: "Panel washing in progress", image: "/assets/images/cleaning2.jpeg" },
        { title: "Solar cleaning site work", image: "/assets/images/cleaning3.jpeg" }
      ],
      summary: "Scheduled solar-panel cleaning for cleaner panels, safer access, and better plant presentation.",
      bullets: ["Panel cleaning", "Visual checks", "Safe access"],
      detail: {
        what: "Cleaning and basic visual support for commercial and plant solar panels using trained field workers.",
        for: "Solar companies, commercial rooftops, solar farms, and plant teams that need reliable panel-care cycles.",
        process: ["Site briefing", "PPE and access check", "Panel cleaning", "Final visual check and handover"],
        safety: serviceSafety,
        benefits: ["Cleaner panels", "Safer working flow", "Better site presentation", "Planned maintenance rhythm"]
      }
    },
    {
      id: "industrial-cleaning-services",
      title: "Industrial Cleaning Services",
      category: "Industrial",
      image: "/assets/images/insulation-plant-work.png",
      gallery: [
        { title: "Industrial cleaning team", image: "/assets/images/industry1.jpeg" },
        { title: "Industrial cleaning site work", image: "/assets/images/industry2.jpeg" },
        { title: "Industrial cleaning close-out", image: "/assets/images/industry3.jpeg" }
      ],
      summary: "Industrial cleaning support for equipment zones, work floors, plant areas, and maintenance spaces.",
      bullets: ["Equipment zones", "Plant floors", "Maintenance support"],
      detail: {
        what: "Cleaning crews for industrial zones where safety discipline, timing, and controlled movement matter.",
        for: "Factories, industrial units, maintenance teams, power rooms, and active plant sites.",
        process: ["Requirement review", "Area isolation and briefing", "Cleaning execution", "Supervisor check"],
        safety: serviceSafety,
        benefits: ["Cleaner work zones", "Reduced site clutter", "Better maintenance access", "Professional site readiness"]
      }
    },
    {
      id: "dismantling-work",
      title: "Dismantling Work",
      category: "Site Support",
      image: "/assets/images/dismantling-site-work.png",
      gallery: [
        { title: "Dismantling site team", image: "/assets/images/dismantal1.jpeg" },
        { title: "Dismantling work in progress", image: "/assets/images/dismantal2.jpeg" },
        { title: "Dismantling close-out support", image: "/assets/images/dismantal3.jpeg" }
      ],
      summary: "Controlled dismantling support with planned crews, safe movement, and organized close-out.",
      bullets: ["Crew planning", "Safe movement", "Close-out"],
      detail: {
        what: "Support crews for dismantling tasks where controlled sequencing and safety supervision are required.",
        for: "Industrial sites, facility teams, solar sites, and contractors handling removal or relocation work.",
        process: ["Work briefing", "Safety zoning", "Dismantling support", "Material movement and clean-up"],
        safety: serviceSafety,
        benefits: ["Controlled execution", "Cleaner site handover", "Reduced disruption", "Better crew coordination"]
      }
    },
    {
      id: "inverter-installation-maintenance",
      title: "Inverter Installation and Maintenance",
      category: "Power",
      image: "/assets/images/inverter-installation.png",
      gallery: [
        { title: "Industrial inverter installation", image: "/assets/images/inverter-installation-industrial-1.png" },
        { title: "Industrial inverter maintenance check", image: "/assets/images/inverter-installation-industrial-2.png" },
        { title: "Completed industrial inverter setup", image: "/assets/images/inverter-installation-industrial-3.png" }
      ],
      summary: "Support for inverter installation, maintenance readiness, room upkeep, and power-room assistance.",
      bullets: ["Install support", "Maintenance readiness", "Room upkeep"],
      detail: {
        what: "Site support around inverter installation and maintenance, including area readiness and crew assistance.",
        for: "Solar power sites, commercial facilities, and technical teams needing field support around inverter rooms.",
        process: ["Site access check", "Safety and electrical briefing", "Installation or maintenance support", "Area reset"],
        safety: serviceSafety,
        benefits: ["Prepared work areas", "Better technician support", "Safer movement", "Cleaner inverter-room handover"]
      }
    },
    {
      id: "insulation-plant-work",
      title: "New Site Insulation Serve",
      category: "Plant",
      image: "/assets/images/new-insulation-plant-work.png",
      summary: "Focused plant-work support for insulation areas, inspections, zone care, and maintenance teams.",
      bullets: ["Plant assist", "Inspection support", "Zone care"],
      detail: {
        what: "Support crews and supervision for insulation-related plant work and maintenance-area assistance.",
        for: "Plant operators, industrial sites, insulation contractors, and maintenance teams.",
        process: ["Plant briefing", "PPE check", "Insulation-area support", "Inspection and clean handover"],
        safety: serviceSafety,
        benefits: ["Organized plant support", "Safer site movement", "Cleaner working zones", "Reliable maintenance assistance"]
      }
    },
    {
      id: "earthing-services",
      title: "Earthing Services",
      category: "Power",
      image: "/assets/images/earthing1.jpeg",
      gallery: [
        { title: "Earthing system installation", image: "/assets/images/earthing2.jpeg" },
        { title: "Earthing maintenance support", image: "/assets/images/earthing3.jpeg" },
        { title: "Earthing service site work", image: "/assets/images/earthing4.jpeg" }
      ],
      summary: "Professional earthing system installation and maintenance for electrical safety and stability.",
      bullets: ["System installation", "Testing and inspection", "Maintenance support"],
      detail: {
        what: "Installation, inspection, and maintenance of earthing systems to ensure safe dissipation of fault currents.",
        for: "Industrial plants, commercial buildings, solar setups, and facilities requiring robust electrical grounding.",
        process: ["Site evaluation", "Design and material planning", "Installation and bonding", "Testing and handover"],
        safety: serviceSafety,
        benefits: ["Enhanced electrical safety", "Equipment protection", "Compliance with standards", "Reduced downtime"]
      }
    },
    {
      id: "operations-and-maintenance",
      title: "Operations and Maintenance",
      category: "Site Support",
      image: "/assets/images/o&m1.png",
      gallery: [
        { title: "Operations and maintenance field support", image: "/assets/images/operations.png" },
        { title: "Operations and maintenance inspection", image: "/assets/images/o&m3.jpeg" },
        { title: "Operations and maintenance site team", image: "/assets/images/o&m4.png" }
      ],
      summary: "Comprehensive operations and maintenance (O&M) for industrial plants, solar farms, and facilities.",
      bullets: ["Routine maintenance", "Performance tracking", "Corrective action"],
      detail: {
        what: "End-to-end operational support and scheduled maintenance to keep equipment and facilities running smoothly.",
        for: "Solar power plants, manufacturing units, commercial complexes, and industrial sites.",
        process: ["Condition assessment", "Preventive scheduling", "Active monitoring and maintenance", "Performance reporting"],
        safety: serviceSafety,
        benefits: ["Maximized uptime", "Extended asset life", "Consistent performance", "Proactive issue resolution"]
      }
    }
  ],
  projects: [
    {
      title: "Solar cleaning program",
      type: "Solar / Delhi NCR",
      site: "Solar site",
      requirement: "Panel cleaning and safe access support",
      workDone: "Briefed workers, PPE checks, cleaning cycle, and visual handover",
      result: "Cleaner panels with sharper site presentation",
      image: "/assets/images/solar-panel-cleaning.png",
      impact: "Cleaner panels. Stronger site presentation."
    },
    {
      title: "Industrial maintenance support",
      type: "Industrial / Plant Area",
      site: "Industrial work floor",
      requirement: "Cleaning and maintenance-zone readiness",
      workDone: "Area support, equipment-zone cleaning, and supervised close-out",
      result: "Safer movement and cleaner active work zones",
      image: "/assets/images/insulation-plant-work.png",
      impact: "Sharper work zones with steady movement."
    }
  ],
  process: [
    {
      step: "01",
      title: "Briefing",
      text: "TR reviews the work, location, timing, team size, and safety requirements."
    },
    {
      step: "02",
      title: "Safety training",
      text: "Workers are briefed on PPE, electrical safety, height work, emergency response, and machine handling."
    },
    {
      step: "03",
      title: "Execution",
      text: "The assigned crew works under clear supervision with proper equipment and site discipline."
    },
    {
      step: "04",
      title: "Maintenance",
      text: "The site is checked, reset, and handed over with follow-up support where required."
    }
  ],
  testimonials: [
    {
      quote: "Punctual, disciplined, and easy to coordinate on active solar sites.",
      name: "HFM Solar Power Private Limited",
      role: "Solar site team"
    },
    {
      quote: "Reliable crew with clear supervision and steady communication.",
      name: "Enerture Technologies Pvt Ltd",
      role: "Maintenance partner"
    },
    {
      quote: "TR keeps the work organized and safety-focused from briefing to close-out.",
      name: "hero solar energy private limited",
      role: "Operations team"
    }
  ],
  gallery: [
    { title: "Solar engineers at work", image: "/assets/images/hero-solar-maintenance.png" },
    { title: "Solar panel cleaning", image: "/assets/images/solar-panel-cleaning.png" },
    { title: "Industrial maintenance", image: "/assets/images/insulation-plant-work.png" },
    { title: "Inverter installation and maintenance", image: "/assets/images/inverter-installation.png" },
    { title: "New Site Insulation Serve", image: "/assets/images/new-insulation-plant-work.png" }
  ]
};

module.exports = site;
