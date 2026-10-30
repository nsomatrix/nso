"use client";

import React, { useState } from "react";

interface NinjaClass {
  id: string;
  name: string;
  vietnameseName: string;
  weapon: string;
  school: string;
  element: "Fire" | "Ice" | "Wind";
  elementColor: string;
  elementBg: string;
  role: string;
  description: string;
  pros: string[];
  attributes: {
    damage: number;
    defense: number;
    agility: number;
    range: number;
    difficulty: number;
  };
}

const NINJA_CLASSES: NinjaClass[] = [
  {
    id: "kiem",
    name: "Blade (Katana)",
    vietnameseName: "Kiếm",
    weapon: "Katana / Kiếm",
    school: "Trường Hirosaki",
    element: "Fire",
    elementColor: "#f97316",
    elementBg: "rgba(249, 115, 22, 0.15)",
    role: "Melee Burst & Stalwart Tank",
    description:
      "Masters of close-quarters swordplay imbued with fierce flame chakra. High armor and crushing critical strikes make Kiếm formidable in both 1v1 duels and boss raids.",
    pros: ["High physical & flame burst", "Exceptional defense & HP pool", "Devastating close-range lock-down"],
    attributes: { damage: 95, defense: 90, agility: 65, range: 40, difficulty: 60 },
  },
  {
    id: "tieu",
    name: "Dart (Shuriken)",
    vietnameseName: "Tiêu",
    weapon: "Shuriken / Phi Tiêu",
    school: "Trường Hirosaki",
    element: "Fire",
    elementColor: "#ef4444",
    elementBg: "rgba(239, 68, 68, 0.15)",
    role: "Ranged Critical Assassin",
    description:
      "Lethal marksmen who throw flame-charged shurikens from safe distances. Known for the highest single-target critical rate and elusive kiting movement.",
    pros: ["Highest critical hit rate", "Continuous ranged pressure", "Fast leveling & boss farming"],
    attributes: { damage: 92, defense: 50, agility: 90, range: 90, difficulty: 80 },
  },
  {
    id: "kunai",
    name: "Kunai",
    vietnameseName: "Kunai",
    weapon: "Kunai Daggers",
    school: "Trường Ookata",
    element: "Ice",
    elementColor: "#38bdf8",
    elementBg: "rgba(56, 189, 248, 0.15)",
    role: "Agile Ice Control & Multistrike",
    description:
      "Rapid assassins wielding ice-infused daggers. Kunai ninjas slow down and freeze their opponents while unleashing swift combos that pierce defenses.",
    pros: ["Freeze & slow crowd-control", "Rapid-fire skill rotations", "Unpredictable mobility"],
    attributes: { damage: 85, defense: 60, agility: 95, range: 60, difficulty: 75 },
  },
  {
    id: "cung",
    name: "Bow",
    vietnameseName: "Cung",
    weapon: "Longbow / Cung Tên",
    school: "Trường Ookata",
    element: "Ice",
    elementColor: "#0ea5e9",
    elementBg: "rgba(14, 165, 233, 0.15)",
    role: "Long-Range Sniper & Freeze",
    description:
      "Master archers commanding frosty blizzards. With the longest attack range in the game, Bow users snipe targets from afar while locking them in ice.",
    pros: ["Longest attack range in NSO", "Reliable freezing arrows", "Excellent for territory control"],
    attributes: { damage: 88, defense: 45, agility: 80, range: 100, difficulty: 70 },
  },
  {
    id: "dao",
    name: "Broadsword",
    vietnameseName: "Đao",
    weapon: "Broadsword / Đại Đao",
    school: "Trường Haruna",
    element: "Wind",
    elementColor: "#10b981",
    elementBg: "rgba(16, 185, 129, 0.15)",
    role: "AoE Whirlwind & Disruption",
    description:
      "Heavy frontline brawlers wielding mighty broadswords. They summon raging whirlwinds that pull and stun surrounding enemy mobs and rivals.",
    pros: ["Tremendous AoE clearing speed", "High resistance and crowd disruption", "Supreme mob-farming potential"],
    attributes: { damage: 88, defense: 85, agility: 70, range: 50, difficulty: 65 },
  },
  {
    id: "quat",
    name: "War Fan",
    vietnameseName: "Quạt",
    weapon: "War Fan / Quạt Ba Tiêu",
    school: "Trường Haruna",
    element: "Wind",
    elementColor: "#06b6d4",
    elementBg: "rgba(6, 182, 212, 0.15)",
    role: "Support, Healing & Whirlwind",
    description:
      "Mystical wind weavers capable of restoring ally health, reviving fallen ninjas, and buffing team attributes while conjuring razor gusts of wind.",
    pros: ["Essential party healer & buffer", "Resurrection & team survivability", "Steady wind damage"],
    attributes: { damage: 75, defense: 65, agility: 85, range: 80, difficulty: 85 },
  },
];

export function HomeClassShowcase() {
  const [selectedClass, setSelectedClass] = useState<NinjaClass>(NINJA_CLASSES[0]);

  return (
    <section className="class-showcase-section">
      <div className="section-header-center">
        <span className="section-eyebrow">Shinobi Codex</span>
        <h2 className="section-heading">The 6 Ninja Academies</h2>
        <p className="section-lead">
          Explore the distinct elements, weapon masteries, and combat specialties of Ninja School Online.
        </p>
      </div>

      {/* Class Selector Tabs */}
      <div className="class-tabs-container">
        <div className="class-tabs-list">
          {NINJA_CLASSES.map((cls) => {
            const isActive = selectedClass.id === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                className={`class-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setSelectedClass(cls)}
                style={{
                  borderColor: isActive ? cls.elementColor : undefined,
                  boxShadow: isActive ? `0 0 16px ${cls.elementBg}` : undefined,
                }}
              >
                <span
                  className="class-element-dot"
                  style={{ backgroundColor: cls.elementColor }}
                />
                <span className="class-tab-name">{cls.vietnameseName}</span>
                <span className="class-tab-sub">({cls.element})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Class Panel */}
      <div className="class-detail-card">
        <div className="class-detail-header">
          <div>
            <div className="class-meta-row">
              <span
                className="class-element-badge"
                style={{
                  color: selectedClass.elementColor,
                  backgroundColor: selectedClass.elementBg,
                  borderColor: selectedClass.elementColor,
                }}
              >
                {selectedClass.element === "Fire" ? "Hỏa (Fire)" : selectedClass.element === "Ice" ? "Băng (Ice)" : "Phong (Wind)"}
              </span>
              <span className="class-school-badge">{selectedClass.school}</span>
            </div>
            <h3 className="class-display-name">
              {selectedClass.vietnameseName} • {selectedClass.name}
            </h3>
            <p className="class-role-text">{selectedClass.role}</p>
          </div>

          <div className="class-weapon-tag">
            <span className="weapon-tag-label">Primary Weapon</span>
            <span className="weapon-tag-name">{selectedClass.weapon}</span>
          </div>
        </div>

        <p className="class-desc-para">{selectedClass.description}</p>

        {/* Breakdown Grid */}
        <div className="class-specs-grid">
          {/* Key Advantages */}
          <div className="class-advantages-box">
            <h4 className="specs-box-title">Combat Specializations</h4>
            <ul className="class-pros-list">
              {selectedClass.pros.map((pro, idx) => (
                <li key={idx} className="class-pro-item">
                  <span
                    className="pro-check-dot"
                    style={{ backgroundColor: selectedClass.elementColor }}
                  />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribute Sliders */}
          <div className="class-attributes-box">
            <h4 className="specs-box-title">Combat Ratings</h4>
            <div className="attr-bars-list">
              {[
                { label: "Attack Power", val: selectedClass.attributes.damage },
                { label: "Survivability", val: selectedClass.attributes.defense },
                { label: "Agility & Speed", val: selectedClass.attributes.agility },
                { label: "Effective Range", val: selectedClass.attributes.range },
                { label: "Skill Curve", val: selectedClass.attributes.difficulty },
              ].map((attr) => (
                <div key={attr.label} className="attr-bar-row">
                  <div className="attr-bar-meta">
                    <span className="attr-name">{attr.label}</span>
                    <span className="attr-val">{attr.val}%</span>
                  </div>
                  <div className="attr-track">
                    <div
                      className="attr-fill"
                      style={{
                        width: `${attr.val}%`,
                        backgroundColor: selectedClass.elementColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
