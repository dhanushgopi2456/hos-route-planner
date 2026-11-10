---
version: alpha
name: United Carriers
description: A stark, high-contrast logistics system with precise typography, minimal chrome, and a single electric-blue accent.
colors:
  primary: "#0016CB"
  secondary: "#FFFFFF"
  tertiary: "#374151"
  neutral: "#000000"
  surface: "#0A0A0A"
  on-surface: "#FFFFFF"
  error: "#FF4D4D"
  primary-60: "#3346D7"
  primary-70: "#6677E3"
  primary-80: "#99A9EE"
  neutral-90: "#161616"
  neutral-80: "#242424"
  neutral-70: "#2E2E2E"
  neutral-60: "#3A3A3A"
typography:
  headline-display:
    fontFamily: "BT Steinhart"
    fontSize: "107px"
    fontWeight: 700
    lineHeight: "112px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "BT Steinhart"
    fontSize: "78px"
    fontWeight: 700
    lineHeight: "84px"
    letterSpacing: "0px"
  headline-md:
    fontFamily: "BT Steinhart"
    fontSize: "58px"
    fontWeight: 700
    lineHeight: "70px"
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "Helvetica Neue"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: "50px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "Helvetica Neue"
    fontSize: "31px"
    fontWeight: 500
    lineHeight: "47px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "Helvetica Neue"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "30px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Helvetica Neue"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "BT Steinhart Mono"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0.04em"
  label-md:
    fontFamily: "BT Steinhart Mono"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "0.04em"
  label-sm:
    fontFamily: "BT Steinhart Mono"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "32px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "26px"
  lg: "44px"
  xl: "112px"
  base: "16px"
  gutter: "44px"
  margin: "112px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "19px 31px"
    size: "138px"
    height: "53px"
  button-primary-hover:
    backgroundColor: "{colors.neutral-90}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "19px 31px"
    size: "138px"
    height: "53px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "19px 31px"
    size: "138px"
    height: "53px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
---

# United Carriers - Stark Logistics System

## Overview

United Carriers feels austere, technical, and globally oriented, with a strong emphasis on precision and operational confidence. The experience is intentionally sparse: large negative space, a black field, restrained gray UI, and a single electric-blue accent that reads like a live signal on a logistics dashboard. The tone is professional and engineered rather than playful, with typography and spacing doing most of the expressive work.
