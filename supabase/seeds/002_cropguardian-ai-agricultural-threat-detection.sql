-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

insert into public.posts (
  slug, title, subtitle, description, body,
  published_at, published, featured, category, tags
) values (
  'cropguardian-ai-agricultural-threat-detection',
  'CropGuardian — AI Agricultural Threat Detection',
  'Project Whitepaper — Plain-Language Edition',
  'CropGuardian is a mobile-first agricultural assistant with live COCO-SSD threat scanning, a searchable pest wiki, smart alert history, and on-device privacy — built with Next.js 15 and TensorFlow.js.',
  $post_body$| | |
|---|---|
| **Project** | CropGuardian |
| **Tagline** | AI-Powered Agricultural Assistant |
| **Built with** | Next.js 15 + TensorFlow.js |
| **Privacy** | All AI runs in your browser — data stays on your phone |
| **Audience** | Farmers, teammates, reviewers, and anyone new to technology |

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [The problem in everyday terms](#2-the-problem-in-everyday-terms)
3. [What CropGuardian does](#3-what-cropguardian-does)
4. [Feature 1 — Real-time AI scanner](#4-feature-1--real-time-ai-scanner)
5. [Feature 2 — Mobile-first field experience](#5-feature-2--mobile-first-field-experience)
6. [Feature 3 — Pest wiki](#6-feature-3--pest-wiki)
7. [Feature 4 — Smart alert history](#7-feature-4--smart-alert-history)
8. [How the AI works (plain English)](#8-how-the-ai-works-plain-english)
9. [Why your data stays on the phone](#9-why-your-data-stays-on-the-phone)
10. [How the app is built](#10-how-the-app-is-built)
11. [Getting started](#11-getting-started)
12. [Future roadmap](#12-future-roadmap)
13. [Glossary](#13-glossary)
14. [Elevator pitch](#14-elevator-pitch)

---

## 1. Executive summary

**CropGuardian** is a mobile-first web app that helps farmers **spot threats early**, **learn about common pests**, and **keep a record of what the camera saw** — all from a smartphone.

The app combines four tools in one:

1. **Live AI scanner** — point your camera at the field; the app draws boxes around cattle and other visible threats in real time.
2. **Farmer-friendly design** — big buttons, bottom navigation, and a dashboard you can read at a glance outdoors.
3. **Pest wiki** — a searchable guide to pests like locusts, fall armyworms, and aphids, with prevention tips.
4. **Alert history** — a log of past detections with time and field sector, so you can spot patterns over days or weeks.

Everything runs in the **browser**. Photos and video frames are **not sent to a cloud server** for analysis. That keeps the farm private and works better on patchy rural internet.

```mermaid
flowchart LR
    A[Open CropGuardian<br/>on phone] --> B[Scan field<br/>with camera]
    B --> C[AI highlights<br/>threats live]
    C --> D[Check wiki<br/>for pest advice]
    D --> E[Review alert<br/>history]
```

---

## 2. The problem in everyday terms

Farmers lose crops to problems that appear quickly and are easy to miss:

| Problem | What goes wrong |
|---------|-----------------|
| **Animals in the field** | Cows, horses, or sheep eat or trample crops — often at dawn or dusk |
| **Insects & pests** | Locusts, armyworms, and aphids can spread fast across a whole plot |
| **Late response** | Damage is noticed only after a full night or weekend |
| **Hard-to-use tech** | Many tools need fast internet, expensive cameras, or training |

CropGuardian is built for the farmer who already carries a phone and needs something **simple, fast, and private** — not another complicated dashboard meant for office workers.

---

## 3. What CropGuardian does

Think of CropGuardian as **four apps in one jacket**:

```mermaid
flowchart TB
    subgraph app [CropGuardian on your phone]
        SCAN[AI Scanner<br/>Live camera + alerts]
        UI[Dashboard<br/>Farm status at a glance]
        WIKI[Pest Wiki<br/>Know your enemy]
        LOG[Alert History<br/>What happened and when]
    end

    SCAN --> LOG
    WIKI --> SCAN
    UI --> SCAN
    UI --> LOG
    UI --> WIKI
```

| Part | One-line summary |
|------|------------------|
| **AI Scanner** | Watches the camera and warns you when something threatening appears |
| **Dashboard** | Shows farm health, active alerts, and system status |
| **Pest Wiki** | Teaches you how to identify and treat common pests |
| **Alert History** | Saves a timeline of detections for later review |

---

## 4. Feature 1 — Real-time AI scanner

### What you see

When you open the scanner and allow camera access, the app shows your **live field view** with **colored boxes** drawn around objects the AI recognizes. Each box includes:

- A **label** (for example: cow, bird, horse)
- A **confidence score** — how sure the AI is (shown as a percentage)
- A **“Threat Detected”** alert when something farm-relevant is found

```mermaid
sequenceDiagram
    participant Farmer
    participant Camera as Phone camera
    participant AI as COCO-SSD in browser
    participant Screen as Your screen

    Farmer->>Camera: Points phone at field
    loop Many times per second
        Camera->>AI: Sends current video frame
        AI->>AI: Finds objects + scores
        AI->>Screen: Draw bounding boxes
        alt Threat found
            Screen->>Farmer: "Threat Detected" alert
        end
    end
```

### What the scanner is best at

The scanner uses **COCO-SSD**, a pre-trained vision model that is strong at spotting **large, visible things**:

| Detected type | Why it matters on a farm |
|---------------|--------------------------|
| **Cattle** (cow) | Grazing or trampling crops |
| **Horse / sheep** | Livestock wandering into plots |
| **Bird** | Feeding on grain or seedlings |
| **Dog / cat** | Strays disturbing plants or storage |

For **tiny insects** (locusts, aphids), the live camera model is limited — those pests are better covered in the **Pest Wiki** (Section 6). Future versions plan **custom pest models** (see Roadmap).

### Privacy-first by design

The scanner never uploads your frames to a server for analysis. The neural network runs **inside your browser** using **TensorFlow.js**.

---

## 5. Feature 2 — Mobile-first field experience

CropGuardian is designed for **one hand, bright sun, and muddy pockets** — not for a desktop office.

### Design choices

| Choice | Why it helps farmers |
|--------|----------------------|
| **Mobile-first layout** | Buttons and text are sized for phones, not laptops |
| **Bottom navigation** | Thumb-friendly tabs while holding the phone |
| **Glassmorphism UI** | Clear, modern panels that stay readable outdoors |
| **Earthy forest tones** | Calm colors that fit an agritech feel and reduce eye strain |
| **Responsive dashboard** | See active threats, farm health, and vitals in one glance |

```mermaid
flowchart TB
    subgraph phone [Typical phone screen]
        TOP[Dashboard - status and vitals]
        MID[Main content - scanner wiki history]
        NAV[Bottom nav - one-thumb tabs]
    end

    TOP --> MID --> NAV
```

You open the site in **Chrome or Safari** on your phone — no app store download required today (PWA “install to home screen” is on the roadmap).

---

## 6. Feature 3 — Pest wiki

Not every threat shows up as a big object on camera. Some pests are small but devastating. The **Pest Wiki** is CropGuardian’s built-in **field encyclopedia**.

### What’s inside

- **Searchable pest directory** — find pests by name or browse categories
- **Expert-style entries** for common threats, including:
  - **Locusts**
  - **Fall armyworms**
  - **Aphids**
- **Identification guides** — what to look for on leaves, stems, or soil
- **Threat levels** — how urgent the problem is
- **Prevention methods** — both **organic** and **standard** treatment options

```mermaid
flowchart LR
    Q[Farmer sees<br/>damaged leaves] --> W[Open Pest Wiki]
    W --> ID[Identify pest<br/>from guide]
    ID --> ACT[Choose prevention<br/>organic or standard]
    ACT --> FIELD[Apply action<br/>in the field]
```

The wiki turns CropGuardian from “camera only” into a **complete assistant** — detect what you can see live, and **learn what you cannot**.

---

## 7. Feature 4 — Smart alert history

Every time the scanner flags a threat, CropGuardian can **log the event** to build a farm audit trail.

| Logged detail | Plain meaning |
|---------------|---------------|
| **Timestamp** | Exact date and time of detection |
| **Sector / location label** | Which part of the farm (e.g. North plot, Gate B) |
| **Detection type** | What the AI saw (cow, bird, etc.) |

```mermaid
flowchart TB
    M1[Mon 06:12 Bird near seedlings - North plot] --> L1[Logged]
    M2[Tue 19:40 Cow at fence - East gate] --> L2[Logged]
    M3[Thu 05:55 Bird flock - North plot] --> L3[Logged]
```

Over time, this helps answer questions like:

- *“Do cows always enter from the east gate at night?”*
- *“Are birds worse after harvest?”*
- *“Did our new fence reduce alerts?”*

---

## 8. How the AI works (plain English)

### Neural network

A **neural network** is software trained on thousands of example images. It learns patterns — “this shape and texture usually means cow” — without a human writing every rule by hand.

**COCO-SSD** is a ready-made detector trained on the **COCO dataset** (everyday photos with 80 object types). CropGuardian loads this model in the browser and runs it on each camera frame.

### Object detection vs. classification

| Task | Question answered |
|------|-------------------|
| **Classification** | “Is there a cow somewhere in this photo?” |
| **Object detection** | “There is a cow **here**, and a bird **there**” (with boxes) |

CropGuardian uses **detection** because a field may have **multiple threats at once**, and the farmer needs to know **where** to look.

```mermaid
flowchart LR
    FRAME[Camera frame] --> PREP[Prepare image]
    PREP --> MODEL[COCO-SSD model]
    MODEL --> FILTER[Keep farm-relevant<br/>detections only]
    FILTER --> DRAW[Draw boxes + scores]
    DRAW --> ALERT[Show Threat Detected<br/>if needed]
```

---

## 9. Why your data stays on the phone

```mermaid
flowchart TB
    subgraph cloud [Typical cloud AI app]
        C1[Photo uploaded] --> C2[Company server]
        C2 --> C3[Result sent back]
    end

    subgraph cg [CropGuardian]
        G1[Camera frame] --> G2[AI in browser]
        G2 --> G3[Result on screen]
    end
```

| | Cloud AI | CropGuardian |
|---|----------|--------------|
| Needs strong internet | Often yes | Works after first load |
| Who sees your field? | Third-party servers | **Only you** |
| Speed | Upload + wait | **Near real-time** |
| Rural connectivity | Pain point | **Designed around it** |

Field images can reveal **crop type, farm layout, and location**. Keeping inference on-device is a deliberate privacy choice for the farming community.

---

## 10. How the app is built

| Layer | Technology | Role |
|-------|------------|------|
| **Website framework** | Next.js 15 (App Router) | Fast, modern pages and routing |
| **Language** | JavaScript (ES6+) | Core application code |
| **AI engine** | TensorFlow.js + COCO-SSD | Load and run the vision model in-browser |
| **Icons** | Lucide React | Clear symbols for nav and alerts |
| **Styling** | Custom CSS (agritech theme) | Forest tones, glass panels, mobile layout |

```mermaid
flowchart TB
    subgraph frontend [Next.js app]
        PAGES[App Router pages]
        NAV[Bottom navigation]
        DASH[Dashboard]
        WIKI_UI[Pest Wiki UI]
        HIST[Alert history UI]
    end

    subgraph vision [TensorFlow.js]
        TF[Runtime]
        SSD[COCO-SSD weights]
    end

    PAGES --> NAV
    NAV --> DASH
    NAV --> WIKI_UI
    NAV --> HIST
    DASH --> TF
    TF --> SSD
    SSD --> DASH
```

**License:** MIT — free to use, modify, and share (see `LICENSE` in the repository).

---

## 11. Getting started

For developers or anyone setting up the project locally:

```bash
git clone <your-repo-url>
cd Cattle-Detection-Project
npm install
npm run dev
```

Then open **http://localhost:3000** on your phone or computer browser.

> **Tip for field testing:** Use your phone on the same Wi‑Fi as your computer, and visit your computer’s local network address (e.g. `http://192.168.x.x:3000`) to test the camera outdoors.

---

## 12. Future roadmap

CropGuardian is actively evolving. Planned improvements:

| Planned feature | Benefit |
|-----------------|---------|
| **PWA support** | Install to home screen + better offline use |
| **Regional languages** | Wiki and UI in local languages for wider reach |
| **Weather integration** | Humidity, rain, and soil moisture context for alerts |
| **Custom pest models** | Train detection on region-specific insects via transfer learning |

```mermaid
flowchart LR
    NOW[v1 Today<br/>Scanner + Wiki + History] --> PWA[PWA offline]
    PWA --> LANG[Local languages]
    LANG --> WX[Weather data]
    WX --> CUSTOM[Custom pest AI]
```

---

## 13. Glossary

| Term | Simple definition |
|------|-------------------|
| **AI / machine learning** | Software that learns from examples instead of fixed rules |
| **COCO-SSD** | A pre-built object detector that finds and labels things in images |
| **TensorFlow.js** | Runs machine-learning models inside a web browser |
| **Bounding box** | Colored rectangle drawn around a detected object |
| **Confidence score** | How sure the AI is (0–100%) |
| **Object detection** | Finding *what* something is and *where* it is |
| **Mobile-first** | Designed for phones before desktops |
| **Glassmorphism** | UI style with frosted, semi-transparent panels |
| **PWA** | Progressive Web App — website that can install like an app |
| **Transfer learning** | Starting from an existing AI model and teaching it new pests |
| **MIT License** | Open license allowing free use with minimal restrictions |

---

## 14. Elevator pitch

CropGuardian is a **mobile-first agricultural assistant** that puts **live threat detection**, a **pest encyclopedia**, and an **alert history log** in every farmer’s pocket. Using TensorFlow.js and COCO-SSD, it highlights cattle, birds, and other visible threats through the phone camera — with confidence scores and instant “Threat Detected” alerts — while keeping all image processing **on the device**. Combined with a searchable wiki for locusts, armyworms, and aphids, it helps farmers **see, learn, and remember** what happened in the field. Built with Next.js 15 for the farming community, under the MIT license.

**Developed with care for the farming community.**
$post_body$,
  '2026-05-31', true, false, 'engineering',
  array['agritech', 'tensorflow.js', 'computer-vision', 'privacy', 'next.js', 'coco-ssd']
)
on conflict (slug) do update set
  title = excluded.title, subtitle = excluded.subtitle,
  description = excluded.description, body = excluded.body,
  published_at = excluded.published_at, published = excluded.published,
  featured = excluded.featured, category = excluded.category,
  tags = excluded.tags, updated_at = now();
