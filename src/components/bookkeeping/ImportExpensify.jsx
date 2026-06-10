import { useState } from 'react'
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'

// All 212 line items extracted from "2026 Γεννάρης - Μάρτης" Expensify report
// Amounts are in EUR (USD amounts already converted at Expensify's rates)
// VAT set to 0 — Expensify did not track per-line VAT; review individually if needed
const EXPENSES = [
  // ── EQUIPMENT MAINTENANCE (Εξοπλισμός) ──────────────────────────────────
  { date:'2025-12-17', vendor:'MJ Mediscience',           total:178.50,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-01-09', vendor:'MJ Mediscience',           total:357.00,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-01-21', vendor:'MJ Mediscience',           total:357.00,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-01-30', vendor:'MJ Mediscience',           total:416.50,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-02-12', vendor:'MJ Mediscience',           total:492.66,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-02-15', vendor:'Γ. Κολιανδρης',            total:170.00,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-02-16', vendor:'MJ Mediscience',           total:492.66,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-09', vendor:'MJ Mediscience',           total:480.76,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-10', vendor:'MJ Mediscience',           total:1776.91,  category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-19', vendor:'MJ Mediscience',           total:963.90,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-23', vendor:'MJ Mediscience',           total:963.90,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-26', vendor:'Κολιανδρής',               total:120.00,   category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-03-26', vendor:'MJ Mediscience',           total:1237.60,  category:'Εξοπλισμός', notes:'Equipment maintenance' },
  { date:'2026-04-05', vendor:'Leroy Merlin',             total:19.37,    category:'Εξοπλισμός', notes:'Αγορά με cash', paymentMethod:'Μετρητά' },

  // ── FREIGHT AND DELIVERY (Άλλο) ──────────────────────────────────────────
  { date:'2026-01-19', vendor:'ACS Courier',                       total:3.40,   category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-01-20', vendor:'Esso Chloraka',                     total:90.02,  category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-01-21', vendor:'ACS Courier',                       total:17.95,  category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-01-26', vendor:'Arenda',                            total:228.85, category:'Άλλο', notes:'Car leasing' },
  { date:'2026-01-28', vendor:'ACS Courier',                       total:6.60,   category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-02-02', vendor:'ACS Courier',                       total:17.95,  category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-02-12', vendor:'Teamfreight Transport CY',          total:208.25, category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-02-22', vendor:'Esso Chloraka',                     total:88.51,  category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-03-07', vendor:'ACS Air Courier Services (Cyprus)', total:29.00,  category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-03-16', vendor:'Ch. Zenon Coaches',                 total:599.50, category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-03-31', vendor:'Esso Makariou Avenue',              total:100.00, category:'Άλλο', notes:'Freight & delivery' },
  { date:'2026-03-31', vendor:'TeamFreight Μεταφορική',            total:71.40,  category:'Άλλο', notes:'Freight & delivery' },

  // ── LEGAL AND PROFESSIONAL FEES (Άλλο) ───────────────────────────────────
  { date:'2026-01-27', vendor:'Kostas M. Konstantinou & Co LLC', total:519.75, category:'Άλλο', notes:'Legal & professional fees' },
  { date:'2026-03-31', vendor:'Yiannoukas Medical Laboratories', total:50.00,  category:'Άλλο', notes:'Lab service' },

  // ── MARKETING ────────────────────────────────────────────────────────────
  { date:'2026-01-31', vendor:'Google Ireland',    total:2107.34,  category:'Marketing', notes:'Google Ads (converted from $2,497.99)' },
  { date:'2026-02-28', vendor:'Google',            total:1941.83,  category:'Marketing', notes:'Google Ads (converted from $2,294.89)' },
  { date:'2026-03-02', vendor:'Bee Possible',      total:7318.50,  category:'Marketing', notes:'Strategy agency' },
  { date:'2026-03-31', vendor:'Meta',              total:401.00,   category:'Marketing', notes:'Meta Ads' },
  { date:'2026-04-01', vendor:'Meta',              total:52193.41, category:'Marketing', notes:'Meta Ads' },

  // ── MEALS AND ENTERTAINMENT (Άλλο) ───────────────────────────────────────
  { date:'2026-01-02', vendor:'Melitzia Tavern',          total:2580.00, category:'Άλλο', notes:'Κοπή βασιλόπιττας παγκύπριο event' },
  { date:'2026-02-01', vendor:'Zorbas',                   total:154.80,  category:'Άλλο', notes:'Βασιλόπιττα παρτυ Dermlux' },
  { date:'2026-02-20', vendor:'Smoclock Enterprises',     total:55.00,   category:'Άλλο', notes:'Meals & entertainment' },
  { date:'2026-02-24', vendor:'Smo Clock',                total:53.50,   category:'Άλλο', notes:'Meals & entertainment' },
  { date:'2026-03-11', vendor:'Kinky Coffee Bar',         total:70.00,   category:'Άλλο', notes:'Meals & entertainment' },
  { date:'2026-03-15', vendor:'Arabica Peyia',            total:68.67,   category:'Άλλο', notes:'Meals & entertainment', location:'Πάφος' },
  { date:'2026-03-15', vendor:'Arxontiko Tis Stauroulas', total:780.00,  category:'Άλλο', notes:'Meals & entertainment' },

  // ── OFFICE EXPENSES (Άλλο) ────────────────────────────────────────────────
  { date:'2026-01-19', vendor:'E. G. Anemos Hygiene Services', total:202.30, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-01-19', vendor:'S & A Papoutsou',               total:261.80, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-01-20', vendor:'E. G. Anemos Hygiene Services', total:165.41, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-01-29', vendor:'S & A Papoutsou',               total:580.72, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-02', vendor:'E. G. Anemos Hygiene Services', total:202.30, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-06', vendor:'E. G. Anemos Hygiene Services', total:243.85, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-12', vendor:'E. G. Anemos Hygiene Services', total:713.93, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-13', vendor:'E. G. Anemos Hygiene Services', total:737.77, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-14', vendor:'E. G. Anemos Hygiene Services', total:439.65, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-14', vendor:'E. G. Anemos Hygiene Services', total:728.72, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-02-17', vendor:'PRC Public Retail Cyprus',       total:42.99,  category:'Άλλο', notes:'Paphos call center', location:'Πάφος' },
  { date:'2026-02-24', vendor:'S & A Papoutsou',               total:396.27, category:'Άλλο', notes:'Office expenses' },
  { date:'2026-03-06', vendor:'Runstop Business Solutions',     total:59.00,  category:'Άλλο', notes:'Office expenses' },
  { date:'2026-03-14', vendor:'Anna Maria Christofi',           total:150.00, category:'Άλλο', notes:'Event equipment' },
  { date:'2026-03-14', vendor:'Sklavenitis',                    total:86.63,  category:'Άλλο', notes:'Dermlux conference' },
  { date:'2026-03-24', vendor:'E. G. Anemos Hygiene Services', total:106.79, category:'Άλλο', notes:'Office expenses' },

  // ── PROPERTY EXPENSES (Συντήρηση) ─────────────────────────────────────────
  { date:'2026-02-20', vendor:'Julian Handyman Services', total:350.00, category:'Συντήρηση', notes:'Property expenses' },

  // ── RENT / LEASE (Ενοίκιο) ───────────────────────────────────────────────
  { date:'2026-01-17', vendor:'Ιωάννου Νίκος', total:12400.00, category:'Ενοίκιο', notes:'Ενοίκιο Πάφος Φεβράρης 2026–Ιανουάριος 2027', location:'Πάφος' },

  // ── REPAIRS AND MAINTENANCE (Συντήρηση) ──────────────────────────────────
  { date:'2026-01-07', vendor:'A.M.C. Christoforou Accounting Services', total:1190.00, category:'Συντήρηση', notes:'Repairs & maintenance' },
  { date:'2026-01-22', vendor:'Nicos Tzirtzipis',                        total:310.00,  category:'Συντήρηση', notes:'Repairs & maintenance' },
  { date:'2026-01-26', vendor:'AMC Christoforou',                        total:2725.10, category:'Συντήρηση', notes:'Repairs & maintenance' },
  { date:'2026-02-02', vendor:'Themis Garage',                           total:920.00,  category:'Συντήρηση', notes:'Repairs & maintenance' },
  { date:'2026-03-30', vendor:'Κυριάκος Ιωάννου',                        total:624.75,  category:'Συντήρηση', notes:'Repairs & maintenance' },
  { date:'2026-03-31', vendor:'Kostas M. Konstantinou & Co',             total:95.70,   category:'Συντήρηση', notes:'Repairs & maintenance' },

  // ── STATIONERY AND PRINTING (Άλλο) ───────────────────────────────────────
  { date:'2025-12-04', vendor:'Pambos D. Tsokkos',           total:59.50,  category:'Άλλο', notes:'Πληρώθηκε Φεβράρη – stationery' },
  { date:'2026-01-05', vendor:'iStorm Cyprus Limited',        total:711.18, category:'Άλλο', notes:'Bought with CASH – stationery', paymentMethod:'Μετρητά' },
  { date:'2026-01-08', vendor:'Stephanis',                    total:76.40,  category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-01-16', vendor:'A&S Compumize IT Solutions',   total:214.20, category:'Άλλο', notes:'Laptop for call center' },
  { date:'2026-01-21', vendor:'A&S Compumize IT Solutions',   total:214.20, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-01-28', vendor:'Ctrl',                         total:19.00,  category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-02-10', vendor:'Pambos D. Tsokkos',           total:315.35, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-02-17', vendor:'A & S Compumize IT Solutions', total:215.00, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-02-19', vendor:'Compumize',                    total:215.00, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-03-02', vendor:'Pambos D. Tsokkos',           total:101.15, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-03-12', vendor:'Pambos D. Tsokkos',           total:113.05, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-03-31', vendor:'A & S Compumize IT Solutions', total:600.00, category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-03-31', vendor:'Pambos D. Tsokkos',           total:49.39,  category:'Άλλο', notes:'Stationery & printing' },
  { date:'2026-03-31', vendor:'Pambos D. Tsokkos',           total:154.70, category:'Άλλο', notes:'Stationery & printing' },

  // ── SUBSCRIPTIONS (Άλλο) ─────────────────────────────────────────────────
  { date:'2026-01-05', vendor:'Monday.com',          total:165.00, category:'Άλλο', notes:'Monday CRM subscription' },
  { date:'2026-01-05', vendor:'Pipedrive',            total:49.00,  category:'Άλλο', notes:'CRM tool subscription' },
  { date:'2026-01-08', vendor:'Semantronics (Voiso)', total:88.25,  category:'Άλλο', notes:'Voiso telecommunications' },
  { date:'2026-02-01', vendor:'Voiso PTE LTD',        total:358.08, category:'Άλλο', notes:'Telecommunications (converted from $424.46)' },
  { date:'2026-02-05', vendor:'Monday.com',          total:165.00, category:'Άλλο', notes:'Monday CRM subscription' },
  { date:'2026-02-05', vendor:'Pipedrive',            total:49.00,  category:'Άλλο', notes:'CRM tool subscription' },
  { date:'2026-02-13', vendor:'Wix.com',              total:283.08, category:'Άλλο', notes:'Wix subscription (converted from $336.00)' },
  { date:'2026-02-19', vendor:'Base44 by Wix.com',   total:520.71, category:'Άλλο', notes:'Base44 subscription (converted from $613.90)' },
  { date:'2026-02-25', vendor:'Base44 by Wix.com',   total:788.91, category:'Άλλο', notes:'Base44 subscription (converted from $928.86)' },
  { date:'2026-03-01', vendor:'Voiso',                total:409.41, category:'Άλλο', notes:'Voiso telecommunications (converted from $483.84)' },
  { date:'2026-03-01', vendor:'Zapier',               total:922.54, category:'Άλλο', notes:'Zapier subscription' },
  { date:'2026-03-05', vendor:'Monday.com',          total:165.00, category:'Άλλο', notes:'Monday CRM subscription' },
  { date:'2026-03-05', vendor:'Pipedrive',            total:49.00,  category:'Άλλο', notes:'CRM tool subscription' },
  { date:'2026-03-06', vendor:'IONOS',                total:2.00,   category:'Άλλο', notes:'IONOS subscription' },
  { date:'2026-03-27', vendor:'Resend',               total:17.34,  category:'Άλλο', notes:'Resend email (converted from $20.00)' },
  { date:'2026-03-28', vendor:'Anthropic',            total:18.00,  category:'Άλλο', notes:'Anthropic AI subscription' },
  { date:'2026-03-31', vendor:'Google (Workspace)',   total:3053.24,category:'Άλλο', notes:'Google subscription (converted from $3,498.00)' },
  { date:'2026-04-01', vendor:'Voiso',                total:440.28, category:'Άλλο', notes:'Voiso telecommunications (converted from $509.57)' },

  // ── TAXES (Φόροι) ─────────────────────────────────────────────────────────
  { date:'2026-01-10', vendor:'Δήμος Πολεμιδιών',                  total:160.00, category:'Φόροι', notes:'Σκύβαλλα Λεμεσός 2025', location:'Λεμεσός' },
  { date:'2026-01-14', vendor:'Tax Department',                     total:429.63, category:'Φόροι', notes:'ΓΕΣΥ ΑΜΥΝΑ ΕΝΟΙΚΙΩΝ 2ο εξάμηνο 2025' },
  { date:'2026-01-14', vendor:'Tax Department',                     total:505.99, category:'Φόροι', notes:'ΓΕΣΥ ΑΜΥΝΑ ΕΝΟΙΚΙΩΝ 2ο εξάμηνο 2025' },
  { date:'2026-01-15', vendor:'Δήμος Λευκωσίας',                   total:818.00, category:'Φόροι', notes:'Σκύβαλλα Λευκωσία', location:'Λευκωσία' },
  { date:'2026-02-11', vendor:'Υπηρεσίες Κοινωνικών Ασφαλίσεων', total:333.48, category:'Φόροι', notes:'Κοινωνικές ασφαλίσεις Πάφος', location:'Πάφος' },
  { date:'2026-03-06', vendor:'Tax Department',                     total:900.00, category:'Φόροι', notes:'Κρίστια 2025' },

  // ── TREATMENT SUPPLIES (Προμήθειες) ──────────────────────────────────────
  { date:'2025-07-02', vendor:'Stavros Kokkinos',          total:844.33,  category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2025-09-29', vendor:'Stavros Kokkinos',          total:844.33,  category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2025-11-06', vendor:'Stavros Kokkinos',          total:844.33,  category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2025-11-14', vendor:'Stavros Kokkinos',          total:844.33,  category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2025-12-12', vendor:'Stavros Kokkinos',          total:844.33,  category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2025-12-15', vendor:'OG Healthpro',              total:209.98,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-02', vendor:'Stavros Kokkinos',          total:1629.06, category:'Προμήθειες', notes:'Vistabel botox' },
  { date:'2026-01-05', vendor:'ARTMEDCY LIMITED',          total:160.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-05', vendor:'E-Fillers',                 total:474.02,  category:'Προμήθειες', notes:'από Ελλάδα' },
  { date:'2026-01-05', vendor:'OG Healthpro',              total:10.50,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-05', vendor:'Procopiou Medishop',        total:101.15,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-09', vendor:'K&N Medical',               total:645.75,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-12', vendor:'Procopiou Medishop',        total:119.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-12', vendor:'Procopiou Medishop',        total:220.15,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-13', vendor:'ACD Wellness',              total:898.67,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-13', vendor:'Impophar Trading House',    total:445.55,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-13', vendor:'Procopiou Medishop',        total:684.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-13', vendor:'Procopiou Medishop',        total:684.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-13', vendor:'Procopiou Medishop',        total:1011.50, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-14', vendor:'Impophar Trading House',    total:399.84,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-14', vendor:'Procopiou Medishop',        total:684.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-15', vendor:'Impophar',                  total:162.01,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-15', vendor:'Procopiou Medishop',        total:684.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-16', vendor:'K&N Medical',               total:511.70,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-19', vendor:'Impophar Trading House',    total:257.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-19', vendor:'K&N Medical',               total:677.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-21', vendor:'Poucan',                    total:575.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-23', vendor:'IAS Beauty Suppliers',      total:178.21,  category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-01-23', vendor:'IAS Beauty Suppliers',      total:351.07,  category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-01-23', vendor:'IAS Beauty Suppliers',      total:351.07,  category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-01-23', vendor:'Procopiou Medishop',        total:17.85,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-29', vendor:'Impophar Trading House',    total:43.44,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-30', vendor:'Procopiou Medishop',        total:98.52,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-30', vendor:'Procopiou Medishop',        total:98.52,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-30', vendor:'Procopiou Medishop',        total:98.52,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-30', vendor:'Procopiou Medishop',        total:98.52,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-01-31', vendor:'Yiannoukas Medical Laboratories', total:60.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-03', vendor:'Dermlux Laser & Aesthetics',total:27.01,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-03', vendor:'Impophar',                  total:232.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-03', vendor:'Impophar Trading House',    total:365.53,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-03', vendor:'Procopiou Medishop',        total:7.85,    category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-06', vendor:'Παγκύπριος Ιατρικός Σύλλογος', total:250.00, category:'Προμήθειες', notes:'Άδεια λειτουργίας κέντρων' },
  { date:'2026-02-07', vendor:'Armad',                     total:480.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-09', vendor:'Impophar',                  total:232.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-09', vendor:'K&N Medical',               total:999.60,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-13', vendor:'Dermlux Laser and Aesthetics', total:150.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-13', vendor:'K&N Medical',               total:677.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-16', vendor:'HealthPro',                 total:228.87,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-16', vendor:'Procopiou Medishop',        total:113.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-16', vendor:'Procopiou Medishop',        total:113.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-17', vendor:'G J K Healthpharma Services', total:228.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-17', vendor:'IAS Beauty Suppliers',      total:16.90,   category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-02-19', vendor:'Procopiou Medishop',        total:23.80,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-20', vendor:'Impophar',                  total:214.31,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-20', vendor:'Impophar Trading House',    total:257.04,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-20', vendor:'Procopiou Medishop',        total:23.80,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-24', vendor:'K&N Medical',               total:677.25,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-24', vendor:'Procopiou Medishop',        total:23.80,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-24', vendor:'Procopiou Medishop',        total:404.60,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-25', vendor:'Armad',                     total:480.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-25', vendor:'Impophar',                  total:257.04,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-26', vendor:'D.S Analysis Lab & Laser',  total:190.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-26', vendor:'G J K Healthpharma Services', total:35.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-27', vendor:'BESE Beauty Salon Equipment', total:248.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-27', vendor:'Procopiou Medishop',        total:113.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-02-28', vendor:'Yiannoukas Medical Laboratories', total:40.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-04', vendor:'HealthPro',                 total:141.81,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-04', vendor:'IAS Beauty Suppliers',      total:268.84,  category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-03-04', vendor:'IAS Beauty Suppliers',      total:1393.49, category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-03-11', vendor:'Armad',                     total:480.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-11', vendor:'Armad',                     total:480.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-11', vendor:'E Fillers',                 total:1588.37, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-11', vendor:'Karpasia Pharmacy',         total:945.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-13', vendor:'HealthPro',                 total:28.60,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-17', vendor:'Zhengzhou Yuerxun Biotechnology', total:116.54, category:'Προμήθειες', notes:'Treatment supplies (converted from $134.00)' },
  { date:'2026-03-19', vendor:'Poucan',                    total:580.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-20', vendor:'G J K Healthpharma Services', total:35.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-23', vendor:'Dermis',                    total:79.24,   category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-23', vendor:'Dermlux Laser & Aesthetics', total:15.05, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-23', vendor:'Impophar Trading House',    total:257.04,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-23', vendor:'Impophar Trading House',    total:485.52,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-26', vendor:'ACD Wellness',              total:451.20,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-26', vendor:'IAS Beauty Suppliers',      total:1879.99, category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-03-28', vendor:'E Fillers',                 total:1382.59, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-30', vendor:'ACD Wellness',              total:587.00,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-30', vendor:'Dermlux Laser & Aesthetics', total:500.00, category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-30', vendor:'IAS Beauty Suppliers Ltd',  total:430.16,  category:'Προμήθειες', notes:'Προιόντα' },
  { date:'2026-03-30', vendor:'Procopiou Medishop',        total:113.05,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-30', vendor:'Procopiou Medishop',        total:121.38,  category:'Προμήθειες', notes:'Treatment supplies' },
  { date:'2026-03-31', vendor:'Procopiou Medishop',        total:121.38,  category:'Προμήθειες', notes:'Treatment supplies' },

  // ── UTILITIES (Λογαριασμοί) ───────────────────────────────────────────────
  { date:'2025-10-06', vendor:'Electricity Authority of Cyprus', total:240.27, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2025-11-17', vendor:'Electricity Authority of Cyprus', total:205.82, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2025-12-02', vendor:'Electricity Authority of Cyprus', total:380.85, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-01-05', vendor:'Primetel',                        total:275.20, category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-01-09', vendor:'Primetel',                        total:23.80,  category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-01-15', vendor:'Primetel',                        total:67.95,  category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-01-17', vendor:'EOAL',                            total:22.21,  category:'Λογαριασμοί', notes:'Utilities' },
  { date:'2026-01-21', vendor:'Electricity Authority of Cyprus', total:292.00, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-01-21', vendor:'EOA Limassol',                    total:24.69,  category:'Λογαριασμοί', notes:'Νερό Λεμεσός', location:'Λεμεσός' },
  { date:'2026-01-21', vendor:'EOAL',                            total:65.90,  category:'Λογαριασμοί', notes:'Utilities' },
  { date:'2026-02-04', vendor:'Primetel',                        total:299.27, category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-02-05', vendor:'Electricity Authority of Cyprus', total:294.61, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-02-11', vendor:'Hyperlife Technologies LTD',      total:752.04, category:'Λογαριασμοί', notes:'Ρεύμα Λευκωσία', location:'Λευκωσία' },
  { date:'2026-02-25', vendor:'Electricity Authority of Cyprus', total:605.73, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-02-28', vendor:'Primetel',                        total:5.95,   category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-03-04', vendor:'Primetel',                        total:335.45, category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-03-17', vendor:'Electricity Authority of Cyprus', total:178.36, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-03-17', vendor:'Electricity Authority of Cyprus', total:276.50, category:'Λογαριασμοί', notes:'Electricity' },
  { date:'2026-03-31', vendor:'Primetel',                        total:5.95,   category:'Λογαριασμοί', notes:'Telecommunication-internet' },
  { date:'2026-04-03', vendor:'Primetel',                        total:329.39, category:'Λογαριασμοί', notes:'Telecommunication-internet' },
]

const DEFAULTS = {
  vatNumber: '', invoiceNumber: '', net: 0, vat: 0, vatRate: 0,
  currency: 'EUR', location: 'Γενικά', paymentMethod: 'Κάρτα',
  fileUrl: '', fileName: '', status: 'confirmed', source: 'expensify_import',
}

export default function ImportExpensify() {
  const { userProfile } = useAuth()
  const [state, setState] = useState('idle') // idle | running | done | error
  const [imported, setImported] = useState(0)
  const [errMsg, setErrMsg] = useState('')

  const total = EXPENSES.length

  async function runImport() {
    setState('running')
    setImported(0)
    try {
      const chunkSize = 200
      for (let i = 0; i < EXPENSES.length; i += chunkSize) {
        const chunk = EXPENSES.slice(i, i + chunkSize)
        const batch = writeBatch(db)
        chunk.forEach(exp => {
          const ref = doc(collection(db, 'expenses'))
          batch.set(ref, {
            ...DEFAULTS,
            ...exp,
            net: exp.total, // total = net since no per-line VAT in Expensify
            createdAt: serverTimestamp(),
            createdBy: userProfile?.email || 'import',
          })
        })
        await batch.commit()
        setImported(i + chunk.length)
      }
      setState('done')
    } catch (err) {
      console.error(err)
      setErrMsg(err.message)
      setState('error')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg text-center">
      <div className="text-4xl mb-4">📥</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Εισαγωγή Expensify</h1>
      <p className="text-gray-500 mb-1">2026 Γεννάρης – Μάρτης</p>
      <p className="text-gray-400 text-sm mb-8">
        {total} εγγραφές έτοιμες • €156,399.32 σύνολο
      </p>

      {state === 'idle' && (
        <button
          onClick={runImport}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Εισαγωγή {total} εγγραφών →
        </button>
      )}

      {state === 'running' && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${(imported / total) * 100}%` }}
            />
          </div>
          <p className="text-gray-600">{imported} / {total} εγγραφές...</p>
        </div>
      )}

      {state === 'done' && (
        <div className="text-green-600">
          <div className="text-5xl mb-3">✓</div>
          <p className="font-semibold text-lg">Εισήχθησαν {imported} εγγραφές!</p>
          <p className="text-sm text-gray-400 mt-2">
            Μπορείς τώρα να τις δεις στα <a href="#/bookkeeping" className="text-blue-500 underline">Λογιστικά</a>.
          </p>
        </div>
      )}

      {state === 'error' && (
        <div className="text-red-600">
          <p className="font-semibold">Σφάλμα κατά την εισαγωγή</p>
          <p className="text-xs text-gray-400 mt-1">{errMsg}</p>
        </div>
      )}

      <p className="text-xs text-gray-300 mt-8">
        Τα ποσά εισάγονται ως σύνολα (χωρίς ΦΠΑ ανά γραμμή — αναθεώρησε αν χρειαστεί).
      </p>
    </div>
  )
}
